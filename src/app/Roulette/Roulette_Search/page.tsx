"use client";

import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import './RoulettePage.module.css'; // スタイルを適用するためのCSSファイルを作成してください

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
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false); // スピン中かどうかのフラグ
  const [randomGenres, setRandomGenres] = useState<{ option: string; style: { backgroundColor: string } }[]>([]);
  const [prizeIndex, setPrizeIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null); // ルーレットの結果を表示するためのステート

  useEffect(() => {
    // 10個のジャンルから5個をランダムに選択し、それぞれに色を設定
    const randomSelection = allGenres
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((genre, index) => ({
        option: genre,
        style: { backgroundColor: genreColors[index % genreColors.length] }
      }));

    setRandomGenres(randomSelection);
  }, []);

  const handleSpin = () => {
    if (isSpinning || randomGenres.length === 0) return; // スピン中またはジャンルがない場合は何もしない

    const randomPrizeIndex = Math.floor(Math.random() * randomGenres.length);
    setPrizeIndex(randomPrizeIndex);
    setIsSpinning(true); // スピン開始を設定
    setWinner(null); // スピン前にリセット
  };

  const handleAddGenre = (genre: string) => {
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres(prev => [...prev, genre]);
    }
  };

  const handleRemoveGenre = (genre: string) => {
    // ランダムに選ばれたジャンルから削除する処理
    setRandomGenres(prev => prev.filter(g => g.option !== genre));
    setSelectedGenres(prev => prev.filter(g => g !== genre));
  };

  const remainingGenres = allGenres.filter(genre => !selectedGenres.includes(genre) && !randomGenres.some(rg => rg.option === genre));

  return (
    <div className="roulette-container">
      <h1>飲食店ジャンルルーレット</h1>

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
            setIsSpinning(false); // スピン終了時にリセット
            if (prizeIndex !== null) {
              setWinner(randomGenres[prizeIndex].option); // 当選したジャンルをセット
              handleAddGenre(randomGenres[prizeIndex].option); // 当選したジャンルを選択リストに追加
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

      {/* ルーレット結果の表示 */}
      {winner && (
        <div>
          <h2>ルーレットの結果:</h2>
          <p>{winner}</p>
        </div>
      )}

      {/* ランダムに選ばれたジャンルのリスト */}
      <div>
        <h2>ルーレットのジャンル:</h2>
        <ul>
          {randomGenres.map((genre, index) => (
            <li key={index}>
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
  );
};

export default RestaurantRoulette;