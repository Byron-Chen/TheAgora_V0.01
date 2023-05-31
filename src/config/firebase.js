import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const app = firebase.initializeApp({
    apiKey: "AIzaSyAgrydeQT_Ugt5cgt8diNuw-2tPFQZrjfE",
    authDomain: "testtheagora.firebaseapp.com",
    projectId: "testtheagora",
    storageBucket: "testtheagora.appspot.com",
    messagingSenderId: "175663737489",
    appId: "1:175663737489:web:4b2b2d07a818f5bce1ad30",
    measurementId: "G-X1YJ8TMV3E"
})

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const firestoreApp = app.firestore();
export const storageApp = app.storage();
export const authApp = app.auth()