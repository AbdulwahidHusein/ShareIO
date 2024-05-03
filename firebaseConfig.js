// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJWmXYJQNFqCXVyA3mEoiXjdS2YAMahjI",
  authDomain: "shareio-7bca8.firebaseapp.com",
  projectId: "shareio-7bca8",
  storageBucket: "shareio-7bca8.appspot.com",
  messagingSenderId: "350518962625",
  appId: "1:350518962625:web:86ea29c6492daa040ee740",
  measurementId: "G-1HCBXQ4YXY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;