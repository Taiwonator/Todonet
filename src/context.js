import React, { Component } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { app } from './fire';
import { androidEventHandler } from './controllers/AndroidHandler';

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
            case 'get_user_data': 
                this.getUserData(event.callback);
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
        }), () => {
            // this.eventHandler({
            //     type: 'DETAILS', 
            //     name: 'get_user_data', 
            //     callback: () => console.log("user data success retreived")
            // })
            callback();
        })
    }

    getData = () => {
        app.firestore().collection('todos').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                const todo = doc.data();
                console.log(todo);
            })
        })
    }

    getUserData = (callback) => {
        app.firestore().collection('users').doc(this.state.user.uid).get().then(doc => {
            let name = doc.data().full_name;
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, name }
                }
            }), () => callback())
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