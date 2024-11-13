"use client"

import React, { useEffect, useState } from 'react';
import { auth } from '../hooks/firebase'; // firebase設定ファイルからインポート
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import Footer from "../components/Footer";
import styles from './Mypage.module.css'; 

const Mypage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

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
        } catch (error) {
            console.error("ログアウト中にエラーが発生しました: ", error);
        }
    };

    return (
        <div className={styles.mypageContainer}>
            <h1>マイページ</h1>

            {user ? (
                <div>
                    <p>ようこそ、{user.displayName || "ゲスト"}さん！</p>
                    <button onClick={handleLogout} className={styles.button}>ログアウト</button>
                </div>
            ) : (
                <p>ログインしていません。</p>
            )}

            <Footer />
        </div>
    );
}

export default Mypage;