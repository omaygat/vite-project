
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNm2UCSG0svfIyM8sQI-Tg7OQiPRwk61M",
  authDomain: "vite-project-2607b.firebaseapp.com",
  projectId: "vite-project-2607b",
  storageBucket: "vite-project-2607b.appspot.com",
  messagingSenderId: "1046593199174",
  appId: "1:1046593199174:web:895eac174a13cf5d043e47"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
