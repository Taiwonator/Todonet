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
import { AuthConsumer } from '../../authContext';
import PleaseLoginPage from '../PleaseLoginPage/PleaseLoginPage';
import Delayed from '../../public/Delayed';


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
       if(this.props.auth.state.app.loggedIn) {
        return ( 
            <Router>
            <TopNav isSelected={this.isSelected} selectIcon={this.selectIcon} routeToIcon={this.routeToIcon}/>
            <div className="wrapper-container">
                
                    <Switch>
                        
                         <Route exact path="/app" 
                         render={(props) => (
                             <AuthConsumer>
                                 {auth => (
                                        <TodoPage {...props} auth={auth} todo_list={auth.state.todo.todo_list}/>
                                 )}
                             </AuthConsumer>
                         )} /> 
 
                         <Route path="/app/friends" 
                         render={(props) => (
                             <AuthConsumer>
                                 {auth => (
                                     <FriendsPage {...props} 
                                                      auth={auth}
                                                      friends={auth.state.friends.friends_obj}
                                                      users={auth.state.friends.users} 
                                                      />
                                 )}
                             </AuthConsumer>
                         )} /> 
 
                         <Route path="/app/activities" 
                         render={(props) => (
                            <AuthConsumer>
                                { auth => (
                                    <ActivitiesPage {...props} auth={auth} />
                                )}
                             </AuthConsumer>
                         )} /> 
 
                         <Route path="/app/profile" 
                         render={(props) => (
                             <AuthConsumer>
                                 {auth => (
                                    <ProfilePage {...props} auth={auth} full_name={auth.state.app.full_name} todo_list={auth.state.todo.todo_list}/>
                                 )}
                             </AuthConsumer>
                         )} /> 
 
                         <Route path="/app/home" 
                         render={(props) => (
                             <AuthConsumer>
                                 {auth => (
                                        <HomePage {...props} auth={auth} home_todos={auth.state.friends.home_todos} />
                                 )}
                             </AuthConsumer>
                         )} /> 
 
                         <Route path="/app/settings" 
                         render={(props) => (
                         <AuthConsumer>
                             { auth => (
                                 <SettingsPage {...props} auth={auth} />
                             ) }
                         </AuthConsumer>
                         )} />
 
                    </Switch>
                
            </div>
            <BottomNav isSelected={this.isSelected} selectIcon={this.selectIcon} routeToIcon={this.routeToIcon}/>
            </Router>
        )
       } else {
           return (
               <PleaseLoginPage />
           )
       }
       
   }
}

export default Wrapper;

