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
    }
   }

   routeToIcon = (route) => {
        switch(route) {
            case '/app': 
                return 'plus';
            case '/app/home': 
                return 'home';
            case '/app/friends': 
                return 'search';
            case '/app/activities': 
                return 'heart';
            case '/app/profile': 
                return 'user';
            case '/app/settings': 
                return 'cog';
            default:
                return 'user';
        }
   }

   isSelected = (icon) => (icon === this.state.selected)

   selectIcon = (icon) => this.setState(({ selected: icon }))

   render() {
      
       return ( 
           <Router>
           <TopNav isSelected={this.isSelected} selectIcon={this.selectIcon} routeToIcon={this.routeToIcon}/>
           <div className="wrapper-container">
               
                   <Switch>

                        <Route exact path="/app" 
                        render={(props) => (
                            <TodoPage {...props} />
                        )} /> 

                        <Route path="/app/friends" 
                        render={(props) => (
                            <FriendsPage {...props} />
                        )} /> 

                        <Route path="/app/activities" 
                        render={(props) => (
                            <ActivitiesPage {...props} />
                        )} /> 

                        <Route path="/app/profile" 
                        render={(props) => (
                            <ProfilePage {...props} />
                        )} /> 

                        <Route path="/app/home" 
                        render={(props) => (
                            <HomePage {...props} />
                        )} /> 

                        <Route path="/app/settings" 
                        render={(props) => (
                        <SettingsPage {...props} />
                        )} />

                   </Switch>
               
           </div>
           <BottomNav isSelected={this.isSelected} selectIcon={this.selectIcon} routeToIcon={this.routeToIcon}/>
           </Router>
       )
   }
}

export default Wrapper;

