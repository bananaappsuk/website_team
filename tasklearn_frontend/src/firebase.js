import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB35EI3JPqr1Vy1pC4tQrXc4CyYOxoIqw0",
  authDomain: "tasklearn-8f476.firebaseapp.com",
  projectId: "tasklearn-8f476",
  storageBucket: "tasklearn-8f476.appspot.com",
  messagingSenderId: "586415236942",
  appId: "1:586415236942:web:cfa086bdf0546b3d00201f",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
