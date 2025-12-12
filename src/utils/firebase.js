import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
 
  apiKey: "AIzaSyC1g7INzFX_PZVny4jS1cKRsAK-mS5zd9w",
 
  authDomain: "qrbites-864ae.firebaseapp.com",
 
  projectId: "qrbites-864ae",
 
  storageBucket: "qrbites-864ae.firebasestorage.app",
 
  messagingSenderId: "237391281474",
 
  appId: "1:237391281474:web:daef9980d4ab601d639cdb",
 
  measurementId: "G-T95XN4MV5F"
 
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
