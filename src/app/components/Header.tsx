// Header.tsx
'use client';
import styles from '../styles/Header.module.css';
import React, { useEffect, useState } from 'react';
import { onAuthStateChangedListener, signInWithGoogle, signOutUser } from '../hooks/login';
import { Button, Flex, Box } from '@chakra-ui/react';
import { CiLogin } from "react-icons/ci";
const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // 初期値をnullに設定

  useEffect(() => {
    // Firebaseの認証リスナーでログイン状態を監視
    const unsubscribe = onAuthStateChangedListener((user) => {
      setIsLoggedIn(!!user); // ユーザーが存在する場合に true に設定
    });

    // クリーンアップ関数でリスナー解除
    return () => unsubscribe;
  }, []);

  // isLoggedInがnull（初期値）の場合は何もレンダリングしない
  if (isLoggedIn === null) return null;

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      signOutUser(); // ログイン中ならログアウト処理
    } else {
      signInWithGoogle(); // ログインしていないならGoogleログイン処理
    }
  };

  return (
    <header className={styles.header}>
      <Flex align="center" justify="space-between" p={4}>
        {/* ログイン状態に応じてメッセージ表示 */}
        <Box flex="1" textAlign="center">
          {!isLoggedIn && <p className={styles.text}>現在ログインしていません</p>}
        </Box>

        {/* ログイン/ログアウトボタン */}
        {!isLoggedIn ? (
          <Button
            rightIcon={<CiLogin  size={20}/>}
            colorScheme="teal"
            className={styles.loginButton}
            onClick={signInWithGoogle}
          >
            ログイン
          </Button>
        ) : (
          <Button
            colorScheme="red"
            className={styles.logoutButton}
            onClick={signOutUser}
          >
            ログアウト
          </Button>
        )}
      </Flex>
    </header>
  );
};

export default Header;
