import React, { Component } from 'react';
import ProfilePicture from '../../public/ProfilePicture/ProfilePicture';
import Title from '../../public/Title/Title';
import './ActivitiesPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHandPointRight, faGlassCheers, faBullhorn } from '@fortawesome/free-solid-svg-icons';

class ActivitiesPage extends Component {
   constructor(props) {
    super(props);
    this.state = {
       activity_todos: []
    }
   }

   componentDidMount() {
      this.props.auth.eventHandler({
         type: 'FRIENDS', 
         name: 'generate_activity_todos', 
         callback: () => this.setState({
            activity_todos: this.props.auth.state.friends.activity_todos
         })
       });
   }

   render() {
       return ( 
         <div className="activities-page-container">
            <Title header={'My Activity'}  
                   headerColor="#262626"
                   headerFontSize="40px"
                   subheader="# random-subheader" 
                   subheaderColor="#9639B3"
                   subheaderFontSize="24px"
                   textAlign="left"
                    />
            <ActivityList activity_todos={this.state.activity_todos} />
          </div>       
       )
   }
}

function Activity(props) {

   let color;
   let icon;
   if(props.nudge) {
      color = '#9639B3';
      icon = <FontAwesomeIcon icon={faHandPointRight} color='#9639B3' size="2x"/>
   } else {
      color = '#FABA34';
      icon = <FontAwesomeIcon icon={faGlassCheers} color='#FABA34' size="2x"/>
   }

   return (
      <div className="activity">
         <div className="left">
            <ProfilePicture color={color} />
            <p><span className='name' style={{ color }}>{props.full_name} </span>nudges you to <span className='text'>{props.text}</span></p>
         </div>
         <div className="right">
             {icon}
         </div>
      </div>
   )
}

function ActivityList(props) {
   const activity_todos = [...props.activity_todos];
   const list = activity_todos.map( (activity, i) => (
      <Activity key={i}
                full_name={activity.full_name}
                nudge={activity.nudge} 
                text={activity.text.toLowerCase()}/>
   ))
   return (
      <div className="activities-container">
           {list}
      </div>
   )
}

export default ActivitiesPage;
