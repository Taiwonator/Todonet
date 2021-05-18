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
import { AuthConsumer, AuthProvider } from './authContext';

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
        <Router>
          
            <Switch>

              <Route exact path="/" 
                    render={(props) => (
                      <LandingPage {...props} auth={this.props.auth} />
              )} />

              <Route path="/app" 
                    render={(props) => (
                        <Wrapper {...props} auth={this.props.auth} />
                )} />  

                <Route path="/login" 
                      render={(props) => (
                            <LoginPage {...props} auth={this.props.auth} />
                  )} />

                <Route path="/signup" 
                      render={(props) => (
                            <SignupPage {...props} auth={this.props.auth} />
                  )} /> 

            </Switch>

        </Router>
    );
  }
}

export default App;
