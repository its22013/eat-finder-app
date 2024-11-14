"use client";

import React, { useEffect, useState } from 'react';
import { auth } from '../hooks/firebase';
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import Footer from "../components/Footer";
import { useRouter } from 'next/navigation'; // useRouterをインポート
import styles from './Mypage.module.css';
import { useDisclosure } from '@chakra-ui/react'; // Import useDisclosure for modal
import LoginModal from '../ Login/Login'; // Import LoginModal

const Mypage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter(); // useRouterを初期化
    const { isOpen, onOpen, onClose } = useDisclosure(); // Manage modal state

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

    return (
        <div className={styles.mypageContainer}>
            {user ? (
                <div>
                    <h1>マイページ</h1>
                    <p>ようこそ、{user.displayName || "ゲスト"}さん！</p>
                    <button onClick={handleLogout} className={styles.button}>ログアウト</button>
                </div>
            ) : (
                <div>
                    <p>ログインしていません。</p>
                    {/* Open modal when clicked if user is not logged in */}
                    <button onClick={onOpen} className={styles.button}>ログイン</button>
                </div>
            )}

            {/* The LoginModal component will be triggered here */}
            <LoginModal isOpen={isOpen} onClose={onClose} />

            <Footer />
        </div>
    );
}

export default Mypage;