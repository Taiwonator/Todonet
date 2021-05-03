import React, { Component } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { app } from './fire';

const AppContext = React.createContext('hello')

export class AppProvider extends Component {
    constructor(props) {
        super(props)
    }

    detailsEventHandler(event) {
        switch(event.name) {
            case 'get_data':
                this.getData();
                break;
            default:
                break;
        }
    }

    getData() {
        app.firestore().collection('todos').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                const todo = doc.data();
                console.log(todo);
            })
        })
    }

    render() {
        return ( 
            <AppContext.Provider value='hello'>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}

export const AppConsumer = AppContext.Consumer;