// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// Usa aquí TU configuración real (la que ya pegaste antes)
const firebaseConfig = {
  apiKey: "AIzaSyDVK_AsMC92DE9k6W3RQUPNxF8LCt8JlNk",
  authDomain: "examen-prog-componentes-c0f9c.firebaseapp.com",
  projectId: "examen-prog-componentes-c0f9c",
  storageBucket: "examen-prog-componentes-c0f9c.firebasestorage.app",
  messagingSenderId: "462770591300",
  appId: "1:462770591300:web:7082b9f344d389ac524e11"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
export default firebase;
