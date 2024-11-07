'use client';

import React, { useEffect, useState } from 'react';
import { FaSearch, FaHeart, FaUserCircle } from 'react-icons/fa';
import { FaSackDollar } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/Footer.module.css';
import { onAuthStateChangedListener } from '../hooks/login';
import { IoHome } from 'react-icons/io5';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // onAuthStateChangedListener からリスナーを登録し、unsubscribe関数を受け取る
    const unsubscribe = onAuthStateChangedListener((user) => {
      setIsLoggedIn(!!user);  // ユーザーが存在すればログイン状態
    });

    // コンポーネントがアンマウントされたときにリスナーを解除
    return () => unsubscribe;
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <footer className={styles.footer}>
      <div className={styles.iconContainer}>
        {/* 検索ページリンク */}
        <Link href="/" className={`${styles.iconButton} ${isActive('/') || isActive('/Roulette/map_api') || isActive('/Roulette/map_api/Restran_opthon') || isActive('/Store_Search/page') ? styles.active : ''}`}>
          <IoHome className={styles.icon} />
          <span>Home</span>
        </Link>

        {/* お気に入りページリンク - ログインしていない場合は灰色にしてクリック不可に */}
        <Link href={isLoggedIn ? "/favorites" : "#"} className={`${styles.iconButton} ${isActive('/favorites') ? styles.active : ''} ${!isLoggedIn ? styles.disabled : ''}`} aria-disabled={!isLoggedIn}>
          <FaHeart className={styles.icon} />
          <span>お気に入り</span>
        </Link>

        {/* 食費プランページリンク */}
        <Link href="/money_plan" className={`${styles.iconButton} ${isActive('/money_plan') ? styles.active : ''}`}>
          <FaSackDollar className={styles.icon} />
          <span>食費プラン</span>
        </Link>

        {/* マイページリンク */}
        <Link href="/mypage" className={`${styles.iconButton} ${isActive('/mypage') ? styles.active : ''}`}>
          <FaUserCircle className={styles.icon} />
          <span>マイページ</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
