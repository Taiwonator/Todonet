import React, { Component } from 'react';
import './TopNav.scss';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class TopNav extends Component {
   constructor(props) {
    super(props);
   }

//    componentWillMount() {
//     this.unlisten = this.props.history.listen((location, action) => {
//         console.log(window.location.pathname);
//         this.props.selectIcon(this.props.routeToIcon(window.location.pathname))
//     });
//   }
//   componentWillUnmount() {
//       this.unlisten();
//   }

   openPage(page, icon) {
        this.props.history.push(page)
        // this.props.selectIcon(this.props.routeToIcon(window.location.pathname))

    }

    goBack() {
        this.props.history.goBack();
        // this.props.selectIcon(this.props.routeToIcon(window.location.pathname))
    }


   render() {
    // console.log(window.location.pathname);

       let element;
       if(this.props.isSelected('cog')) {
        element = <button onClick={ () => this.goBack() }><FontAwesomeIcon icon={faTimesCircle} color='red' size="3x"/></button>
       } else {
        element = <button onClick={ () => this.openPage("/app/settings", "cog") }><FontAwesomeIcon icon={faCog} color='#27272E' size="3x"/></button>
       }

       return ( 
        <div className="top-nav">
            {element}
        </div>      
       )
   }
}

export default withRouter(TopNav);

