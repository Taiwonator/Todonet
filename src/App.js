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
import { DetailsContext } from './controllers/details-context';

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
                    <LandingPage {...props} />
                   )} />

            <DetailsContext.Provider value={ this.state.details }>

              <Route path="/login" 
                    render={(props) => (
                      <LoginPage {...props} />
                    )} />

              <Route path="/signup" 
                    render={(props) => (
                      <SignupPage {...props} />
                    )} /> 
            
            </DetailsContext.Provider>


          </Switch>

      </Router>
    );
  }
}

export default App;
