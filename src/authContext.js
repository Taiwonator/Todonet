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
                        friend_request_received_ids: [], 
                        friend_request_sent_ids: [],

                        full_name: 'steve', 
                        todo_list: [], 
                        user_id: ''
                    },
                }, 
                eventHandler: this.eventHandler
             }
         }
        //  this.unsubscribe;
    }

    componentDidMount() {
        this.todoListeners = {};
        this.friendListeners  = {};
        this.getCurrentUser();
    }

    componentWillUnmount() {
        if(this.unsubscribe) {
            this.unsubscribe();
        }
        if(this.todoListeners) {
            const keys = Object.keys(this.todoListeners);
            keys.forEach(key => {
                this.todoListeners[key]();
            })
        }
        if(this.friendListeners) {
            const keys = Object.keys(this.friendListeners);
            keys.forEach(key => {
                this.friendListeners[key]();
            })
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
        this.todoListeners = {};
        this.friendListeners  = {};
        app.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                return app.firestore().collection('users').doc(user.uid).set(this.newUser(user.uid, full_name)).then(() => {
                    this.callAlert('User successfully created');
                    this.setState((prevState) => ({
                        value: {
                            ...prevState.value, 
                            state: { 
                                        app: {
                                            ...prevState.value.state.app, 
                                            loggedIn: true, 
                                            user, 
                                            full_name
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
                                            friend_request_received_ids: [], 
                                            friend_request_sent_ids: [],
                    
                                            full_name: 'steve', 
                                            todo_list: [], 
                                            user_id: ''
                                        },
                                        
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

                androidEventHandler({
                    type: "ANDROID", 
                    name: "save_credentials", 
                    email, password
                })

                // Loads user data, todos and friends
                this.callAlert('Login successful');
                this.initUser(user, callback);
                
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage, errorCode);
            });
    }

    initUser = (user, callback) => {
        this.getAllData(user, () =>  callback())

        // Detect changes
        this.unsubscribe = app.firestore().collection("users").doc(user.uid)
            .onSnapshot((doc) => {
                console.log(doc.data());
                // this.getAllData(user, () => console.log('Change to my user profile, retrieved all data ????'));
                this.setState((prevState) => ({
                    value: {
                        ...prevState.value, 
                        state: { ...prevState.value.state,
                            friends: {
                                ...prevState.value.state.friends,
                                friend_request_received_ids: doc.data().friend_request_received_ids, 
                                friend_request_sent_ids: doc.data().friend_request_sent_ids, 
                                friend_ids: doc.data().friend_ids
                            }
                        }
                    }
                }), () => this.getAllData(user, () => console.log('Change to my user profile, retrieved all data ????')))
        });
    }


    // logout 
    logoutUser = (callback) => {
        app.auth().signOut().then(() => {
            this.callAlert('Sign out successfull');
            androidEventHandler({
                type: "ANDROID", 
                name: "open_landing_page"
            })

            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: {
                        app: {
                            ...prevState.value.state.app, 
                            loggedIn: false, 
                            user: '', 
                            full_name: ''
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
        app.auth().onAuthStateChanged((user) => {
        if (user) {
            this.initUser(user, () => console.log('page was reloaded'))

        } else {
            console.log('no user');
        }
        });
    }

    getUserData = (user, callback) => {
        app.firestore().collection('users').doc(user.uid).get().then(doc => {
            const todo_ids = doc.data().todo_ids;
            this.getTodos(user.uid, todo_ids, (todo_list) => {
                this.setState((prevState) => ({
                    value: {
                        ...prevState.value, 
                        state: { ...prevState.value.state, 
    
                                 todo: {
                                    ...prevState.value.state.todo,
                                    todo_list, 
                                    todo_ids
                                 },
    
                                 app: {
                                    ...prevState.value.state.app,
                                    loggedIn: true, 
                                    user, 
                                    full_name: doc.data().full_name
                                 }
    
                        }
                    }
                }), () => { callback(); })
            })
        })
    }


    getAllData = (user, callback) => {
        // get logged in user's data (info + todos)
        // get friends -> generate 
        // get friend requests (friends page)
        // get all users (friends page)
        this.getUserData(user,  () => this.getFriendData(() => {
            this.generateHomeTodos(() => true);
            this.generateActivityTodos(() => true);
            callback();
        }));
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

    getTodos = (user_id, todo_ids, callback) => {
        let todos = []
        todo_ids.forEach(todo_id => {
            app.firestore().collection('todos').doc(todo_id).get().then(doc => {
                todos.push(doc.data())
            })
        })
        // todos = todos.filter(todo => )
        
        let friends_obj = {}
        
        // Track todos
        todo_ids.forEach(todo_id => {
            if(this.todoListeners[todo_id] == null) {
                this.todoListeners[todo_id] = app.firestore().collection('todos').doc(todo_id).onSnapshot((querySnapshot) => {
                    // update friend's todolist
                    console.log(`update ${user_id} todolist`);
                    if(this.state.value.state.friends.friends_obj) {
                        this.setState((prevState) => ({
                            value: {
                                ...prevState.value, 
                                state: { ...prevState.value.state, 
                                            friends: {
                                                ...prevState.value.state.friends, 
                                                friends_obj: {
                                                    ...prevState.value.state.friends.friends_obj, 
                                                    [user_id]: {
                                                        ...prevState.value.state.friends.friends_obj[user_id],
                                                        full_name: 'hello', 
                                                        todo_list: todos
                                                    }
                                                }  
                                                
                                            }
                                    }
                            }
                        }), () => this.getAllData(this.state.value.state.app.user, () => console.log('Friend todo changed, retrieved all data ????')))
                    }
                })
            }
        });
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

        // this.todoListeners[ref.id] = app.firestore().collection('todos').doc(ref.id).onSnapshot((querySnapshot) => {
        //     this.getAllData(this.state.value.state.app.user, () => console.log('Listening to new todo ????'));
        // })

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
                    state: { 
                        ...prevState.value.state, 
                            todo: {
                                ...prevState.value.state.todo,
                                todo_list 
                                }
                        }
                }
            }), () => callback())

        })
    }

    deleteTodoItem = (todo_id, callback) => {
        this.todoListeners[todo_id]();

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
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, todo_list }
                }
            }), () => callback())

        })
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
            case 'unsend_friend_request':
                this.unsendFriendRequest(event.user_id, event.callback)
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
        this.getFriends(() => { 
            this.getFriendRequests(() => this.getUsers((callback)));
            console.log('friends retreived')
        });  
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
            
            let friends_obj = {}
            friend_ids.forEach(id => {

                app.firestore().collection('users').doc(id).get().then((friend) => {
                    if(friend) {
                        this.getTodos(id, friend.data().todo_ids, (todo_list) => {
                            friends_obj[friend.data().user_id] = {
                                full_name: friend.data().full_name, 
                                todo_list, 
                                user_id: friend.data().user_id
                            }
                        })
                    }
                })
            })
            this.setState((prevState) => ({
                value: {
                    ...prevState.value, 
                    state: { ...prevState.value.state, 
                                friends: {
                                    ...prevState.value.state.friends,
                                    friends_obj
                                    
                                }
                           }
                }
            }), () => callback())

            friend_ids.forEach(friend_id => {
                if(this.friendListeners[friend_id] == null) {
                    this.friendListeners[friend_id] = app.firestore().collection('users').doc(friend_id).onSnapshot((querySnapshot) => {
                        // update friend's profile
                        console.log(`update ${friend_id} profile`);
                        this.getAllData(this.state.value.state.app.user, () => console.log('Change to my user profile, retrieved all data ????'))
                    })
                }
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
        this.addToSents(this.state.value.state.app.user.uid, friend_id, () => true)
        callback();
    }

    unsendFriendRequest = (friend_id, callback) => {
        this.removeFromRequests(friend_id, this.state.value.state.app.user.uid)
        this.removeFromSents(this.state.value.state.app.user.uid, friend_id, () => true)
        callback();
    }

    acceptFriendRequest = (user_id, callback) => {
        // Remove from user requests
        this.removeFromRequests(this.state.value.state.app.user.uid, user_id, () => true)

        // // Add to user's friends
        this.addToFriends(this.state.value.state.app.user.uid, user_id, () => true)

        // // Remove from user sends
        this.removeFromSents(user_id, this.state.value.state.app.user.uid)

        // // Add to friend's friends
        this.addToFriends(user_id, this.state.value.state.app.user.uid)

        callback();
    }

    removeFriend = (user_id, callback) => {
        this.removeFromFriends(user_id, this.state.value.state.app.user.uid);
        this.removeFromFriends(this.state.value.state.app.user.uid, user_id, () => true);
        
        callback();
    }

    declineFriendRequest = (user_id, callback) => {
        // Remove from user requests
        this.removeFromRequests(this.state.value.state.app.user.uid, user_id, () => true)

        // // Remove from user sends
        this.removeFromSents(user_id, this.state.value.state.app.user.uid)
        
        callback();
    }

    // Add to requests
    addToRequests = (doc_id, user_id, callback) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_request_received_ids = doc.data().friend_request_received_ids;
            friend_request_received_ids.push(user_id);
            friend_request_received_ids = [ ...new Set(friend_request_received_ids) ];
            doc.ref.update('friend_request_received_ids', friend_request_received_ids);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    // Remove from request
    removeFromRequests = (doc_id, user_id, callback) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_request_received_ids = doc.data().friend_request_received_ids;
            friend_request_received_ids = friend_request_received_ids.filter( request => request != user_id );
            friend_request_received_ids = [ ...new Set(friend_request_received_ids) ];
            doc.ref.update('friend_request_received_ids', friend_request_received_ids);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    // Add to friends
    addToFriends = (doc_id, user_id, callback) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_ids = doc.data().friend_ids;
            friend_ids.push(user_id);
            friend_ids = [ ...new Set(friend_ids) ];
            doc.ref.update('friend_ids', friend_ids);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    // Remove from friends
    removeFromFriends = (doc_id, user_id, callback) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_ids = doc.data().friend_ids;
            friend_ids = friend_ids.filter(id => id != user_id)
            friend_ids = [ ...new Set(friend_ids) ];
            doc.ref.update('friend_ids', friend_ids);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    // Add to sents
    addToSents = (doc_id, user_id, callback) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_request_sent_ids = doc.data().friend_request_sent_ids;
            friend_request_sent_ids.push(user_id);
            friend_request_sent_ids = [ ...new Set(friend_request_sent_ids) ];
            doc.ref.update('friend_request_sent_ids', friend_request_sent_ids);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    // Remove from sents
    removeFromSents = (doc_id, user_id, callback) => {
        app.firestore().collection('users').doc(doc_id).get().then(doc => {
            let friend_request_sent_ids = doc.data().friend_request_sent_ids;
            friend_request_sent_ids = friend_request_sent_ids.filter( request => request != user_id );
            friend_request_sent_ids = [ ...new Set(friend_request_sent_ids) ];
            doc.ref.update('friend_request_sent_ids', friend_request_sent_ids);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    addToNudges = (doc_id, user_id, callback) => {
        app.firestore().collection('todos').doc(doc_id).get().then(doc => {
            let nudges = doc.data().nudges;
            nudges.push(user_id);
            nudges = [ ...new Set(nudges) ];
            doc.ref.update('nudges', nudges);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    removeFromNudges = (doc_id, user_id, callback) => {
        app.firestore().collection('todos').doc(doc_id).get().then(doc => {
            let nudges = doc.data().nudges;
            nudges = nudges.filter( request => request != user_id );
            nudges = [ ...new Set(nudges) ];
            doc.ref.update('nudges', nudges);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    addToCelebrations = (doc_id, user_id, callback) => {
        app.firestore().collection('todos').doc(doc_id).get().then(doc => {
            let celebrations = doc.data().celebrations;
            celebrations.push(user_id);
            celebrations = [ ...new Set(celebrations) ];
            doc.ref.update('celebrations', celebrations);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    removeFromCelebrations = (doc_id, user_id, callback) => {
        app.firestore().collection('todos').doc(doc_id).get().then(doc => {
            let celebrations = doc.data().celebrations;
            celebrations = celebrations.filter( request => request != user_id );
            celebrations = [ ...new Set(celebrations) ];
            doc.ref.update('celebrations', celebrations);
        }).then(() => {
            if(callback) {
                callback();
            }
        })
    }

    // Listeners on all own todos 
    // Mimic instant changes for front end 

    generateHomeTodos = (callback) => {
        const friends = this.state.value.state.friends.friends_obj;
        const friend_ids = Object.keys(friends);
        let max = 0;
        friend_ids.forEach( friend_id => {
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
        console.log(todo_list);
        todo_list.forEach( todo => {
            if(todo) {
            // Add friend.name, todo.text, nudge bool
            const nudges = todo.nudges;
            nudges.forEach( id => {
                let user = this.state.value.state.friends.users.find( user => user.user_id == id )

                const full_name = user.full_name;
                const text = todo.text;
                const nudge = true;
                list.push({ full_name, text, nudge })
            })

            const celebrations = todo.celebrations;
            celebrations.forEach( id => {
                let user = this.state.value.state.friends.users.find( user => user.user_id == id )

                const full_name = user.full_name;
                const text = todo.text;
                const nudge = false;
                list.push({ full_name, text, nudge })
            })
        }
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






    // FRIENDS TRACK 





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
