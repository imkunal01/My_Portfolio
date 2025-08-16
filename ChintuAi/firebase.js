// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUxi6WFJ7SXKNAPzoleGvT70uTdqK6ZEI",
  authDomain: "chintu-e1dc9.firebaseapp.com",
  projectId: "chintu-e1dc9",
  storageBucket: "chintu-e1dc9.firebasestorage.app",
  messagingSenderId: "594435063704",
  appId: "1:594435063704:web:403118bdabd9db373335ed",
  measurementId: "G-VXHBZPDL32"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
