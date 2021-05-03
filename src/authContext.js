import React, { Component } from 'react'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { app } from './fire';

const AuthContext = React.createContext('auth')

export class AuthProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    // eventHandler
    detailsEventHandler(event) {
        switch(event.name) {
            case 'create_user':
                this.createUser(event.fullname, event.email, event.password);
                break;
            case 'login_user':
                this.loginUser(event.email, event.password);
                break;
            case 'logout_user':
                this.logoutUser();
                break;
            case 'get_current_user': 
                this.getCurrentUser();
                break;
            default:
                break;
        }
    }

    // create account 
    createUser(fullname, email, password) {
        app.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                alert('user created successfully');
                console.log(user);
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert('error');
                console.log(errorMessage, errorCode);
                // ..
            });
    }

    // login 
    loginUser(email, password) {
        app.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                alert('logged in successfully');
                console.log(user);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage, errorCode);
            });
    }

    // logout 
    logoutUser() {
        app.auth().signOut().then(() => {
            alert('signout complete');
        }).catch((error) => {
            console.log(error);
        });
    }

    // get current user 
    getCurrentUser() {
        app.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user);
        } else {
            console.log('no user');
        }
        });
    }


    render() {
        return ( 
            <AuthContext.Provider value={ 'auth working' }>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export const AuthConsumer = AuthContext.Consumer;