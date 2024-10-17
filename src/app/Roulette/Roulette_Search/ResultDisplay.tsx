import React from 'react';
import style from './RoulettePage.module.css';

interface ResultDisplayProps {
  winner: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ winner }) => {
  return (
    <div className={style.result_container01}>
      {winner && (
        <>
          <h2>今回は</h2>
          <h1 className={style.text01}>{winner}</h1>
          <h2>に決定！</h2>
        </>
      )}
    </div>
  );
};

export default ResultDisplay;