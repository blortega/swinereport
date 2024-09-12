// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-FPB8oMFlSlZUVA6lMmzmeuFJahxseU4",
  authDomain: "crudelist-adc5e.firebaseapp.com",
  projectId: "crudelist-adc5e",
  storageBucket: "crudelist-adc5e.appspot.com",
  messagingSenderId: "546176218635",
  appId: "1:546176218635:web:0cad1f4fc06684941cb90e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
