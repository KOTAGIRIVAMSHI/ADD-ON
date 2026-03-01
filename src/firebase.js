// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyANoitdaSI-39Na20g-eVY_2eFAUmM4ZaY",
    authDomain: "campus-hub-bf0c3.firebaseapp.com",
    projectId: "campus-hub-bf0c3",
    storageBucket: "campus-hub-bf0c3.firebasestorage.app",
    messagingSenderId: "468603879523",
    appId: "1:468603879523:web:585cb2b9bc72c0f8593856",
    measurementId: "G-Q9P4HEK0RF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };