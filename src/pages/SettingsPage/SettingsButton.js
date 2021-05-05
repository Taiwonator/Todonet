import React, { Component } from 'react';
import './SettingsButton.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faRulerHorizontal, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class SettingsButton extends Component {
   constructor(props) {
    super(props);
   }
    
   

   render() {
       return ( 
         <div className="settings-button-container" onClick={() => this.props.onClick()}>
             { (this.props.noIcon) ? '' : <FontAwesomeIcon icon={faCog} color='#27272E' size="2x"/> }
             <h3 className={`${ (this.props.bold) ? 'bold' : '' }`} style={{ color: this.props.color }}>{this.props.text}</h3>
        </div>  
       )
   }
}

export default SettingsButton;

