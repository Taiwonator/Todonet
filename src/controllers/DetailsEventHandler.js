import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { app } from '../fire';

export function detailsEventHandler(event) {
    switch(event.name) {
        case 'create_user':
            createUser(event.fullname, event.email, event.password);
            break;
        case 'login_user':
            loginUser(event.email, event.password);
            break;
        case 'logout_user':
            logoutUser();
            break;
        case 'get_current_user': 
            getCurrentUser();
            break;
        case 'get_data':
            getData();
            break;
        default:
            break;
    }
}

function createUser(fullname, email, password) {
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

function loginUser(email, password) {
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

function logoutUser() {
    app.auth().signOut().then(() => {
        alert('signout complete');
    }).catch((error) => {
        console.log(error);
    });
}

function getCurrentUser() {
    app.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
    } else {
        console.log('no user');
    }
    });
}

function getData() {
    app.firestore().collection('todos').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            const todo = doc.data();
            console.log(todo);
        })
    })
}