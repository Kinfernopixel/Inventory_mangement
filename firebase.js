// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFifHf6nxzFiC6w0O_fGeHU5hERPvvPi4",
  authDomain: "inventory-managment-87e3f.firebaseapp.com",
  projectId: "inventory-managment-87e3f",
  storageBucket: "inventory-managment-87e3f.appspot.com",
  messagingSenderId: "984903051763",
  appId: "1:984903051763:web:3913433f6c14f321968a86",
  measurementId: "G-9STBS1T0HS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)

export {firestore}