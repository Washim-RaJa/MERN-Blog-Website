// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-3e61d.firebaseapp.com",
  projectId: "mern-blog-3e61d",
  storageBucket: "mern-blog-3e61d.appspot.com",
  messagingSenderId: "339455085477",
  appId: "1:339455085477:web:4c5b10a38edce715b9b64c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

