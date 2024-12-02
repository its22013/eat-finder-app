"use client";

import React, { useEffect, useState } from 'react';
import { auth } from '../hooks/firebase';
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import Footer from "../components/Footer";
import { useRouter } from 'next/navigation'; // useRouterをインポート
import styles from './Mypage.module.css';
<<<<<<< HEAD
=======
import { useDisclosure } from '@chakra-ui/react'; // Import useDisclosure for modal
import LoginModal from '../ Login/Login'; // Import LoginModal
>>>>>>> origin/main

const Mypage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter(); // useRouterを初期化
<<<<<<< HEAD
=======
    const { isOpen, onOpen, onClose } = useDisclosure(); // Manage modal state
>>>>>>> origin/main

    // ユーザー情報の取得
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    // ログアウト処理
    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("ログアウトしました");
            setUser(null); // ユーザー状態をクリア
            router.push('/'); // ホームページにリダイレクト
        } catch (error) {
            console.error("ログアウト中にエラーが発生しました: ", error);
        }
    };

    // ログインページへの移動
    const handleLoginRedirect = () => {
        router.push('/login'); // ログインページにリダイレクト
    };

    return (
        <div className={styles.mypageContainer}>
            {user ? (
                <div>
                    <h1>マイページ</h1>
                    <p>ようこそ、{user.displayName || "ゲスト"}さん！</p>
                    <button onClick={handleLogout} className={styles.button}>ログアウト</button>
                </div>
            ) : (
<<<<<<< HEAD
                <div className={styles.off_mypage}>
                    <p>ログインしていません。</p>
                    <button onClick={handleLoginRedirect} className={styles.button}>ログインページへ</button>
=======
                <div>
                    <p>ログインしていません。</p>
                    {/* Open modal when clicked if user is not logged in */}
                    <button onClick={onOpen} className={styles.button}>ログイン</button>
>>>>>>> origin/main
                </div>
            )}

            {/* The LoginModal component will be triggered here */}
            <LoginModal isOpen={isOpen} onClose={onClose} />

            <Footer />
        </div>
    );
}

export default Mypage;