import React, { Component } from 'react';
import Title from '../../public/Title/Title';
import SettingsButton from './SettingsButton';
import './SettingsPage.scss';
import { eventCall } from '../../controllers/EventHandler';

class SettingsPage extends Component {
   constructor(props) {
    super(props);
   }

   componentDidMount() {
    
   }

   logoutUser() {
      this.props.auth.eventHandler({
        type: 'DETAILS', 
        name: 'logout_user', 
        callback: () => console.log('logged out successfully done')
      })
   }

   render() {
       return ( 
          <div className="settings-page-container">
            <Title header="Settings."  
                    headerColor="#27272E"
                    headerFontSize="40px"
                    textAlign="left" 
            />   
            <div className="settings-buttons-container">
                <SettingsButton text="Get email" onClick={() => eventCall({ type: 'ANDROID', name: 'message', message: this.props.auth.state.app.user.email })} color={'black'}/>
                <SettingsButton text="Logout" onClick={() => this.logoutUser()} color={'#9639B3'} noIcon={true} bold={true}/>
            </div>
          </div> 

       )
   }
}
export default SettingsPage;

