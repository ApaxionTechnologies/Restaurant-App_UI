
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAkLQKm6w2KxQat1S9Oj21JeG5bmTErwoU",
  authDomain: "qr-menu-app-d3c4d.firebaseapp.com",
  projectId: "qr-menu-app-d3c4d",
  storageBucket: "qr-menu-app-d3c4d.appspot.com",
  messagingSenderId: "1053138778851",
  appId: "1:1053138778851:web:c06e9dcad5586c2fe063d6",
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
