"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import styles from "./options.module.css";

const SearchOptions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [range, setRange] = useState<string>('3'); // 初期範囲を1000mに設定
  const [numResults, setNumResults] = useState<string>('10');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  const categories = ["居酒屋", "焼肉・ホルモン", "韓国料理", "和食", "中華", "ダイニングバー・バル", "創作料理", "洋食", "アジア・エスニック料理", "各国料理", "カラオケ・パーティ", "バー・カクテル", "ラーメン", "カフェ・スイーツ", "その他グルメ", "お好み焼き・もんじゃ"];

  // rangeの値に基づく半径のマッピング
  const radiusMap: { [key: string]: number } = {
    "1": 300,    // 300m
    "2": 500,    // 500m
    "3": 1000,   // 1000m (デフォルト)
    "4": 2000,   // 2000m
    "5": 3000    // 3000m
  };

  const handleSearch = () => {
    const categoryQuery = selectedCategory || '';
    const budgetQuery = budget || '';
    const rangeQuery = range || '3';
    const numResultsQuery = numResults || '10';

    if (currentLocation) {
      // 検索パラメータにrange（半径）を含めてURLに渡す
      router.push(`/Roulette/map_api?category=${encodeURIComponent(categoryQuery)}&budget=${encodeURIComponent(budgetQuery)}&range=${encodeURIComponent(rangeQuery)}&numResults=${encodeURIComponent(numResultsQuery)}&lat=${currentLocation.lat}&lng=${currentLocation.lng}`);
    } else {
      alert('現在地を取得できませんでした。');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        error => {
          console.error(error);
          alert('現在地を取得できませんでした');
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className={styles.container}>
    <div className={styles.search_options_container}>
      <h1>飲食店の詳細</h1>
      <select className={styles.select_dropdown} onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
        <option value="">カテゴリを選択してください</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <select className={styles.select_dropdown} onChange={(e) => setRange(e.target.value)} value={range}>
        <option value="1">300m</option>
        <option value="2">500m</option>
        <option value="3">1000m (デフォルト)</option>
        <option value="4">2000m</option>
        <option value="5">3000m</option>
      </select>

      <select className={styles.select_dropdown} onChange={(e) => setNumResults(e.target.value)} value={numResults}>
        <option value="10">10件 (デフォルト)</option>
        <option value="20">20件</option>
        <option value="30">30件</option>
        <option value="40">40件</option>
        <option value="50">50件</option>
        <option value="100">100件</option>
      </select>

      <button className={styles.search_button} onClick={handleSearch}>検索</button>
      <Footer />
    </div>
    </div>
  );
};

export default SearchOptions;