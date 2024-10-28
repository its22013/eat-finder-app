// components/Header.tsx
import React from 'react';
import styles from '../map.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
     <h1 className={styles.title01}>飲食店ルーレット</h1>
    </header>
  );
};

export default Header;