import React from 'react';
import style from './RoulettePage.module.css';

interface GenreSelectorProps {
  remainingGenres: string[];
  handleAddGenre: (genre: string) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ remainingGenres, handleAddGenre }) => {
  return (
    <div className={style.drop_jank}>
      <select onChange={(e) => handleAddGenre(e.target.value)} value="">
        <option value="" disabled>ジャンルを選択</option>
        {remainingGenres.map((genre, index) => (
          <option key={index} value={genre}>{genre}</option>
        ))}
      </select>
    </div>
  );
};

export default GenreSelector;