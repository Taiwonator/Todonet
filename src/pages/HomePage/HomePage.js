import React, { Component } from 'react';
import ProfilePicture from '../../public/ProfilePicture/ProfilePicture';
import Title from '../../public/Title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHandPointRight, faGlassCheers } from '@fortawesome/free-solid-svg-icons';
import './HomePage.scss';
import Delayed from '../../public/Delayed';

class HomePage extends Component {
   constructor(props) {
    super(props);
    this.state = {
      home_todos: this.props.auth.state.friends.home_todos
    }
   }

   componentDidMount() {
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'generate_home_todos', 
      callback: () => this.setState({
        home_todos: this.props.auth.state.friends.home_todos
      })
    });
   }

   showIntrest = (todo_id) => {

   }

   nudge = (todo_id) => {

    // INSTANT
    let list = [...this.state.home_todos];
    const home_todos = list.map( todo => {
      if(todo.todo_id == todo_id) {
        let nudges = todo.nudges;
        nudges.push(this.props.auth.state.app.user.uid);
        nudges = [...new Set(nudges)];
        todo.nudges = nudges;
      }
      return todo;
    })

    this.setState({
      home_todos
    })


    // NOT INSTANT
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'nudge_friend', 
      todo_id,
      callback: () => this.setState({
        home_todos: this.props.auth.state.friends.home_todos
      })
    });
   }

   celebrate = (todo_id) => {
    // INSTANT
    let list = [...this.state.home_todos];
    const home_todos = list.map( todo => {
      if(todo.todo_id == todo_id) {
        let celebrations = todo.celebrations;
        celebrations.push(this.props.auth.state.app.user.uid);
        celebrations = [...new Set(celebrations)];
        todo.celebrations = celebrations;
      }
      return todo;
    })

    this.setState({
      home_todos
    })

    // NOT INSTANT
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'celebrate_friend', 
      todo_id,
      callback: () => this.setState({
        home_todos: this.props.auth.state.friends.home_todos
      })
    });
   }

   removeNudge = (todo_id) => {
     // INSTANT
    let list = [...this.state.home_todos];
    const home_todos = list.map( todo => {
      if(todo.todo_id == todo_id) {
        let nudges = todo.nudges;
        nudges = nudges.filter(id => id != this.props.auth.state.app.user.uid)
        todo.nudges = nudges;
      }
      return todo;
    })

    this.setState({
      home_todos
    })

     // NOT INSTANT
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'remove_nudge_friend', 
      todo_id,
      callback: () => this.setState({
        home_todos: this.props.auth.state.friends.home_todos
      })
    });
   }

   removeCelebrate = (todo_id) => {
    // INSTANT
    let list = [...this.state.home_todos];
    const home_todos = list.map( todo => {
      if(todo.todo_id == todo_id) {
        let celebrations = todo.celebrations;
        celebrations = celebrations.filter(id => id != this.props.auth.state.app.user.uid)
        todo.celebrations = celebrations;
      }
      return todo;
    })

    this.setState({
      home_todos
    })

     // NOT INSTANT
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'remove_celebrate_friend', 
      todo_id,
      callback: () => this.setState({
        home_todos: this.props.auth.state.friends.home_todos
      })
    });
   }

   render() {
       return ( 
         <div className="home-page-container"> 
           <Title header={'Home'}  
                   headerColor="#262626"
                   headerFontSize="40px"
                   subheader="# what are your friends up to" 
                   subheaderColor="#9639B3"
                   subheaderFontSize="24px"
                   textAlign="left"
                    />
            {/* <Delayed waitBeforeShow={300}> */}
              <HomeTodoList 
                            home_todos={this.props.auth.state.friends.home_todos} 
                            // showIntrest={this.showIntrest}
                            nudge={this.nudge}
                            celebrate={this.celebrate}
                            removeNudge={this.removeNudge}
                            removeCelebrate={this.removeCelebrate}
                            auth={this.props.auth} />
            {/* </Delayed> */}
         </div>       
       )
   }

   // HomeTodo
}

function HomeTodoList(props) {
  const homeTodos = props.home_todos.map( (todo, i) => (
    <HomeTodo           key={i}
                        todo={todo}  
                        showIntrest={props.showIntrest}
                        nudge={props.nudge}
                        celebrate={props.celebrate}
                        removeNudge={props.removeNudge}
                        removeCelebrate={props.removeCelebrate}
                        auth={props.auth}/>
  ))

  return (
    <div className="home-todos-container">
      {(homeTodos.length > 0) ? homeTodos : <Title header={'No friend todos 👀'}  
                                                    headerColor="#262626"
                                                    headerFontSize="20px"
                                                    subheader="# Looks like your friends aren't doing much" 
                                                    subheaderColor="#FABA34"
                                                    subheaderFontSize="18px"
                                                    textAlign="left"
                                                      />}
    </div>
  )
}

function HomeTodo(props) {  
  let color;
  let button;
  if(props.todo.marked) {
    color = '#FABA34';
    if(props.todo.celebrations.includes(props.auth.state.app.user.uid)) {
      button = <button onClick={() => props.removeCelebrate(props.todo.todo_id)}>
                  <FontAwesomeIcon icon={faGlassCheers} color='#FABA34' size="2x"/>
                </button>
    } else {
      button = <button onClick={() => props.celebrate(props.todo.todo_id)}>
                  <FontAwesomeIcon icon={faGlassCheers} color='#BEBEBE' size="2x"/>
               </button>
    }
  } else {
    color = '#9639B3';
    if(props.todo.nudges.includes(props.auth.state.app.user.uid)) {
      button = <button onClick={() => props.removeNudge(props.todo.todo_id)}>
                  <FontAwesomeIcon icon={faHandPointRight} color='#9639B3' size="2x"/>
                </button>
    } else {
      button = <button onClick={() => props.nudge(props.todo.todo_id)}>
                  <FontAwesomeIcon icon={faHandPointRight} color='#BEBEBE' size="2x"/>
                </button>
    }
  }

  const full_name = (props.todo.full_name) ? props.todo.full_name : props.todo.user_id.id;

  return (
    <div className="home-todo">
      <div className="top-row">
        <ProfilePicture color={color}/>
        <h3>{full_name}</h3>
      </div>
      <div className="bottom-row">
        <div className="left">
          <p><span style={{color}}>{(props.todo.marked) ? 'Done' : 'To do'}</span> - {props.todo.text}</p>
        </div>
        <div className="right">
          <div className="home-buttons">
            {/* <button onClick={() => props.showIntrest(props.todo.todo_id)}><FontAwesomeIcon icon={faHeart} color='#BEBEBE' size="2x"/></button> */}
            {button}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;

