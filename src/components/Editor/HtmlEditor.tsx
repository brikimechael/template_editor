import React, { useState, useRef } from 'react';
import { AppBar, Toolbar, IconButton, Select, MenuItem, Box, Container, Dialog, DialogTitle, DialogContent, Paper, TextField, Button, Stepper, Step, StepLabel, InputLabel, FormControl, Grid, Card, CardHeader, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, FormatColorText, FormatColorFill, Image, Code, Html, Visibility, ViewComfy, PostAdd, Margin } from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import DOMPurify from 'dompurify';
import CloseIcon from '@mui/icons-material/Close';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import PostAddIcon from '@mui/icons-material/PostAdd';
const HtmlEditor = () => {
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

  const contentEditableRef = useRef<HTMLElement>(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    console.log("Finished:", editorState);
  };

  const applyStyle = (command: string, value: string | undefined = undefined) => {
    if (!contentEditableRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let newElement: HTMLElement;
    switch (command) {
      case 'bold':
        newElement = document.createElement('strong');
        break;
      case 'italic':
        newElement = document.createElement('i');
        break;
      case 'underline':
        newElement = document.createElement('u');
        break;
      case 'foreColor':
        newElement = document.createElement('span');
        newElement.style.color = value || '';
        break;
      case 'hiliteColor':
        newElement = document.createElement('span');
        newElement.style.backgroundColor = value || '';
        break;
      default:
        return;
    }

    newElement.textContent = selectedText;
    range.deleteContents();
    range.insertNode(newElement);

    range.setStartAfter(newElement);
    range.setEndAfter(newElement);
    selection.removeAllRanges();
    selection.addRange(range);

    updateContent();
  };

  const handleColorChange = (color: { hex: string }) => {
    setEditorState(prev => ({ ...prev, currentColor: color.hex }));
    applyStyle(editorState.colorPickerType === 'text' ? 'foreColor' : 'hiliteColor', color.hex);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        const imgElement = document.createElement('img');
        imgElement.src = base64Image;
        imgElement.alt = file.name;
        imgElement.style.maxWidth = '100%';

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.insertNode(imgElement);
          range.setStartAfter(imgElement);
          range.setEndAfter(imgElement);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        updateContent();
      };
      reader.readAsDataURL(file);
    }
  };

  const wrapSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        let wrappedText;
        switch (editorState.delimiter) {
          case '${}':
            wrappedText = `\${${selectedText}}`;
            break;
          case "[[]]":
            wrappedText = `[[${selectedText}]]`;
            break;
          case "{{}}":
            wrappedText = `{{${selectedText}}}`;
            break;
          default:
            wrappedText = selectedText;
            break;
        }
        const textNode = document.createTextNode(wrappedText);
        range.deleteContents();
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        updateContent();
      }
    }
  };

  const updateContent = () => {
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.innerHTML;
      setEditorState(prev => ({ ...prev, content: newContent }));
    }
  };

  const handleEditorChange = (evt: ContentEditableEvent) => {
    const newContent = evt.target.value;
    setEditorState(prev => ({ ...prev, content: newContent }));
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorState(prev => ({ ...prev, content: newContent }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
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
              <FormControl fullWidth margin="normal"
              >

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
                      <AppBar position="static" color="default" sx={{ mb: 2 }}>
                        <Toolbar variant="dense">
                          <IconButton
                              onClick={() => applyStyle('bold')}
                              //color={contentEditableRef.current?.querySelector('strong') ? 'primary' : 'default'}
                          >
                            <FormatBold />
                          </IconButton>
                          <IconButton
                              onClick={() => applyStyle('italic')}
                              //color={contentEditableRef.current?.querySelector('em') ? 'primary' : 'default'}
                          >
                            <FormatItalic />
                          </IconButton>
                          <IconButton onClick={() => applyStyle('underline')}><FormatUnderlined /></IconButton>
                          <IconButton onClick={() => setEditorState(prev => ({ ...prev, colorPickerType: 'text', showColorPicker: true }))}><FormatColorText /></IconButton>
                          <IconButton onClick={() => setEditorState(prev => ({ ...prev, colorPickerType: 'background', showColorPicker: true }))}><FormatColorFill /></IconButton>
                          <IconButton component="label">
                            <Image />
                            <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                          </IconButton>
                          <Select
                              value={editorState.delimiter}
                              onChange={(e) => setEditorState(prev => ({ ...prev, delimiter: e.target.value as string }))}
                              sx={{ ml: 1, mr: 1, minWidth: 70 }}
                          >
                            <MenuItem value="${}">{'${}'}</MenuItem>
                            <MenuItem value="[[]]">{'[[]]'}</MenuItem>
                            <MenuItem value="{{}}">{'{{}}'}</MenuItem>
                          </Select>
                          <IconButton onClick={wrapSelection}><Code /></IconButton>
                        </Toolbar>
                      </AppBar>
                      <ContentEditable
                          html={DOMPurify.sanitize(editorState.content)}
                          disabled={false}
                          onChange={handleEditorChange}
                          tagName="div"
                          innerRef={contentEditableRef}
                          style={{
                            direction: 'ltr',
                            textAlign: 'left',
                            border: '1px solid #ccc',
                            minHeight: '200px',
                            padding: '10px',
                            whiteSpace: 'pre-wrap',
                            unicodeBidi: 'plaintext'
                          }}
                      />
                    </Box>
                )}
                {(editorState.displayMode === 'html' || editorState.displayMode === 'both') && (
                    <TextField
                        multiline
                        fullWidth
                        variant="outlined"
                        value={editorState.content}
                        onChange={handleHtmlChange}
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
        return (
            <Grid item xs={12} >
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
          </DialogContent>      </Dialog>
      </Container>
  );
};

export default HtmlEditor;