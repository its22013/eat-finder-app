"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import style from './RoulettePage.module.css';
import Footer from '@/app/components/Footer';
import ResultDisplay from './ResultDisplay';
import GenreSelector from './GenreSelector';
import GenreList from './GenreList';

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

  const handleSearchRestaurant = () => {
    if (winner) {
      // ここにジャンルに基づく店を検索するロジックを追加します。
      console.log(`Searching restaurants for: ${winner}`);
      // 例: ルーティングなど
    }
  };

  return (
    <div className={style.page_container}>
      <header className={style.header}>
        <h1 className={style.title01}>
        飲食店ジャンルルーレット
        </h1>
      </header>

      <div className={style.content}>
        <div className={style.result_container}>
          <ResultDisplay winner={winner} />
          
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

          {/* ルーレットが回っている間は表示しない */}
          {!isSpinning && randomGenres.length > 0 && !winner && (
            <button onClick={handleSpin} className={style.button}>
              ルーレットを回す
            </button>
          )}

          {winner && (
            <div className={style.button_group}>
              <button onClick={handleSearchRestaurant} className={style.button}>
                店を検索
              </button>
              <button onClick={handleSpin} className={style.button}>
                もう一度
              </button>
            </div>
          )}

          <GenreSelector remainingGenres={remainingGenres} handleAddGenre={handleAddGenre} />
          <GenreList randomGenres={randomGenres} handleRemoveGenre={handleRemoveGenre} />
        </div>
      </div>

      <footer className={style.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default RestaurantRoulette;