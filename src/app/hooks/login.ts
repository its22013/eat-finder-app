// login.ts
"use client";

import { useEffect, useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChangedListener((user) => {
        setUser(user);
      });
      return () => unsubscribe();
    }, []);
  
    return { user };
  };

// Googleログイン処理
export const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Google sign-in failed:", error);
    }
};

// ログイン状態の監視

export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };

// ログアウト処理
export const signOutUser = async () => {
    try {
        await auth.signOut();
        alert("ログアウトしました")
    } catch (error) {
        console.error("Sign-out failed:", error);
    }
};
