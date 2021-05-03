import React, { Component } from 'react';
import './ProfilePage.scss';

class ProfilePage extends Component {
   constructor(props) {
    super(props);
    this.state = { user: '' }
   }


   render() {
       return ( 
         <div> Profile </div>       
       )
   }
}

export default ProfilePage;

