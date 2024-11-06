
// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase設定を記述します
const firebaseConfig = {
    apiKey: process.env.Fkey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.stBucket,
    messagingSenderId: process.env.messagId,
    appId: process.env.appId,
    measurementId: process.env.MId
};

// Firebaseアプリの初期化を確認し、既存のアプリを使用する
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
export { auth, db, googleProvider };
