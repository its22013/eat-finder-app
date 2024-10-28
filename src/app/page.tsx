"use client";

import React from 'react';
import Footer from '@/app/components/Footer';
import style from '@/app/home.module.css';
import { useRouter } from 'next/navigation'; 

const Home: React.FC = () => {
  const router = useRouter(); 
  const handleForm01 = () => {
    router.push('/Roulette/map_api'); 
  };
  const handleForm02 = () => {
    router.push('/Store_Search');
  };

  return (
    <div>
      <main>
        <div className={style.container}>
          <h1 className={style.text01}>Eats Finder へようこそ！</h1>

          {/* 検索ページに遷移するボタン */}
          <button onClick={handleForm01} className={style.button}>ルーレットで検索</button>

          <button onClick={handleForm02} className={style.button}>キーワードで検索</button>

          {/* 最近閲覧した飲食店 */}
          <div className={style.text_container}>
            <hr className={style.line} />
            <h1 className={style.text02}>最近閲覧した飲食店</h1>
            <hr className={style.line} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;