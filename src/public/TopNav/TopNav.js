import React, { Component } from 'react';
import './TopNav.scss';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class TopNav extends Component {
   constructor(props) {
    super(props);
   }

   openPage(page, icon) {
        this.props.selectIcon(icon);
        this.props.history.push(page)
    }

    goBack() {
        this.openPage('/app', 'plus')
    }

   render() {
       let element;
       if(this.props.isSelected('cog')) {
        element = <button onClick={ () => this.goBack() }><FontAwesomeIcon icon={faTimesCircle} color='red' size="3x"/></button>
       } else {
        element = <button onClick={ () => this.openPage("/settings", "cog") }><FontAwesomeIcon icon={faCog} color='#27272E' size="3x"/></button>
       }

       return ( 
        <div className="top-nav">
            { element }
        </div>      
       )
   }
}

export default withRouter(TopNav);

