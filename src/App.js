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

class App extends Component {
  
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {

    return (
      <Router>
          <Switch>

            <Route exact path="/" 
                   render={(props) => (
                    <LandingPage {...props} switchTo={this.switchTo} switchBack={this.switchBack} />
                   )} />

            <Route path="/login" 
                   render={(props) => (
                    <LoginPage {...props} switchTo={this.switchTo} switchBack={this.switchBack} />
                   )} />

            <Route path="/signup" 
                   render={(props) => (
                    <SignupPage {...props} switchTo={this.switchTo} switchBack={this.switchBack} />
                   )} /> 

          </Switch>

      </Router>
    );
  }
}

export default App;
