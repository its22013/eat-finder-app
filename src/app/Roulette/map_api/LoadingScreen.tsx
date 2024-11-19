// components/LoadingScreen.tsx
import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}></div>
      <div className={styles.loadingText}>検索中...</div>
    </div>
  );
};

export default LoadingScreen;
