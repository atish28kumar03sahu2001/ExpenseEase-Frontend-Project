// src/Components/Database/firebase.jsx
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyC-mD4DBs9eXVFiKt1ufLn3LDXJYKK9LyY",
  authDomain: "expenseeasereact.firebaseapp.com",
  databaseURL: "https://expenseeasereact-default-rtdb.firebaseio.com",
  projectId: "expenseeasereact",
  storageBucket: "expenseeasereact.firebasestorage.app",
  messagingSenderId: "756336475857",
  appId: "1:756336475857:web:87c3647aa7cb41aabbcff0",
  measurementId: "G-6CQMCY358C"
};
export const app = initializeApp(firebaseConfig);