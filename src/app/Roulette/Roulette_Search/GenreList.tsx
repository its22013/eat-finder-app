import React from 'react';
import style from './RoulettePage.module.css';

interface GenreListProps {
  randomGenres: { option: string; style: { backgroundColor: string } }[];
  handleRemoveGenre: (genre: string) => void;
}

const GenreList: React.FC<GenreListProps> = ({ randomGenres, handleRemoveGenre }) => {
  return (
    <div className={style.scrollable_container}>
      <ul className={style.ul}>
        {randomGenres.map((genre, index) => (
          <li key={index} className={style.li}>
            <span>{genre.option}</span>
            <button onClick={() => handleRemoveGenre(genre.option)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreList;