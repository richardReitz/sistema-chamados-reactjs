import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB77uX7uaiJAttvWvfaRgUJi39PBBahgsM",
    authDomain: "chamados-a5a0a.firebaseapp.com",
    projectId: "chamados-a5a0a",
    storageBucket: "chamados-a5a0a.appspot.com",
    messagingSenderId: "851415491175",
    appId: "1:851415491175:web:acfeb4397cf4a6836deac2",
    measurementId: "G-X3EWM69KGR"
  };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;