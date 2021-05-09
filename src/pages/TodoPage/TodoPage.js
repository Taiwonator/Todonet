import React, { Component } from 'react';
import './TodoPage.scss';
import Title from '../../public/Title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import Delayed from '../../public/Delayed';

class TodoPage extends Component {
   constructor(props) {
    super(props);
    this.state = {
      todo_list: props.todo_list, 
      input_value: ''
    }
   }

   handleInputChange = (e) => {
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState, 
      input_value: value
    }))
   }

   addTodo = (text) => {

    // INSTANT
    let todo_list = [...this.state.todo_list];
    todo_list.push(this.newTodo(text))
    this.setState((prevState) => ({
      ...prevState, 
      todo_list,
      input_value: ''
    }))

    // NOT INSTANT
    this.props.auth.eventHandler({
      type: 'TODO',
      name: 'add_todo',
      text, 
      callback: () => this.setState((prevState) => ({
                        ...prevState, 
                        todo_list: this.props.todo_list, 
                      }))
    })
   }

   newTodo = (text) => ({ id: `todo_${new Date()}`, text, date: new Date(), marked: false }) 

   checkTodo = (todo_id) => {
     
    //INSTANT
    let todo_list = [...this.state.todo_list];
    let list = [];
    for(var i = 0; i < todo_list.length; i++) {
      let todo = {...todo_list[i]};
      if(todo.todo_id == todo_id) {
        todo.marked = !todo.marked;
      } 
      list.push(todo);
    }
    
    this.setState((prevState) => ({
      ...prevState, 
      todo_list: list
    }))
    
    // NOT INSTANT
      this.props.auth.eventHandler({
        type: 'TODO',
        name: 'mark_todo',
        todo_id, 
        callback: () => true
      })

   }

   publicTodo = (todo_id) => {
     //INSTANT
    let todo_list = [...this.state.todo_list];
    let list = [];
    for(var i = 0; i < todo_list.length; i++) {
      let todo = {...todo_list[i]};
      if(todo.todo_id == todo_id) {
        todo.public = !todo.public;
      } 
      list.push(todo);
    }
    
    this.setState((prevState) => ({
      ...prevState, 
      todo_list: list
    }))

    // NOT INSTANT
    this.props.auth.eventHandler({
      type: 'TODO',
      name: 'public_todo',
      todo_id, 
      callback: () => true
      })
   }

   deleteTodo = (todo_id) => {
    let todo_list = [...this.state.todo_list];
    todo_list = todo_list.filter( todo => todo.todo_id !== todo_id )
    this.setState((prevState) => ({
      ...prevState, 
      todo_list
    }))

     // NOT INSTANT
     this.props.auth.eventHandler({
      type: 'TODO',
      name: 'delete_todo',
      todo_id, 
      callback: () => this.setState((prevState) => ({
                      ...prevState, 
                      todo_list: this.props.todo_list
                    }))
      })

   }

   render() {
       return ( 
         <div className="todo-page-container"> 
          { (!this.props.profile) ? <Title header="TODAY."  
                                          headerColor="#262626"
                                          headerFontSize="60px"
                                          subheader={`# don't forget to have fun 🎉 `}
                                          subheaderColor="#9639B3"
                                          subheaderFontSize="24px"
                                          textAlign="left"
                                            /> : '' }
            
              <TodoList todo_list={this.state.todo_list} 
                        checkTodo={this.checkTodo} 
                        deleteTodo={this.deleteTodo} 
                        publicTodo={this.publicTodo}
                        input_value={this.state.input_value} 
                        handleInputChange={this.handleInputChange}
                        addTodo={this.addTodo}
                        profile={this.props.profile}/>
         </div>       
       )
   }
}

export default TodoPage;

// Props: text, marked | Functions: check(), delete()
function Todo(props) {

  const checkTodo = () => {
    if(!props.profile) { 
      props.checkTodo(props.todo_id) 
    }
  }

  return (
    <div className={`todo ${(props.marked) ? 'marked' : ''}  ${(props.profile) ? 'yellow' : ''}`}>
      <div className="left" onClick={() => checkTodo()}> 
        <input type="checkbox" style={ { background: (props.profile && props.marked) ? '#FABA34' : '' } }/>
        <p>{props.text}</p>
      </div>
       { (!props.profile) ? <div className="right">
                              <button onClick={ () => props.deleteTodo(props.todo_id) }><FontAwesomeIcon icon={faTrash} color='#FABA34' size="2x"/></button>
                              <button onClick={ () => props.publicTodo(props.todo_id)}><FontAwesomeIcon icon={faBullhorn} color={`${ (props.public) ? '#9639B3' : '#BEBEBE'}`} size="2x"/></button>
                            </div> : '' }
      
    </div>
  )
}

function TodoInput(props) {
  return (
    <div className={`todo input`}>
      <div className="left">
        <input type="checkbox" />
        <input type="text" 
               value={props.text} 
               placeholder="type text here" 
               onChange={props.handleInputChange}
               onKeyPress={ e => { if(e.key === 'Enter') { props.addTodo(props.text) }  } }/>
      </div>
    </div>
  )
}

function TodoList(props) {
  let todo_list = [...props.todo_list];
  let list = todo_list.map((todo, i) => {
  return (
      <Todo key={i} 
            todo_id={todo.todo_id}
            text={todo.text} 
            marked={todo.marked} 
            checkTodo={props.checkTodo}
            deleteTodo={props.deleteTodo}
            publicTodo={props.publicTodo}
            profile={props.profile} 
            public={todo.public}/>
    )
  })
  return (<div className="todo-list-container" style={{ alignItems: (!props.profile) ? '' : '' }}>
            {list}
            { (!props.profile) ? <TodoInput text={props.input_value} handleInputChange={props.handleInputChange} addTodo={props.addTodo}/> : '' }
          </div> )
}

// check item x
// delete item x
// add item 