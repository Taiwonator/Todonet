import React, { Component } from 'react';
import './App.scss';
import LandingPage from './pages/LandingPage/LandingPage.js';
import LoginPage from './pages/LoginPage/LoginPage.js';
import SignupPage from './pages/SignupPage/SignupPage.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Wrapper from './pages/Wrapper/Wrapper';
import { AppProvider } from './context';
import { AuthProvider } from './authContext';

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      details: {
        name: 'dummy'
      }
    }
  }

  render() {

    return (
      <AuthProvider>

        <Router>
          
            <Switch>

              <Route exact path="/" 
                    render={(props) => (
                      <LandingPage {...props} />
                    )} />

              <Route path="/app" 
                    render={(props) => (
                      <AppProvider><Wrapper {...props} /></AppProvider>
                    )} />  

                <Route path="/login" 
                      render={(props) => (
                        <LoginPage {...props} />
                      )} />

                <Route path="/signup" 
                      render={(props) => (
                        <SignupPage {...props} />
                      )} /> 

            </Switch>

        </Router>

      </AuthProvider>
    );
  }
}

export default App;
