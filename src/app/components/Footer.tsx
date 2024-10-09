'use client';

import React from 'react';
import { FaSearch, FaHeart, FaUserCircle } from 'react-icons/fa';
import { FaSackDollar } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/Footer.module.css';


const Footer: React.FC = () => {
  const pathname = usePathname(); 

  const isActive = (path: string) => pathname === path;

  return (
    <footer className={styles.footer}>
      <div className={styles.iconContainer}>
        <Link href="/" className={`${styles.iconButton} ${isActive('/') ? styles.active : ''}`}>
          <FaSearch className={styles.icon} />
          <span>検索</span>
        </Link>

        <Link href="/favorites" className={`${styles.iconButton} ${isActive('/favorites') ? styles.active : ''}`}>
          <FaHeart className={styles.icon} />
          <span>お気に入り</span>
        </Link>

        <Link href="/money_plan" className={`${styles.iconButton} ${isActive('/money_plan') ? styles.active : ''}`}>
          <FaSackDollar className={styles.icon} />
          <span>食費プラン</span>
        </Link>

        <Link href="/mypage" className={`${styles.iconButton} ${isActive('/mypage') ? styles.active : ''}`}>
          <FaUserCircle className={styles.icon} />
          <span>マイページ</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
