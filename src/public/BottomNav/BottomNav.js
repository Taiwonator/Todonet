import React, { Component } from 'react';
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
    this.state = {
        selected: ''
    }
   }

   isSelected = (icon) => (icon === this.state.selected)

   selectIcon = (icon) => this.setState({ selected: icon })

   render() {
       return ( 
          <div className="bottom-nav-container">
            <button onClick={ () => this.selectIcon("home") }>
                <FontAwesomeIcon icon={faHome} color={ (this.isSelected('home') ? 'white': '#6F6F6F') } size="2x"/>
            </button>
            <button onClick={ () => this.selectIcon("search") }>
                <FontAwesomeIcon icon={faSearch} color={ (this.isSelected('search') ? 'white': '#6F6F6F') } size="2x"/>
            </button>
            <button style={ { backgroundColor: (this.isSelected('plus') ? '#993AEB': '#4e3b5f') } } onClick={ () => this.selectIcon("plus") }>
                <FontAwesomeIcon icon={faPlusSquare} color={ (this.isSelected('plus') ? 'white': '#6F6F6F') } size="3x"/>
            </button>
            <button onClick={ () => this.selectIcon("heart") }>
                <FontAwesomeIcon icon={faHeartbeat} color={ (this.isSelected('heart') ? 'white': '#6F6F6F') } size="2x"/>
            </button>
            <button onClick={ () => this.selectIcon("user") }>
                <FontAwesomeIcon icon={faUser} color={ (this.isSelected('user') ? 'white': '#6F6F6F') } size="2x"/>
            </button>
          </div>
       )
   }
}

export default BottomNav;

