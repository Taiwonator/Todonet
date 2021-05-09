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
                    app: {
                        loggedIn: false,
                        user: '', 
                        full_name: ''
                    }, 
                    todo: {
                        todo_ids: [], 
                        todo_list: [], 
                    }, 
                    friends: {
                        users: [],
                        friends_obj: {}, 
                        home_todos: [],
                        activity_todos: [],

                        full_name: 'steve', 
                        todo_list: [], 
                        user_id: ''
                    },
                }, 
                eventHandler: this.eventHandler, 
                gets: {
                    getTodosCompleted: this.getTodosCompleted, 
                    getTodosActive: this.getTodosActive
                }
             }
         }
        //  this.unsubscribe;
    }

    componentWillUnmount() {
        if(this.unsubscribe) {
            this.unsubscribe();
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
        switch(event.type) {
            case 'DETAILS': 
                this.detailsEventHandler(event);
                break;
            case 'TODO': 
                this.todoEventHandler(event);
                break;
            case 'FRIENDS':
                this.friendsEventHandler(event)
                break;
            default: 
                break;
        }
    }

    detailsEventHandler = (event) => {
        switch(event.name) {
            case 'create_user':
                this.createUser(event.full_name, event.email, event.password, event.callback);
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

    newUser = (user_id, full_name) => ({
            user_id,
            full_name,
            todo_ids: [], 
            friend_ids: [], 
            friend_request_received_ids: [], 
            friend_request_sent_ids: [], 
    })

    // create account 
    createUser = (full_name, email, password, callback) => {
        app.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                return app.firestore().collection('users').doc(user.uid).set(this.newUser(user.uid, full_name)).then(() => {
                    this.callAlert('User successfully created');
                    this.setState((prevState) => ({
                        value: {
                            ...prevState.value, 
                            state: { ...prevState.value.state,
                                        app: {
                                            ...prevState.value.state.app, 
                                            loggedIn: true, 
                                            user, 
                                            full_name
                                        }
                                        
                                   }
                                }
                    }), () => callback())

                    this.addTodoItem(`Hello ${full_name}, welcome to todonet.`, () => console.log("New user todos made"));
                    
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
                // Loads user data, todos and friends
                this.getAllData(user, () => { this.callAlert('Log in successful'); callback() })

                // Detect changes
                this.unsubscribe = app.firestore().collection("users").doc(user.uid)
                    .onSnapshot((doc) => {
                        this.getAllData(user, () => console.log('Something happened 👀'));
                });
                
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
                    state: { ...prevState.value.state,
                        app: {
                            ...prevState.value.state.app, 
                            loggedIn: false, 
                            user: ''
                        } 
                    }
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

            // Get todos
            if(userDetails) {
                userDetails.todo_ids.forEach( todo => {
                    app.firestore().collection('todos').doc(todo).get().then(doc => {
                        todo_list.push(doc.data());
                    })
                })
            }


            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, 

                             todo: {
                                ...prevState.value.state.todo,
                                todo_list, 
                                todo_ids: userDetails.todo_ids,
                             },

                             app: {
                                ...prevState.value.state.app,
                                loggedIn: true, 
                                user, 
                                full_name: userDetails.full_name
                             }

                    }
                }
            }), () => { callback(); })
        })
    }


    getAllData = (user, callback) => {
        // get logged in user's data (info + todos)
        // get friends -> generate 
        // get friend requests (friends page)
        // get all users (friends page)
        this.getUserData(user,  () => this.getFriendData(callback));
    }
















    todoEventHandler = (event) => {
        switch(event.name) {
            case 'add_todo':
                this.addTodoItem(event.text, event.callback);
                break;
            case 'mark_todo':
                this.markTodoItem(event.todo_id, event.callback);
                break;
            case 'delete_todo': 
                this.deleteTodoItem(event.todo_id, event.callback)
                break;
            case 'public_todo':
                this.publicTodoItem(event.todo_id, event.callback)
                break;
            default:
                break;
        }
    }

    getTodos = (todo_ids, callback) => {
        let todos = []
        todo_ids.forEach(todo_id => {
            app.firestore().collection('todos').doc(todo_id).get().then(doc => {
                todos.push(doc.data())
            })
        })
        callback(todos);
    }

    newTodo = (text, todo_id, full_name) => ({
        date: new Date(), 
        marked: false, 
        text, 
        todo_id,
        user_id: app.firestore().doc('users/' + this.state.value.state.app.user.uid), 
        public: false, 
        full_name, 
        nudges: [], 
        celebrations: []
    })

    // Add todo
    addTodoItem = (text, callback) => {
        let ref = app.firestore().collection('todos').doc();
        const data = this.newTodo(text, ref.id, this.state.value.state.app.full_name);
        ref.set(data).then(() => {
            app.firestore().collection('users').doc(this.state.value.state.app.user.uid).update('todo_ids', [...this.state.value.state.todo.todo_ids, ref.id])
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, 
                                todo: {
                                    ...prevState.value.state.todo, 
                                    todo_ids: [...prevState.value.state.todo.todo_ids, ref.id], 
                                    todo_list: [...prevState.value.state.todo.todo_list, data] 
                                }
                           }
                }
            }), () => callback())
        })
    }

    markTodoItem = (todo_id, callback) => {
        app.firestore().collection('todos').doc(todo_id).get().
        then(doc => {
            if (doc.exists) {
                console.log('update success');
                return doc.ref.update({ marked: !doc.data().marked });
            } else {
                console.error(`${todo_id} doesn't exist`);
            }
        }).then(() => {
            let todo_list = this.state.value.state.todo.todo_list;
            todo_list = todo_list.map(todo => {
                if(todo.todo_id == todo_id) {
                    todo.marked = !todo.marked;
                }
                return todo;
            })
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, todo_list }
                }
            }), () => callback())

        })
    }

    deleteTodoItem = (todo_id, callback) => {
        app.firestore().collection('todos').doc(todo_id).delete().then(() => {
            app.firestore().collection('users').doc(this.state.value.state.app.user.uid).get().then((doc) => {
                const todo_ids_list = doc.data().todo_ids;
                let todo_ids = todo_ids_list.filter(x => x != todo_id);
                
                const current_todo_list = this.state.value.state.todo.todo_list;
                let todo_list = current_todo_list.filter(todo => todo.todo_id != todo_id)
                
                doc.ref.update('todo_ids', todo_ids).then(() => {
                    this.setState((prevState) => ({
                        value: {
                            ...prevState.value, 
                            state: { ...prevState.value.state, 
                                        todo: {
                                            ...prevState.value.state.todo,
                                            todo_list, todo_ids
                                        }
                                   }
                        }
                    }), () => callback())
                })
            })
        })
        
    }

    publicTodoItem = (todo_id, callback) => {
        app.firestore().collection('todos').doc(todo_id).get().then(doc => {
            if (doc.exists) {
                console.log('update success');
                return doc.ref.update({ public: !doc.data().public }).then(() => console.log("public updated")).catch(err => console.log(err));
            } else {
                console.error(`${todo_id} doesn't exist`);
            }
        }).then(() => {
            let todo_list = this.state.value.state.todo.todo_list;
            todo_list = todo_list.map(todo => {
                if(todo.todo_id == todo_id) {
                    todo.public = !todo.public;
                }
                return todo;
            })
            console.log(todo_list)
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, todo_list }
                }
            }), () => callback())

        })
    }

    getTodosCompleted = () => {
        let todos = this.state.value.state.todo.todo_list.filter(todo => todo.marked == true);
        return todos.length;
    }

    getTodosActive = () => {
        let todos = this.state.value.state.todo.todo_list.filter(todo => todo.marked == false);
        return todos.length;
    }


























    friendsEventHandler = (event) => {
        switch(event.name) {
            case 'get_users': 
                this.getUsers(event.callback);
                break;
            case 'get_friends':
                this.getFriends(event.callback);
                break;
            case 'get_friend_requests':
                this.getFriendRequests(event.callback);
                break;
            case 'get_friends_data':
                this.getFriendData(event.callback);
                break;
            case 'select_friend_todos': 
                this.selectFriendTodos(event.user_id, event.callback)
                break;
            case 'send_friend_request':
                this.sendFriendRequest(event.user_id, event.callback)
                break;
            case 'accept_friend_request':
                this.acceptFriendRequest(event.user_id, event.callback)
                break;
            case 'decline_friend_request':
                this.declineFriendRequest(event.user_id, event.callback)
                break;
            case 'remove_friend':
                this.removeFriend(event.user_id, event.callback);
                break;
            case 'nudge_friend':
                this.addToNudges(event.todo_id, this.state.value.state.app.user.uid, event.callback);
                break;
            case 'remove_nudge_friend':
                this.removeFromNudges(event.todo_id, this.state.value.state.app.user.uid, event.callback);
                break;
            case 'celebrate_friend':
                this.addToCelebrations(event.todo_id, this.state.value.state.app.user.uid, event.callback);
                break;
            case 'remove_celebrate_friend':
                this.removeFromCelebrations(event.todo_id, this.state.value.state.app.user.uid, event.callback);
                break;
            case 'generate_home_todos':
                this.generateHomeTodos(event.callback);
                break;
            case 'generate_activity_todos': 
                this.generateActivityTodos(event.callback);
                break;
            default:
                break;
        }
    }

    getFriendData = (callback) => {
        this.getFriends(callback);
        this.getFriendRequests(() => this.getUsers(() => console.log("gotten users")));
    }
    
    getUsers = (callback) => {
        app.firestore().collection('users').get().then((querySnapshot) => {
            let user_list = [];
            querySnapshot.forEach(doc => {

                const friends_ids = Object.keys(this.state.value.state.friends.friends_obj);

                const userObj = {
                    user_id: doc.data().user_id, 
                    full_name: doc.data().full_name, 
                    requestSent: this.state.value.state.friends.friend_request_sent_ids.includes(doc.data().user_id),
                    requestReceived: this.state.value.state.friends.friend_request_received_ids.includes(doc.data().user_id), 
                    isFriend: friends_ids.includes(doc.data().user_id)
                }
                if(userObj.user_id != this.state.value.state.app.user.uid) {
                    user_list.push(userObj)
                }
            })
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, 
                                friends: {
                                    ...prevState.value.state.friends,
                                    users: user_list
                                }
                           }
                }
            }), () => callback())
        })
    }

    getFriends = (callback) => {
        app.firestore().collection('users').doc(this.state.value.state.app.user.uid).get().then((doc) => {
            const friend_ids = doc.data().friend_ids;
            this.friendListeners  = {};
            friend_ids.forEach(id => {
                app.firestore().collection('users').doc(id).get().then((friend) => {

                    this.friendListeners[id] = app.firestore().collection("users").doc(id)
                        .onSnapshot((doc) => {
                            // this.getAllData(this.state.value.state.app.user.uid, () => console.log('Friend account changed 👀'));
                            console.log('friend profile changed');
                    });

                    this.getTodos(friend.data().todo_ids, (todo_list) => {
                        this.setState((prevState) => ({
                            value: {
                                ...prevState.value, 
                                state: { ...prevState.value.state, 
                                            friends: {
                                                ...prevState.value.state.friends,
                                                friends_obj: {
                                                    ...prevState.value.state.friends.friends_obj,
                                                    [friend.data().user_id]: {
                                                        full_name: friend.data().full_name, 
                                                        todo_list, 
                                                        user_id: friend.data().user_id
                                                    }
                                                }
                                            }
                                       }
                            }
                        }))

                    })
                })

            })
        }).then(() => callback()) 
    }

    getFriendRequests = (callback) => {
        app.firestore().collection('users').doc(this.state.value.state.app.user.uid).get().then((doc) => {
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, 
                                friends: {
                                    ...prevState.value.state.friends,
                                    friend_request_sent_ids: doc.data().friend_request_sent_ids, 
                                    friend_request_received_ids: doc.data().friend_request_received_ids
                                }
                           }
                }
            }), () => callback())
        })
    }

    selectFriendTodos = (friend_id, callback) => {
        const friend = this.state.value.state.friends.friends_obj[friend_id];
        if(friend) {
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, 
                                friends: {
                                    ...prevState.value.state.friends,
                                    full_name: friend.full_name, 
                                    todo_list: friend.todo_list, 
                                    user_id: friend.user_id
                                }
                        }
                }
            }), () => callback())
        } else {
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, 
                                friends: {
                                    ...prevState.value.state.friends,
                                    full_name: 'Add me as a friend :)', 
                                    todo_list: []
                                }
                        }
                }
            }), () => callback())
        }
    }

    sendFriendRequest = (friend_id, callback) => {
        this.addToRequests(friend_id, this.state.value.state.app.user.uid)
        this.addToSents(this.state.value.state.app.user.uid, friend_id)
        callback();
    }

    acceptFriendRequest = (user_id, callback) => {
        // Remove from user requests
        this.removeFromRequests(this.state.value.state.app.user.uid, user_id)

        // // Add to user's friends
        this.addToFriends(this.state.value.state.app.user.uid, user_id)

        // // Remove from user sends
        this.removeFromSents(user_id, this.state.value.state.app.user.uid)

        // // Add to friend's friends
        this.addToFriends(user_id, this.state.value.state.app.user.uid)

        callback();
    }

    removeFriend = (user_id, callback) => {
        this.removeFromFriends(user_id, this.state.value.state.app.user.uid);
        this.removeFromFriends(this.state.value.state.app.user.uid, user_id);
        callback();
    }

    declineFriendRequest = (user_id, callback) => {
        // Remove from user requests
        this.removeFromRequests(this.state.value.state.app.user.uid, user_id)

        // // Remove from user sends
        this.removeFromSents(user_id, this.state.value.state.app.user.uid)
        
        callback();
    }

    // Add to requests
    addToRequests = (doc_id, user_id) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_request_received_ids = doc.data().friend_request_received_ids;
            friend_request_received_ids.push(user_id);
            friend_request_received_ids = [ ...new Set(friend_request_received_ids) ];
            doc.ref.update('friend_request_received_ids', friend_request_received_ids);
        })
    }

    // Remove from request
    removeFromRequests = (doc_id, user_id) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_request_received_ids = doc.data().friend_request_received_ids;
            friend_request_received_ids = friend_request_received_ids.filter( request => request != user_id );
            friend_request_received_ids = [ ...new Set(friend_request_received_ids) ];
            doc.ref.update('friend_request_received_ids', friend_request_received_ids);
        })
    }

    // Add to friends
    addToFriends = (doc_id, user_id) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_ids = doc.data().friend_ids;
            friend_ids.push(user_id);
            friend_ids = [ ...new Set(friend_ids) ];
            doc.ref.update('friend_ids', friend_ids);
        })
    }

    // Remove from friends
    removeFromFriends = (doc_id, user_id) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_ids = doc.data().friend_ids;
            friend_ids = friend_ids.filter(id => id != user_id)
            friend_ids = [ ...new Set(friend_ids) ];
            doc.ref.update('friend_ids', friend_ids);
        })
    }

    // Add to sents
    addToSents = (doc_id, user_id) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_request_sent_ids = doc.data().friend_request_sent_ids;
            friend_request_sent_ids.push(user_id);
            friend_request_sent_ids = [ ...new Set(friend_request_sent_ids) ];
            doc.ref.update('friend_request_sent_ids', friend_request_sent_ids);
        })
    }

    // Remove from sents
    removeFromSents = (doc_id, user_id) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_request_sent_ids = doc.data().friend_request_sent_ids;
            friend_request_sent_ids = friend_request_sent_ids.filter( request => request != user_id );
            friend_request_sent_ids = [ ...new Set(friend_request_sent_ids) ];
            doc.ref.update('friend_request_sent_ids', friend_request_sent_ids);
        })
    }

    addToNudges = (doc_id, user_id, callback) => {
        app.firestore().collection('todos').doc(doc_id).get().then(doc => {
            let nudges = doc.data().nudges;
            nudges.push(user_id);
            nudges = [ ...new Set(nudges) ];
            doc.ref.update('nudges', nudges);
        })
    }

    removeFromNudges = (doc_id, user_id, callback) => {
        app.firestore().collection('todos').doc(doc_id).get().then(doc => {
            let nudges = doc.data().nudges;
            nudges = nudges.filter( request => request != user_id );
            nudges = [ ...new Set(nudges) ];
            doc.ref.update('nudges', nudges);
        })
    }

    addToCelebrations = (doc_id, user_id, callback) => {
        app.firestore().collection('todos').doc(doc_id).get().then(doc => {
            let celebrations = doc.data().celebrations;
            celebrations.push(user_id);
            celebrations = [ ...new Set(celebrations) ];
            doc.ref.update('celebrations', celebrations);
        })
    }

    removeFromCelebrations = (doc_id, user_id, callback) => {
        app.firestore().collection('todos').doc(doc_id).get().then(doc => {
            let celebrations = doc.data().celebrations;
            celebrations = celebrations.filter( request => request != user_id );
            celebrations = [ ...new Set(celebrations) ];
            doc.ref.update('celebrations', celebrations);
        })
    }

    // Listeners on all own todos 
    // Mimic instant changes for front end 

    generateHomeTodos = (callback) => {
        const friends = this.state.value.state.friends.friends_obj;
        const friend_ids = Object.keys(friends);
        let max = 0;
        friend_ids.forEach( friend_id => {
            console.log('friends[friend_id]', friends[friend_id].todo_list.full_name);
            if(friends[friend_id].todo_list.length > max) {
                max = friends[friend_id].todo_list.length;
            }
        })
        let list = [];
        for(var i = 0; i < max; i++) {
            for(var j = 0; j < friend_ids.length; j++) {
            let friend_id = friend_ids[j];
            if(friends[friend_id].todo_list[i]) {
                if(friends[friend_id].todo_list[i].public) {
                // Is not themselves
                if(friends[friend_id].todo_list[i].user_id.id != this.state.value.state.app.user.uid) {
                    list.push(friends[friend_id].todo_list[i]);
                }
                }
            }
            }
        }
        this.setState((prevState) => ({
            value: {
                ...prevState.value, 
                state: { ...prevState.value.state, 
                            friends: {
                                ...prevState.value.state.friends, 
                                home_todos: list
                            }
                    }
            }
        }), () => callback() )
    }


    // Look through all todos, check nudges and celebrations 
    // Use to id to check name in friends_obj table
    generateActivityTodos = (callback) => {
        let list = []
        const todo_list = this.state.value.state.todo.todo_list;
        todo_list.forEach( todo => {
            // Add friend.name, todo.text, nudge bool
            const nudges = todo.nudges;
            nudges.forEach( id => {
                const full_name = this.state.value.state.friends.friends_obj[id].full_name;
                const text = todo.text;
                const nudge = true;
                list.push({ full_name, text, nudge })
            })

            const celebrations = todo.celebrations;
            celebrations.forEach( id => {
                const full_name = this.state.value.state.friends.friends_obj[id].full_name;
                const text = todo.text;
                const nudge = false;
                list.push({ full_name, text, nudge })
            })
        })
        this.setState((prevState) => ({
            value: {
                ...prevState.value, 
                state: { ...prevState.value.state, 
                            friends: {
                                ...prevState.value.state.friends, 
                                activity_todos: list
                            }
                    }
            }
        }), () => callback())
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

// Create different handlers 