import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import './Wrapper.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BottomNav from '../../public/BottomNav/BottomNav';
import HomePage from '../HomePage/HomePage';
import FriendsPage from '../FriendsPage/FriendsPage';
import TodoPage from '../TodoPage/TodoPage';
import ActivitiesPage from '../ActivitiesPage/ActivitiesPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import TopNav from '../../public/TopNav/TopNav';
import SettingsPage from '../SettingsPage/SettingsPage';


class Wrapper extends Component {
   constructor(props) {
    super(props);
    this.state = {
        selectedIcon: '', 
        prevSelectedIcon: ''
    }
   }

   isSelected = (icon) => (icon === this.state.selected)

   selectIcon = (icon) => this.setState((prevState) => ({ prevSelectedIcon: prevState.selectedIcon, selected: icon }))

   render() {
       return ( 
           <Router>
           <TopNav isSelected={this.isSelected} selectIcon={this.selectIcon} prevSelectedIcon={this.state.prevSelectedIcon} />
           <div className="wrapper-container">
               
                   <Switch>

                        <Route exact={true} path="/app" 
                        render={(props) => (
                            <TodoPage {...props} />
                        )} /> 

                        <Route path="/friends" 
                        render={(props) => (
                            <FriendsPage {...props} />
                        )} /> 

                        <Route path="/activities" 
                        render={(props) => (
                            <ActivitiesPage {...props} />
                        )} /> 

                        <Route path="/profile" 
                        render={(props) => (
                            <ProfilePage {...props} />
                        )} /> 

                        <Route path="/home" 
                        render={(props) => (
                            <HomePage {...props} />
                        )} /> 

                        <Route path="/settings" 
                        render={(props) => (
                        <SettingsPage {...props} />
                        )} />

                   </Switch>
               
           </div>
           <BottomNav isSelected={this.isSelected} selectIcon={this.selectIcon} />
           </Router>
       )
   }
}

export default Wrapper;

