"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import style from './RoulettePage.module.css';
import Footer from '@/app/components/Footer';

const DynamicWheel = dynamic(() => import('react-custom-roulette').then(mod => mod.Wheel), { ssr: false });

const allGenres = [
  'イタリアン',
  '和食',
  '中華',
  'フレンチ',
  'カフェ',
  'バイキング',
  '焼肉',
  '寿司',
  'インド料理',
  'ファーストフード'
];

const genreColors = ['#c70000', '#d28300', '#dfd000', '#00873c', '#005aa0', '#181878', '#800073'];

const RestaurantRoulette: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [randomGenres, setRandomGenres] = useState<{ option: string; style: { backgroundColor: string } }[]>([]);
  const [prizeIndex, setPrizeIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialGenres = allGenres.sort(() => 0.5 - Math.random()).slice(0, 5);
      setSelectedGenres(initialGenres);
      updateRandomGenres(initialGenres);
    }
  }, []);

  const updateRandomGenres = (genres: string[]) => {
    const selectedCount = Math.min(genres.length, 5);
    const randomSelection = genres
      .sort(() => 0.5 - Math.random())
      .slice(0, selectedCount)
      .map((genre, index) => ({
        option: genre,
        style: { backgroundColor: genreColors[index % genreColors.length] }
      }));
    setRandomGenres(randomSelection);
  };

  const handleSpin = () => {
    if (isSpinning || randomGenres.length === 0) return;

    const randomPrizeIndex = Math.floor(Math.random() * randomGenres.length);
    setPrizeIndex(randomPrizeIndex);
    setIsSpinning(true);
    setWinner(null);
  };

  const handleAddGenre = (genre: string) => {
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres(prev => {
        const updatedGenres = [...prev, genre];
        updateRandomGenres(updatedGenres);
        return updatedGenres;
      });
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres(prev => {
      const updatedGenres = prev.filter(g => g !== genre);
      updateRandomGenres(updatedGenres);
      return updatedGenres;
    });
  };

  const remainingGenres = allGenres.filter(
    genre => !selectedGenres.includes(genre)
  );

  return (
    <div className={style.page_container}>
      <header className={style.header}>
        飲食店ジャンルルーレット
      </header>

      <div className={style.content}>
        <div className={style.result_container}>
          {winner && (
            <div className={style.result_container01}>
              <h2>今回は</h2>
              <h1 className={style.text01}>{winner}</h1>
              <h2>に決定！</h2>
            </div>
          )}

          {randomGenres.length > 0 ? (
            <DynamicWheel
              mustStartSpinning={isSpinning}
              prizeNumber={prizeIndex !== null ? prizeIndex : 0}
              data={randomGenres}
              outerBorderColor="#ccc"
              innerRadius={20}
              innerBorderWidth={10}
              onStopSpinning={() => {
                setIsSpinning(false);
                if (prizeIndex !== null) {
                  setWinner(randomGenres[prizeIndex].option);
                }
              }}
            />
          ) : (
            <p>ジャンルがまだ選択されていません。</p>
          )}

          <button onClick={handleSpin} disabled={isSpinning || randomGenres.length === 0} className={style.button}>
            ルーレットを回す
          </button>

          <div>
            <div className={style.drop_jank}>
              <select onChange={(e) => handleAddGenre(e.target.value)} value="">
                <option value="" disabled>ジャンルを選択</option>
                {remainingGenres.map((genre, index) => (
                  <option key={index} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

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
          </div>
        </div>
      </div>

      <footer className={style.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default RestaurantRoulette;