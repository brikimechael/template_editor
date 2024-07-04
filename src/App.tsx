import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SmsGrid from './components/Sms/SmsGrid';
import HtmlEditor from './components/Editor/HtmlEditor';
import { AppBar, Toolbar, Typography, Button, Container, Grid } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import NotFound from './components/Common/NotFound';
const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sms Poc
          </Typography>
          <Button color="inherit" component={Link} to="/sms-details"><SmsIcon/></Button>
          <Button color="inherit" component={Link} to="/html-editor"><IntegrationInstructionsIcon/></Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/sms-details" element={<SmsGrid />} />
          <Route path="/html-editor" element={<HtmlEditor />} />
          <Route path="/" element={<Home />} />
          <Route  path ="*" element={<NotFound />} />

        </Routes>
      </Container>
    </Router>
  );
};

const Home: React.FC = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h2" align="center" gutterBottom>Welcome to the SMS POC</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center">Choose an option from the navigation above.</Typography>
      </Grid>
    </Grid>
  );
};

export default App;
