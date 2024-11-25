
// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc} from "firebase/firestore";

// Firebase設定を記述します
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FKey,
    authDomain: process.env.NEXT_PUBLIC_authDomain,
    projectId: process.env.NEXT_PUBLIC_projectId,
    storageBucket: process.env.NEXT_PUBLIC_stBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_messagId,
    appId: process.env.NEXT_PUBLIC_appId,
    measurementId: process.env.NEXT_PUBLIC_MId
};

// Firebaseアプリの初期化を確認し、既存のアプリを使用する
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
export { auth, db, googleProvider, collection, addDoc };
