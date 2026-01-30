import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as _firebaseAuth from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseAuth = _firebaseAuth as any;

export const firebaseConfig = {
  apiKey: "AIzaSyBP6pC1zXpvrygtTyTQtxdb7pR4LI-IcVo",
  authDomain: "caexam-online1.firebaseapp.com",
  projectId: "caexam-online1",
  storageBucket: "caexam-online1.firebasestorage.app",
  messagingSenderId: "93128901098",
  appId: "1:93128901098:web:8e8ac1399bc30677eff293"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = firebaseAuth.getAuth(app);
const storage = getStorage(app);

const {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} = firebaseAuth;

export { 
  db, auth, storage,
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile 
};