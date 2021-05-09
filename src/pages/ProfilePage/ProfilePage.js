import React, { Component } from 'react';
import Button from '../../public/Button/Button';
import ProfilePicture from '../../public/ProfilePicture/ProfilePicture';
import ProfileStat from '../../public/ProfileStat/ProfileStat';
import Title from '../../public/Title/Title';
import TodoPage from '../TodoPage/TodoPage';
import './ProfilePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class ProfilePage extends Component {
   constructor(props) {
    super(props);
    this.state = { user: '', completedTasks: '', activeTasks: '' }
   }

   componentDidMount() {
      this.setCompletedTasks();
   }

   setCompletedTasks() {
      let complete = 0;
      let active = 0;
      this.props.todo_list.forEach(todo => {
         if(todo.marked) {
            complete++;
         } else {
            active++;
         }
      })
      this.setState((prevState) => ({
         ...prevState, 
         completedTasks: complete, 
         activeTasks: active
      }))
   }


   render() {
       return ( 
         <div className="profile-page-container"> 
         { 
            (this.props.goBack) ? 
            
            <div className="make-row">
               <button onClick={() => this.props.goBack()}><FontAwesomeIcon icon={faArrowLeft} color='#FABA34' size="4x"/></button>
               <div>
                  <Title header={this.props.full_name}  
                        headerColor="#262626"
                        headerFontSize="40px"
                        subheader="# random-tag" 
                        subheaderColor="#9639B3"
                        subheaderFontSize="24px"
                        textAlign="left"
                        /> 
               </div>
            </div>

            : 

            <Title header={this.props.full_name}  
            headerColor="#262626"
            headerFontSize="40px"
            subheader="# random-tag" 
            subheaderColor="#9639B3"
            subheaderFontSize="24px"
            textAlign="left"
             />
         }
            
            
            <div className="profile-top-row">
               <div className="left">
                  <ProfilePicture />
               </div>
               <div className="right">
                  { (this.props.goBack) ? 
                  <Button  text="Remove Friend" 
                           bgColor="#FABA34" 
                           textColor="white" 
                           textAlign="center"
                           borderColor="white"
                           onClick={ () => this.props.removeFriend(this.props.user_id)}
                  />
                  : 
                  ''
                  }
                  <div className="profile-stats">
                     <ProfileStat number={this.state.completedTasks} label={'Completed tasks'} />
                     <ProfileStat number={this.state.activeTasks} label={'Active tasks'} />
                  </div>
               </div>
            </div>
            <TodoPage auth={this.props.auth} todo_list={this.props.todo_list} profile={true}/>
            { ((this.state.activeTasks == 0) && (this.props.todo_list.length > 0)) ? <Button text="CELEBRATE 🎉" 
                                                                                             bgColor="#9639B3" 
                                                                                             textColor="white" 
                                                                                             textAlign="center"
                                                                                             borderColor="white"
                                                                                             onClick={ () => console.log('whoop whoop 🎉') }
                                                                                             /> : ''  }
            

         </div>       
       )
   }
}

export default ProfilePage;

