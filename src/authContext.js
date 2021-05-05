import React, { Component } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { app } from './fire';
import { androidEventHandler } from './controllers/AndroidHandler';

const AuthContext = React.createContext('auth')

export class AuthProvider extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            value: {
                state: {
                    loggedIn: false,
                    user: ''
                }, 
                eventHandler: this.eventHandler
             }
         }
    }

    callAlert(message) {
        alert(message);
        androidEventHandler({
            type: 'ANDROID', 
            name: 'message', 
            message 
        })
    }

    // eventHandler
    eventHandler = (event) => {
        switch(event.name) {
            case 'create_user':
                this.createUser(event.fullname, event.email, event.password, event.callback);
                break;
            case 'login_user':
                this.loginUser(event.email, event.password, event.callback);
                break;
            case 'logout_user':
                this.logoutUser(event.callback);
                break;
            case 'get_current_user': 
                this.getCurrentUser();
                break;
            default:
                break;
        }
    }

    // create account 
    createUser = (fullname, email, password, callback) => {
        app.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                return app.firestore().collection('users').doc(user.uid).set({
                    user_id: user.uid,
                    full_name: fullname, 
                    todo_ids: [], 
                    friend_ids: []
                }).then(() => {
                    
                    // return app.firestore().collection('todos').doc(user.uid).set({
                    //     id: `todo_${new Date()}`, text: `click me ${fullname}`, date: new Date(), checked: false
                    // }).then(() => {
                        
                        this.callAlert('User successfully created');
                        this.setState((prevState) => ({
                            value: {
                                ...prevState.value, 
                                state: { ...prevState.value.state, loggedIn: true, user }
                            }
                        }), () => callback())
                    // })    
                })
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
    loginUser = (email, password, callback) => {
        app.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                this.getUserData(user, callback);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage, errorCode);
            });
    }

    // logout 
    logoutUser = (callback) => {
        app.auth().signOut().then(() => {
            this.callAlert('Sign out successfull');

            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, loggedIn: false, user: '' }
                }
            }), () => callback())
            
        }).catch((error) => {
            console.log(error);
        });
    }

    // get current user 
    getCurrentUser = () => {
        app.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user);
        } else {
            console.log('no user');
        }
        });
    }

    getUserData = (user, callback) => {
        app.firestore().collection('users').doc(user.uid).get().then(doc => {
            const userDetails = doc.data();
            let todo_list = [];
            userDetails.todo_ids.forEach( todo => {
                app.firestore().collection('todos').doc(todo).get().then(doc => {
                    todo_list.push(doc.data());
                })
            })
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, todo_list, name: userDetails.full_name, loggedIn: true, user }
                }
            }), () => {this.callAlert('Log in successfull'); callback(); })
        })
    }

    render() {
        return ( 
            <AuthContext.Provider value={ this.state.value }>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export const AuthConsumer = AuthContext.Consumer;