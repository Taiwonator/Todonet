import React, { Component } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { app } from './fire';

const AppContext = React.createContext('app')

export class AppProvider extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            value: {
                state: {}, 
                eventHandler: this.eventHandler
             }
         }
    }

    eventHandler = (event) => {
        switch(event.name) {
            case 'get_data':
                this.getData();
                break;
            case 'set_user_data': 
                this.setUserData(event.data, event.callback);
                break;
            default:
                break;
        }
    }

    setUserData = (data, callback) => {
        this.setState((prevState) => ({
            value: {
                ...prevState.value, 
                state: data
            } 
        }), () => callback())
    }

    getData = () => {
        app.firestore().collection('todos').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                const todo = doc.data();
                console.log(todo);
            })
        })
    }

    render() {
        return ( 
            <AppContext.Provider value={this.state.value}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}

export const AppConsumer = AppContext.Consumer;