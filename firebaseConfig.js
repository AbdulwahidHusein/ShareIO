import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBJWmXYJQNFqCXVyA3mEoiXjdS2YAMahjI",
  authDomain: "shareio-7bca8.firebaseapp.com",
  projectId: "shareio-7bca8",
  storageBucket: "shareio-7bca8.appspot.com",
  messagingSenderId: "350518962625",
  appId: "1:350518962625:web:86ea29c6492daa040ee740",
  measurementId: "G-1HCBXQ4YXY"
};

// initialize firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;
export const auth = getAuth();
export const database = getFirestore();
