"use client";

import React, { useState, useEffect } from 'react';
import Footer from '@/app/components/Footer';
import style from '@/app/home.module.css';
import { useRouter } from 'next/navigation'; 
import Recommendations from './components/Recommendations';
import CategoryRanking from './components/Genre_Ranking';

const Home: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // クライアントサイドかどうかのフラグ

  useEffect(() => {
    setIsClient(true); // クライアントサイドでレンダリングが始まったらフラグを更新
  }, []);

  const handleForm01 = () => {
    router.push('/Roulette/Roulette_restaurant'); 
  };

  const handleForm02 = () => {
    router.push('/Store_Search');
  };

  if (!isClient) {
    // クライアントサイドでの初回レンダリングを待つ
    return null;
  }

  return (
    <div>
      <main>
        <div className={style.container}>
          <h1 className={style.text01}>Eats Finder へようこそ！</h1>

          <div className={style.sub_container}>

          {/* 検索ページに遷移するボタン */}
          <div className={style.button_container}>
          <button onClick={handleForm01} className={style.button}>ルーレットで検索</button>

          <button onClick={handleForm02} className={style.button}>キーワードで検索</button>
          </div>

          <div className={style.text_container}>
          {/* おすすめの飲食店 */}
          <div className={style.text_line}>
            <hr className={style.line} />
            <h1 className={style.text02}>おすすめの飲食店</h1>
            <hr className={style.line} />
          </div>
          <Recommendations />
        </div>
        <CategoryRanking />
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;