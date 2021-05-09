import React, { Component } from 'react';
import Title from '../../public/Title/Title';
import './PleaseLoginPage.scss';
import { withRouter } from 'react-router-dom';

class PleaseLoginPage extends Component {
   constructor(props) {
    super(props);
   }

   directToLogin() {
    this.props.history.push('/')
   }

   render() {
       return ( 
         <div className="please-login-page-container" onClick={ () => this.directToLogin() } > 
           <Title header="Todonet."  
                      headerColor="#9639B3"
                      headerFontSize="70px"
                      subheader="Click anywhere to login" 
                      subheaderColor="black"
                      subheaderFontSize="20px"
                      textAlign="center" 
                      />
        </div>       
       )
   }
}

export default withRouter(PleaseLoginPage);

