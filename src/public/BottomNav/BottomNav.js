import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './BottomNav.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

class BottomNav extends Component {
   constructor(props) {
    super(props);
   }

   openPage(page, icon) {
    this.props.selectIcon(icon);
    this.props.history.push(page);
   }

   render() {
       return ( 
          <div className="bottom-nav-container">
            <button onClick={ () => this.openPage("/home", "home") }>
                <FontAwesomeIcon icon={faHome} color={ (this.props.isSelected('home') ? 'white': '#6F6F6F') } size="2x"/>
            </button>
            <button onClick={ () => this.openPage("/friends", "search") }>
                <FontAwesomeIcon icon={faSearch} color={ (this.props.isSelected('search') ? 'white': '#6F6F6F') } size="2x"/>
            </button>
            <button style={ { backgroundColor: (this.props.isSelected('plus') ? '#993AEB': '#4e3b5f') } } onClick={ () => this.openPage("/app", "plus") }>
                <FontAwesomeIcon icon={faPlusSquare} color={ (this.props.isSelected('plus') ? 'white': '#6F6F6F') } size="3x"/>
            </button>
            <button onClick={ () => this.openPage("/activities", "heart") }>
                <FontAwesomeIcon icon={faHeartbeat} color={ (this.props.isSelected('heart') ? 'white': '#6F6F6F') } size="2x"/>
            </button>
            <button onClick={ () => this.openPage("/profile", "user") }>
                <FontAwesomeIcon icon={faUser} color={ (this.props.isSelected('user') ? 'white': '#6F6F6F') } size="2x"/>
            </button>
          </div>
       )
   }
}

export default withRouter(BottomNav);

