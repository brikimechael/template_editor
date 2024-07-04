import React, { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Button,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Card,
    CardHeader,
    CardContent,
    List,
    ListItem,
    ListItemText,
    SelectChangeEvent,
    ToggleButton,
    ToggleButtonGroup,
    ListItemSecondaryAction,
    IconButton,
} from '@mui/material';
import { PostAdd, Html, Code, CopyAll, SaveAlt, Delete, Add } from '@mui/icons-material';
import Editor from './Editor';
import { DelimiterType } from "../../types/commonTypes";

const delimiterOptions: DelimiterType[] = [
    { label: '[[]]', left: '[[', right: ']]' },
    { label: '${}', left: '${', right: '}' },
    { label: '{{}}', left: '{{', right: '}}' },
];
interface Section {
    id: number;
    content: string;
    isHtml: boolean;
}
const ModelWizard = () => {
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [modelName, setModelName] = useState('');
    const [content, setContent] = useState('');
    const [selectedDelimiter, setSelectedDelimiter] = useState(delimiterOptions[0]);
    const [sections, setSections] = useState<Section[]>([
        { id: 1, content: '', isHtml: false }
    ]);

    const handleAddSection = () => {
        setSections([...sections, {
            id: sections.length + 1,
            content: '',
            isHtml: false
        }]);
    };

    const handleRemoveSection = (id: number) => {
        setSections(sections.filter(section => section.id !== id));
    };

    const handleSectionChange = (id: number, newContent: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, content: newContent } : section
        ));
    };

    const handleSectionModeToggle = (id: number) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, isHtml: !section.isHtml } : section
        ));
    };

    const combinedContent = sections.map(section => section.content).join('\n');
    const handleHtmlModeToggle = (event: React.MouseEvent<HTMLElement>, newMode: boolean) => {
        setIsHtmlMode(newMode);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = () => {
        console.log("Finished:", { modelName, content, selectedDelimiter });
    };

    const handleEditorChange = (newContent: string) => {
        setContent(newContent);
    };

    const handleSelectDelimiterChange = (event: SelectChangeEvent<string>) => {
        const newDelimiter = delimiterOptions.find(option => option.label === event.target.value);
        if (newDelimiter) {
            setSelectedDelimiter(newDelimiter);
        }
    };



    const handleDownloadHTML = () => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `${modelName}.html`;
        document.body.appendChild(element);
        element.click();
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(content).then(() => {
            alert('Content copied to clipboard');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };
    const renderSections = () => (
        <List>
            {sections.map((section) => (
                <ListItem key={section.id}>
                    <ListItemText
                        primary={
                            <Editor
                                placeholder={`Enter ${section.isHtml ? 'HTML' : 'text'} content here...`}
                                onChange={(newContent) => handleSectionChange(section.id, newContent)}
                                value={section.content}
                                selectedDelimiter={selectedDelimiter}
                                delimiterOptions={delimiterOptions}
                                isHtmlMode={section.isHtml}
                                onHtmlChange={(newContent) => handleSectionChange(section.id, newContent)}
                            />
                        }
                    />
                    <ListItemSecondaryAction>
                        <ToggleButton
                            value={section.isHtml}
                            onChange={() => handleSectionModeToggle(section.id)}
                        >
                            {section.isHtml ? 'HTML' : 'Text'}
                        </ToggleButton>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveSection(section.id)}
                        >
                            <Delete />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <TextField
                            required
                            fullWidth
                            label="Model Name"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="select-delimiter">Delimiter</InputLabel>
                            <Select
                                labelId="select-delimiter"
                                label="Delimiter"
                                value={selectedDelimiter.label}
                                onChange={handleSelectDelimiterChange}
                            >
                                {delimiterOptions.map((option) => (
                                    <MenuItem key={option.label} value={option.label}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 1:
                return (
                    <Container maxWidth="md">
                        <Box mb={2} display="flex" justifyContent="space-between">
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAddSection}
                            >
                                Add Section
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<SaveAlt />}
                                onClick={handleDownloadHTML}
                            >
                                Download HTML
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<CopyAll />}
                                onClick={handleCopyToClipboard}
                            >
                                Copy to Clipboard
                            </Button>
                        </Box>
                        {renderSections()}
                    </Container>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card sx={{ margin: '20px' }}>
                                <CardHeader
                                    avatar={<PostAdd />}
                                    title="Infos"
                                />
                                <CardContent>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="Model Name" secondary={modelName} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Delimiter" secondary={selectedDelimiter.label} />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card sx={{ margin: '20px' }}>
                                <CardHeader
                                    avatar={<Code />}
                                    title="Raw Content"
                                />
                                <CardContent>
                                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                        {content}
                                    </pre>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card sx={{ margin: '20px' }}>
                                <CardHeader
                                    avatar={<Html />}
                                    title="Preview"
                                />
                                <CardContent>
                                    <div dangerouslySetInnerHTML={{ __html: combinedContent }} />
                                </CardContent>
                            </Card>
                        </Grid>
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

export default ModelWizard;