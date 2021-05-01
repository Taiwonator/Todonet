import firebase from 'firebase/app';
import 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAnMXicWrZP5e6FuiGCJFcS0IttnoY4Fo4",
    authDomain: "todonet-311317.firebaseapp.com",
    databaseURL: "https://todonet-311317-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "todonet-311317",
    storageBucket: "todonet-311317.appspot.com",
    messagingSenderId: "1088108445026",
    appId: "1:1088108445026:web:96bca43efaf3879677c03b",
    measurementId: "G-52JTNLZ3YR"
  };

export const app = firebase.initializeApp(firebaseConfig);