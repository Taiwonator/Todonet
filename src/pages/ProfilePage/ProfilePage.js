import React, { Component } from 'react';
import Title from '../../public/Title/Title';
import './ProfilePage.scss';

class ProfilePage extends Component {
   constructor(props) {
    super(props);
    this.state = { user: '' }
   }


   render() {
       return ( 
         <div className="profile-page-container"> 
            <Title header={this.props.app.state.user.email}  
                   headerColor="#262626"
                   headerFontSize="40px"
                   subheader="#random-tag" 
                   subheaderColor="#993AEB"
                   subheaderFontSize="24px"
                   textAlign="left"
                    />
         </div>       
       )
   }
}

export default ProfilePage;

