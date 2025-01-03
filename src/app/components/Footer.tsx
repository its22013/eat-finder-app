'use client';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaUserCircle } from 'react-icons/fa';
import { MdOutlineHistory } from "react-icons/md";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';
import { onAuthStateChangedListener } from '../hooks/login';
import { IoHome } from 'react-icons/io5';
import { useDisclosure } from '@chakra-ui/react';
import LoginModal from '../ Login/Login';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <footer className={styles.footer}>
      <div className={styles.iconContainer}>
        <Link href="/" className={`${styles.iconButton} ${isActive('/') ? styles.active : ''}`}>
          <IoHome className={styles.icon} />
          <span>Home</span>
        </Link>

        <Link
          href="/favorites"
          onClick={(e) => {
            if (!isLoggedIn) {
              e.preventDefault();
            }
          }}
          className={`${styles.iconButton} ${isActive('/favorites') ? styles.active : ''} ${!isLoggedIn ? styles.disabled : ''}`}
          aria-disabled={!isLoggedIn}
        >
          <FaHeart className={styles.icon} />
          <span>お気に入り</span>
        </Link>

        <Link href="/history"
        onClick={(e) => {
          if (!isLoggedIn) {
            e.preventDefault();
          }
        }} className={`${styles.iconButton} ${isActive('/history') ? styles.active : ''} ${!isLoggedIn ? styles.disabled: ''}`} 
        aria-disabled={!isLoggedIn}>
          <MdOutlineHistory className={styles.icon} />
          <span>履歴</span>
        </Link>

        <Link
          href="/mypage"
          onClick={(e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              onOpen();  // モーダルを開く
            }
          }}
          className={`${styles.iconButton} ${isLoggedIn && isActive('/mypage') ? styles.active : ''}`}
        >
          <FaUserCircle className={styles.icon} />
          <span>{isLoggedIn ? 'マイページ' : 'ログイン'}</span>
        </Link>
      </div>

      <LoginModal isOpen={isOpen} onClose={onClose} />
    </footer>
  );
};

export default Footer;
