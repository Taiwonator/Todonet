import firebase from "firebase/app";
import "firebase/auth";
import { app } from '../fire';

export function detailsEventHandler(event) {
    switch(event.name) {
        case 'create_user':
            createUser(event.fullname, event.email, event.password);
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
            console.log(userCredential);
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