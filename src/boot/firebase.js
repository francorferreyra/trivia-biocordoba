import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCC6W6dSJdO3d1MOuxs4pYg2yl8EfKQZsI",
    authDomain: "prueba-v9.firebaseapp.com",
    projectId: "prueba-v9",
    storageBucket: "prueba-v9.appspot.com",
    messagingSenderId: "989330301975",
    appId: "1:989330301975:web:357d3f437a50cbe016e852"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const rtdb = getDatabase(app);

export { db, rtdb }