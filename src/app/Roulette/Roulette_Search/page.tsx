"use client";

import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import style from './RoulettePage.module.css';
import Footer from '@/app/components/Footer';

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

// 色の配列を指定
const genreColors = ['#c70000', '#d28300', '#dfd000', '#00873c', '#005aa0', '#181878', '#800073'];

const RestaurantRoulette: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // 選択されたジャンル
  const [isSpinning, setIsSpinning] = useState(false); // スピン中かどうかのフラグ
  const [randomGenres, setRandomGenres] = useState<{ option: string; style: { backgroundColor: string } }[]>([]);
  const [prizeIndex, setPrizeIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null); // ルーレットの結果を表示するためのステート

  useEffect(() => {
    // 初回レンダリング時にランダムに5個のジャンルを選択
    const initialGenres = allGenres.sort(() => 0.5 - Math.random()).slice(0, 5);
    setSelectedGenres(initialGenres);
    updateRandomGenres(initialGenres);
  }, []);

  const updateRandomGenres = (genres: string[]) => {
    const selectedCount = Math.min(genres.length, 5); // 最大5個のジャンルを選択
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
    if (isSpinning || randomGenres.length === 0) return; // スピン中またはジャンルがない場合は何もしない

    const randomPrizeIndex = Math.floor(Math.random() * randomGenres.length);
    setPrizeIndex(randomPrizeIndex);
    setIsSpinning(true); // スピン開始を設定
    setWinner(null); // スピン前にリセット
  };

  const handleAddGenre = (genre: string) => {
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres(prev => {
        const updatedGenres = [...prev, genre];
        updateRandomGenres(updatedGenres); // 追加後にルーレットのデータを更新
        return updatedGenres;
      });
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres(prev => {
      const updatedGenres = prev.filter(g => g !== genre);
      updateRandomGenres(updatedGenres); // 削除後にルーレットのデータを更新
      return updatedGenres;
    });
  };

  // プルダウンに表示するためのジャンル (すでに選択されているものを除く)
  const remainingGenres = allGenres.filter(
    genre => !selectedGenres.includes(genre)
  );
  return (
    <div className={style.page_container}>
      {/* タイトルを固定 */}
      <header className={style.header}>
        飲食店ジャンルルーレット
      </header>

      {/* スクロール可能なコンテンツ */}
      <div className={style.content}>
        <div className={style.result_container}>
          {/* ルーレット結果の表示 */}
          {winner && (
            <div className={style.result_container01}>
              <h2>ルーレットの結果:</h2>
              <h1 className={style.text01}>{winner}</h1>
            </div>
          )}

          {/* ルーレット表示 */}
          {randomGenres.length > 0 ? (
            <Wheel
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

          {/* ルーレットを回すボタン */}
          <button onClick={handleSpin} disabled={isSpinning || randomGenres.length === 0}>
            ルーレットを回す
          </button>

          {/* ランダムに選ばれたジャンルのリスト */}
          <div>
            <h2>ルーレットのジャンル:</h2>
            <ul className={style.ul}>
              {randomGenres.map((genre, index) => (
                <li key={index} className={style.li}>
                  {genre.option} <button onClick={() => handleRemoveGenre(genre.option)}>削除</button>
                </li>
              ))}
            </ul>
          </div>

          {/* 未選択のジャンルから選択できるドロップダウン */}
          <div>
            <h2>未選択のジャンルから選択:</h2>
            <select onChange={(e) => handleAddGenre(e.target.value)} value="">
              <option value="" disabled>ジャンルを選択</option>
              {remainingGenres.map((genre, index) => (
                <option key={index} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Footerは画面の下部に固定 */}
      <footer className={style.footer}>
        <Footer />
      </footer>
    </div>
  );
};
export default RestaurantRoulette;