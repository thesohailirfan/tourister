import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA5eEUopNSmo0TP-gwccxfn--i8UX2fa_I",
    authDomain: "tourister-309d4.firebaseapp.com",
    projectId: "tourister-309d4",
    storageBucket: "tourister-309d4.appspot.com",
    messagingSenderId: "437195067608",
    appId: "1:437195067608:web:3fc3b76895873d4da1c7ad",
    measurementId: "G-Z24HLXHWQR"
};
  
// Initialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }else {
    firebase.app(); // if already initialized, use that one
 }