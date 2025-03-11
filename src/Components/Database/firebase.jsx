// src/Components/Database/firebase.jsx
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "API_AUTH_KEY",
  authDomain: "AUTH_DOMAIN",
  databaseURL: "DATABSE_URL",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "API_ID",
  measurementId: "MEASUREMENT_ID"
};
export const app = initializeApp(firebaseConfig);
