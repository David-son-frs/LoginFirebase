// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCRVggFCSK7J2DZiPsYzwG0quQtaf7y8xY",
  authDomain: "artemiscore-8056a.firebaseapp.com",
  projectId: "artemiscore-8056a",
  storageBucket: "artemiscore-8056a.firebasestorage.app",
  messagingSenderId: "223316540141",
  appId: "1:223316540141:web:e05c554436880038fb6ae4",
  measurementId: "G-7JKW538RPS"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Autenticação Firebase
const auth = getAuth(app);

// Provedor de login Google
const provider = new GoogleAuthProvider();

export { auth, provider };
