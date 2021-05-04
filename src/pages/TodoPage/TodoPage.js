import React, { Component } from 'react';
import './TodoPage.scss';
import Title from '../../public/Title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

class TodoPage extends Component {
   constructor(props) {
    super(props);
    this.state = {
      todo_list: [ { id: new Date(), text: 'Hello good sir / madam', checked: false } ], 
      input_value: ''
    }
   }

   handleInputChange = (e) => {
    const value = e.target.value;
    console.log(e.key);
    this.setState((prevState) => ({
      ...prevState, 
      input_value: value
    }))
   }

   addTodo = (text) => {
    let todo_list = [...this.state.todo_list];
    todo_list.push({
      id: new Date(), 
      text, 
      checked: false
    })
    this.setState((prevState) => ({
      ...prevState, 
      todo_list, 
      input_value: ''
    }))
   }

   checkTodo = (id) => {
      let todo_list = [...this.state.todo_list];
      for(var i = 0; i < todo_list.length; i++) {
        let todo = todo_list[i];
        if(todo.id === id) {
          todo.checked = !todo.checked;
        }
      }
            
      this.setState((prevState) => ({
        ...prevState, 
        todo_list
      }))
   }

   deleteTodo = (id) => {
    let todo_list = [...this.state.todo_list];

    todo_list = todo_list.filter( todo => todo.id !== id )

    this.setState((prevState) => ({
      ...prevState, 
      todo_list
    }))

   }

   render() {
       return ( 
         <div className="todo-page-container">  
            <Title header="TODAY."  
                   headerColor="#262626"
                   headerFontSize="60px"
                   subheader="Don't forget to have fun :)" 
                   subheaderColor="#993AEB"
                   subheaderFontSize="24px"
                   textAlign="left"
                    />
            <TodoList todo_list={this.state.todo_list} 
                      checkTodo={this.checkTodo} 
                      deleteTodo={this.deleteTodo} 
                      input_value={this.state.input_value} 
                      handleInputChange={this.handleInputChange}
                      addTodo={this.addTodo}/>
         </div>       
       )
   }
}

export default TodoPage;

// Props: text, checked | Functions: check(), delete()
function Todo(props) {

  return (
    <div className={`todo ${(props.checked) ? 'checked' : ''}`}>
      <div className="left" onClick={() => props.checkTodo(props.id)}>
        <input type="checkbox" />
        <p>{props.text}</p>
      </div>
      <div className="right">
        <button onClick={ () => props.deleteTodo(props.id) }><FontAwesomeIcon icon={faTrash} color='#FABA34' size="2x"/></button>
      </div>
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
            id={todo.id}
            text={todo.text} 
            checked={todo.checked} 
            checkTodo={props.checkTodo}
            deleteTodo={props.deleteTodo} />
    )
  })
  return (<div className="todo-list-container">
            {list}
            <TodoInput text={props.input_value} handleInputChange={props.handleInputChange} addTodo={props.addTodo}/>
          </div> )
}

// check item x
// delete item x
// add item 