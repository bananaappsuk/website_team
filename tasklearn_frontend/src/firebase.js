import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, AIzaSyCdzLjKoPOphdteS4uVJnhJoEJrxp4rPKAmeasurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCdzLjKoPOphdteS4uVJnhJoEJrxp4rPKA',
  authDomain: 'tasklearndevelopment.firebaseapp.com',
  projectId: 'tasklearndevelopment',
  storageBucket: 'tasklearndevelopment.firebasestorage.app',
  messagingSenderId: '41054722419',
  appId: '1:41054722419:web:0d071a795ffe26d1b9cd06',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
