import React, { useState, useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { AppBar, Toolbar, IconButton, Select, MenuItem, Box, Container, Dialog, DialogTitle, DialogContent, Paper, TextField, Button, Stepper, Step, StepLabel, InputLabel, FormControl, Grid, Card, CardHeader, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, FormatColorText, FormatColorFill, Image, Code, Html, Visibility, ViewComfy, PostAdd } from '@mui/icons-material';
import { SketchPicker, ColorChangeHandler } from 'react-color';
import DOMPurify from 'dompurify';
import CloseIcon from '@mui/icons-material/Close';

Quill.register('modules/imageResize', ImageResize);

const CustomDelimiterSelect = () => {
  const quill = Quill.import('core/quill');
  return (
    <Select
      value="${}"
      onChange={(e) => {
        const quillElement = document.querySelector('.quill-editor');
        if (quillElement) {
          const quill = Quill.find(quillElement as Element);
          if (quill) {
            const selection = quill.getSelection();
            if (selection) {
              const text = quill.getText(selection.index, selection.length);
              let wrappedText;
              switch (e.target.value) {
                case '${}':
                  wrappedText = `\${${text}}`;
                  break;
                case "[[]]":
                  wrappedText = `[[${text}]]`;
                  break;
                case "{{}}":
                  wrappedText = `{{${text}}}`;
                  break;
                default:
                  wrappedText = text;
                  break;
              }
              quill.deleteText(selection.index, selection.length);
              quill.insertText(selection.index, wrappedText);
            }
          }
        }
      }}
      sx={{ ml: 1, mr: 1, minWidth: 70 }}
    >
      <MenuItem value="${}">{'${}'}</MenuItem>
      <MenuItem value="[[]]">{'[[]]'}</MenuItem>
      <MenuItem value="{{}}">{'{{}}'}</MenuItem>
    </Select>
  );
};

// Add custom delimiter button to toolbar
const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
      <option value="1">Heading</option>
      <option value="2">Subheading</option>
      <option value="">Normal</option>
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <select className="ql-color" />
    <select className="ql-background" />
    <button className="ql-link" />
    <button className="ql-image" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-indent" value="-1" />
    <button className="ql-indent" value="+1" />
    <CustomDelimiterSelect />
    <button className="ql-code-block" />
  </div>
);

const HtmlEditor: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [editorState, setEditorState] = useState({
    modelName: '',
    content: '',
    delimiter: '${}',
    showColorPicker: false,
    currentColor: '#000000',
    colorPickerType: 'text',
    displayMode: 'both'
  });

  const quillRef = useRef<ReactQuill>(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    console.log("Finished:", editorState);
  };

  const handleColorChange: ColorChangeHandler = (color) => {
    setEditorState(prev => ({ ...prev, currentColor: color.hex }));
    const editor = quillRef.current?.getEditor();
    if (editor) {
      if (editorState.colorPickerType === 'text') {
        editor.format('color', color.hex);
      } else {
        editor.format('background', color.hex);
      }
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorState(prev => ({ ...prev, content }));
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: '#toolbar',
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background',
    'code-block'
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        // Model Setup step (unchanged)
        return (
          <Box>
            <TextField
              required
              fullWidth
              label="Model Name"
              value={editorState.modelName}
              onChange={(e) => setEditorState(prev => ({ ...prev, modelName: e.target.value }))}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-delimiter">Delimiter</InputLabel>
              <Select
                labelId="select-delimiter"
                label="Delimiter"
                value={editorState.delimiter}
                onChange={(e) => setEditorState(prev => ({ ...prev, delimiter: e.target.value as string }))}
                margin="dense"
              >
                <MenuItem value="${}">{'${}'}</MenuItem>
                <MenuItem value="[[]]">{'[[]]'}</MenuItem>
                <MenuItem value="{{}}">{'{{}}'}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 1:
        // Template Editor step
        return (
          <Container maxWidth="md">
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Select
                value={editorState.displayMode}
                onChange={(e) => setEditorState(prev => ({ ...prev, displayMode: e.target.value as string }))}
              >
                <MenuItem value="html"><Html /></MenuItem>
                <MenuItem value="preview"><Visibility /></MenuItem>
                <MenuItem value="both"><ViewComfy /></MenuItem>
              </Select>
            </Box>

            <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
              {(editorState.displayMode === 'preview' || editorState.displayMode === 'both') && (
                <Box>
                  <CustomToolbar />
                  <ReactQuill
                    ref={quillRef}
                    value={editorState.content}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    className="quill-editor"
                  />
                </Box>
              )}
              {(editorState.displayMode === 'html' || editorState.displayMode === 'both') && (
                <TextField
                  multiline
                  fullWidth
                  variant="outlined"
                  value={editorState.content}
                  onChange={(e) => setEditorState(prev => ({ ...prev, content: e.target.value }))}
                  InputProps={{
                    style: { 
                      direction: 'ltr', 
                      textAlign: 'left', 
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap'
                    }
                  }}
                />
              )}
            </Paper>

            <Dialog open={editorState.showColorPicker} onClose={() => setEditorState(prev => ({ ...prev, showColorPicker: false }))}>
              <DialogTitle>
                {editorState.colorPickerType === 'text' ? 'Text Color' : 'Background Color'}
                <IconButton
                  onClick={() => setEditorState(prev => ({ ...prev, showColorPicker: false }))}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <SketchPicker color={editorState.currentColor} onChange={handleColorChange} />
              </DialogContent>
            </Dialog>
          </Container>
        );
      case 2:
        // Preview step (unchanged)
        return (
          <Grid item xs={12}>
            <Card sx={{margin:'20px'}}>
              <CardHeader 
                avatar={<PostAdd />} 
                title="Infos" 
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText primary="Model Name" secondary={editorState.modelName} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Delimiter" secondary={editorState.delimiter} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            
            <Card sx={{margin:'20px'}}>
              <CardHeader 
                avatar={<Html />} 
                title="Content" 
              />
              <CardContent>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editorState.content) }} />
              </CardContent>
            </Card>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Stepper activeStep={activeStep}>
        <Step><StepLabel>Model Setup</StepLabel></Step>
        <Step><StepLabel>Template Editor</StepLabel></Step>
        <Step><StepLabel>Preview</StepLabel></Step>
      </Stepper>
      <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2 }}>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === 2 ? (
            <Button onClick={handleFinish}>Finish</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default HtmlEditor;