import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Wrapper.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import BottomNav from '../../public/BottomNav/BottomNav';
import ProfilePage from './ProfilePage/ProfilePage.js';

class Wrapper extends Component {
   constructor(props) {
    super(props);
   }

   render() {
       return ( 
           <>
           <div className="top-bar">
                <button onClick={ () => console.log("widget clicked") }><FontAwesomeIcon icon={faCog} color='#27272E' size="3x"/></button>
            </div>
           <div className="wrapper-container">
               
               
           </div>
           <BottomNav />
           </>
       )
   }
}

export default withRouter(Wrapper);

