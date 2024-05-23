// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC_IEiTVFNa-xdLS6AKBt0pKc0f7qdkH04",
    authDomain: "discord-clone-3ce0b.firebaseapp.com",
    databaseURL: "https://discord-clone-3ce0b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "discord-clone-3ce0b",
    storageBucket: "discord-clone-3ce0b.appspot.com",
    messagingSenderId: "627115444896",
    appId: "1:627115444896:web:48eda33203449bcd2397c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const dbRealTime = getDatabase(app);