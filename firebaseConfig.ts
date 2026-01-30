
// Fix: Use namespace imports to avoid "no exported member" errors in this environment
import * as _firebaseApp from "firebase/app";
import * as _firebaseFirestore from "firebase/firestore";
import * as _firebaseAuth from "firebase/auth";
import * as _firebaseStorage from "firebase/storage";

const firebaseApp = _firebaseApp as any;
const firebaseFirestore = _firebaseFirestore as any;
const firebaseAuth = _firebaseAuth as any;
const firebaseStorage = _firebaseStorage as any;

export const firebaseConfig = {
  apiKey: "AIzaSyBP6pC1zXpvrygtTyTQtxdb7pR4LI-IcVo",
  authDomain: "caexam-online1.firebaseapp.com",
  projectId: "caexam-online1",
  storageBucket: "caexam-online1.firebasestorage.app",
  messagingSenderId: "93128901098",
  appId: "1:93128901098:web:8e8ac1399bc30677eff293"
};

const app = firebaseApp.initializeApp(firebaseConfig);
const db = firebaseFirestore.getFirestore(app);
const auth = firebaseAuth.getAuth(app);
const storage = firebaseStorage.getStorage(app);

// Destructure from namespaces
const {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} = firebaseAuth;

const {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
  setDoc,
  getDoc,
  where,
  getDocs
} = firebaseFirestore;

const {
  ref,
  uploadBytes,
  getDownloadURL
} = firebaseStorage;

export { 
  db, auth, storage,
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc,
  serverTimestamp,
  setDoc,
  getDoc,
  where,
  getDocs,
  ref,
  uploadBytes,
  getDownloadURL
};
