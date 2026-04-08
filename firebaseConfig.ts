import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5ZSBYkE1PGZLnzqTBqN6u4FzpvTUh4A0",
  authDomain: "saree-stock.firebaseapp.com",
  projectId: "saree-stock",
  storageBucket: "saree-stock.firebasestorage.app",
  messagingSenderId: "355254820657",
  appId: "1:355254820657:web:7fc184bbb8264272745a10",
  measurementId: "G-4NLZFQKHC1"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
