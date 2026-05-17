import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgGyXkPyy5wqTRGHGjSu5wTn98d3qSK5k",
  authDomain: "yakkok-c9922.firebaseapp.com",
  projectId: "yakkok-c9922",
  storageBucket: "yakkok-c9922.firebasestorage.app",
  messagingSenderId: "765323690464",
  appId: "1:765323690464:web:50c1fae3f4401fbaf8eb85",
  measurementId: "G-VXBVZQ8GN1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
