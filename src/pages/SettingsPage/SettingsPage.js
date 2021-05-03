import React, { Component } from 'react';
import Title from '../../public/Title/Title';
import SettingsButton from './SettingsButton';
import './SettingsPage.scss';
import { eventCall } from '../../controllers/EventHandler';
import { AppConsumer } from '../../context';

class SettingsPage extends Component {
   constructor(props) {
    super(props);
   }

   componentDidMount() {
    
   }

   logoutUser() {
    eventCall({
      type: 'DETAILS', 
      name: 'logout_user' 
    })
   }

   render() {
       return ( 
         <AppConsumer>
            {(props) => {
              console.log(props);
              return (
                <div className="settings-page-container">
                          <Title header="Settings."  
                                  headerColor="#27272E"
                                  headerFontSize="40px"
                                  textAlign="left" 
                          />   
                          <div className="settings-buttons-container">
                              <SettingsButton text="Settings 1" onClick={() => eventCall({ type: 'ANDROID', name: 'message', message: 'Settings 1' })} color={'black'}/>
                              <SettingsButton text="Settings 2" onClick={() => alert('2')} color={'black'}/>
                              <SettingsButton text="Settings 3" onClick={() => alert('3')} color={'black'}/>
                              <SettingsButton text="Settings 4" onClick={() => alert('4')} color={'black'}/>
                              <SettingsButton text="Logout" onClick={() => this.logoutUser()} color={'#9639B3'} noIcon={true}/>
                          </div>
                        </div> 
              )
            }}
          </AppConsumer>
       )
   }
}
export default SettingsPage;

