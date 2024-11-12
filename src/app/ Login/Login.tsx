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
} from '@chakra-ui/react';
import { signInWithPopup, signInWithRedirect, signInWithEmailAndPassword } from 'firebase/auth';
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

  // ユーザーのログイン状態を監視し、ログイン済みの場合はモーダルを閉じる
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) onClose();
    });
    return () => unsubscribe();  // unsubscribe()を確実に実行
  }, [onClose]);

  // メールアドレスでのログイン
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error: any) {
      setError("メールアドレスまたはパスワードが正しくありません");
      console.error("Email sign-in failed:", error);
    }
  };

  // Googleアカウントでのログイン
  const handleGoogleLogin = async () => {
    try {
      // デスクトップでポップアップを使用、モバイル端末でリダイレクトを使用
      if (window.innerWidth > 768) {
        await signInWithPopup(auth, googleProvider);
      } else {
        await signInWithRedirect(auth, googleProvider);
      }
      onClose();
    } catch (error) {
      setError("Googleアカウントでのログインに失敗しました");
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent className={styles.modalContent}>
        <button className={styles.closeB} onClick={onClose}><CloseIcon boxSize={25} /></button>
        <ModalHeader className={styles.hed}>ログイン</ModalHeader>
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
     
        
          <Button className={styles.btn} colorScheme="blue" onClick={handleEmailLogin} mr={3}>
            ログイン
          </Button>
          
          <Button className={styles.btnGoogle} colorScheme="red" onClick={handleGoogleLogin}>
            Googleでログイン
          </Button>
       
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
