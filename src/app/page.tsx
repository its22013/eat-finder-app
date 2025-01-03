"use client";

import React from 'react';
import Footer from '@/app/components/Footer';
import style from '@/app/home.module.css';
import { useRouter } from 'next/navigation'; 
import Recommendations from './components/Recommendations';
import CategoryRanking from './components/Genre_Ranking';
import Header from './components/header';

const Home: React.FC = () => {
  const router = useRouter();

  const handleForm01 = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50msの振動
    }
    router.push('/Roulette/Roulette_restaurant'); 
  };

  const handleForm02 = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50msの振動
    }
    router.push('/Store_Search');
  };

  return (
    <div>
        <div className={style.container}>
          <Header />

          <div className={style.sub_container}>
            <div className={style.button_container}>
              <button onClick={handleForm01} className={style.button01}>ルーレットで検索</button>
              <button onClick={handleForm02} className={style.button02}>キーワードで検索</button>
            </div>

            <div className={style.text_container}>
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
      <Footer />
    </div>
  );
};

export default Home;