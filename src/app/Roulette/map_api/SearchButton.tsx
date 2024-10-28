import React from 'react';
import styles from './map.module.css';

const SearchButton: React.FC<{ isSpinning: boolean; onClick: () => void }> = ({ isSpinning, onClick }) => (
  <button onClick={onClick} disabled={isSpinning} className={styles.button}>
    {isSpinning ? '検索中...' : '飲食店を検索'}
  </button>
);

export default SearchButton;
