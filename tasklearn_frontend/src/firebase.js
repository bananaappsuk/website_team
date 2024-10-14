import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyB35EI3JPqr1Vy1pC4tQrXc4CyYOxoIqw0",
//   authDomain: "tasklearn-8f476.firebaseapp.com",
//   projectId: "tasklearn-8f476",
//   storageBucket: "tasklearn-8f476.appspot.com",
//   messagingSenderId: "586415236942",
//   appId: "1:586415236942:web:cfa086bdf0546b3d00201f",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAFDYGyImqpbfGpUtbh_qPtxSBL-eFOC5I",
  authDomain: "fir-auth-72dd0.firebaseapp.com",
  projectId: "fir-auth-72dd0",
  storageBucket: "fir-auth-72dd0.appspot.com",
  messagingSenderId: "805493085871",
  appId: "1:805493085871:web:557aee50c26b81dad0e65a",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };



//one
