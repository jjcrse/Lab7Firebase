

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyArsW3lgHhS-XxLmkijh3soVXK1q0tTKVI",
  authDomain: "gestor-de-tareas-9056c.firebaseapp.com",
  projectId: "gestor-de-tareas-9056c",
  storageBucket: "gestor-de-tareas-9056c.firebasestorage.app",
  messagingSenderId: "471615827647",
  appId: "1:471615827647:web:0e997dae6bb9f147dba00a"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
