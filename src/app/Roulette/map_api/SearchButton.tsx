import React from 'react';
import styles from './map.module.css';

const SearchButton: React.FC<{ isSpinning: boolean; onClick: () => void }> = ({ isSpinning, onClick }) => (
  <button onClick={onClick} disabled={isSpinning} className={styles.button}>
    <h3>{isSpinning ? '・・・' : '検索'}</h3>
  </button>
);

export default SearchButton;
