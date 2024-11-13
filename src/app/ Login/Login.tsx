'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../hooks/firebase';
import { onAuthStateChangedListener } from '../hooks/login';
import styles from './Login.module.css';
import { CloseIcon } from '@chakra-ui/icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false); // 新規登録モード
  const [isClient, setIsClient] = useState(false); // クライアントレンダリングの確認

  useEffect(() => {
    // クライアントサイドのみで処理を行うためのフラグ
    setIsClient(true);

    // 認証状態の変更リスナー
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) onClose();
    });

    return () => unsubscribe();
  }, [onClose]);

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error: any) {
      setError("メールアドレスまたはパスワードが正しくありません");
      console.error("Email sign-in failed:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 画面幅が768px以下（スマホ）の場合はリダイレクト方式でログイン
      if (window.innerWidth <= 768) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
      onClose();
    } catch (error) {
      setError("Googleアカウントでのログインに失敗しました");
      console.error("Google sign-in failed:", error);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error: any) {
      setError("新規登録に失敗しました。メールアドレスとパスワードを確認してください。");
      console.error("Registration failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent className={styles.modalContent}>
        <button className={styles.closeB} onClick={onClose}><CloseIcon boxSize={25} /></button>
        <ModalHeader className={styles.hed}>{isRegistering ? '新規登録' : 'ログイン'}</ModalHeader>
        <ModalBody className={styles.bod}>
          <FormControl mb={4}>
            <FormLabel className={styles.text}>メールアドレス</FormLabel>
            <Input
              className={styles.emailform}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel className={styles.pass}>パスワード</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
            />
          </FormControl>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </ModalBody>
        <ModalFooter className={styles.footer} flexDirection="column" gap={2}>
          {isRegistering ? (
            <Button className={styles.btn} colorScheme="blue" onClick={handleRegister}>
              新規登録
            </Button>
          ) : (
            <>
              <Button className={styles.btn} colorScheme="blue" onClick={handleEmailLogin}>
                ログイン
              </Button>
              <Button className={styles.btnGoogle} colorScheme="red" onClick={handleGoogleLogin}
                leftIcon={<img src='/images/web_Google.png' alt="Google icon" width={20} height={20} />}>
                Sign in with Google
               </Button>
            </>
          )}
        </ModalFooter>

        <ModalFooter>
          <Text
            as="a"
            onClick={() => setIsRegistering(!isRegistering)}
            cursor="pointer"
            textDecoration="underline"
            color="blue"
          >
            {isRegistering ? '既にアカウントをお持ちですか？ログイン' : '新規登録はこちら'}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
