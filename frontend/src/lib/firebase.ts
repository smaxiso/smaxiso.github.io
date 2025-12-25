import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAfp8JGrWvtd3x-TTsNkYjko-tnniJrrWI",
    authDomain: "smaxiso.firebaseapp.com",
    projectId: "smaxiso",
    storageBucket: "smaxiso.firebasestorage.app",
    messagingSenderId: "864525826232",
    appId: "1:864525826232:web:68f8ae31b68715caa45c4d",
    measurementId: "G-HF2HRQFJ94"
};

// Initialize Firebase (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
