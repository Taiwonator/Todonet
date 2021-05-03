import React, { Component } from 'react';
import { eventCall } from '../../controllers/EventHandler';
import './ProfilePage.scss';

class ProfilePage extends Component {
   constructor(props) {
    super(props);
    this.state = { user: '' }
   }

   componentDidMount() {
     this.getUser();
   }

   getUser() {
    var user = eventCall({
        type: 'DETAILS', 
        name: 'get_current_user'
    })
   }

   render() {
       return ( 
         <div> Profile </div>       
       )
   }
}

export default ProfilePage;

