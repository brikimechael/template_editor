import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import ModelWizard from './components/Editor/ModelWizard';
import {AppBar, Button, Container, Grid, Toolbar, Typography} from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import NotFound from './components/Common/NotFound';
import EventsGrid from "./components/Events/EventsGrid";
import EntrepriseEmailEditor from "./components/Editor/EntrepriseEmailEditor";
import ResumeTranslator from "./components/Resume/ResumeTranslator";

const App: React.FC = () => {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                       Templates
                    </Typography>
                    <Button color="inherit" component={Link} to="/events"><SmsIcon/></Button>
                    <Button color="inherit" component={Link} to="/editor"><IntegrationInstructionsIcon/></Button>
                    <Button color="inherit" component={Link} to="/email"><IntegrationInstructionsIcon/></Button>
                    <Button color="inherit" component={Link} to="/resume"><DriveFileRenameOutlineIcon/></Button>
                </Toolbar>
            </AppBar>
            <Container sx={{marginTop: '20px'}}>
                <Routes>
                    <Route path="/email" element={<EntrepriseEmailEditor/>}/>
                    <Route path="/events" element={<EventsGrid/>}/>
                    <Route path="/editor" element={<ModelWizard/>}/>
                    <Route path="/resume" element={<ResumeTranslator/>} />
                    <Route path="/" element={<Home/>}/>
                    <Route path="*" element={<NotFound/>}/>

                </Routes>
            </Container>
        </Router>
    );
};

const Home: React.FC = () => {
    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
                <Typography variant="h2" align="center" gutterBottom>Template POC</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" align="center">Choose an option from the navigation above.</Typography>
            </Grid>
        </Grid>
    );
};

export default App;
