import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-nVCF4lnAjdb06xrdjIz9e1IVE-p01Lg",
  authDomain: "my-project-igi-da288.firebaseapp.com",
  projectId: "my-project-igi-da288",
  storageBucket: "my-project-igi-da288.appspot.com",
  messagingSenderId: "175093169837",
  appId: "1:175093169837:web:4220ac2207124a24155024",
  measurementId: "G-XPSFH52EBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);

const db = getFirestore(app);

export {auth,db};