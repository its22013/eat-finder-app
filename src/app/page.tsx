import React from 'react';
import Footer from '@/app/components/Footer';
import style from '@/app/home.module.css'

const Home: React.FC = () => {
  return (
    <div>
    <main>
      <div className={style.text01}>
        <h1>こんにちは！</h1>
      </div>
    </main>
    <Footer />
    </div>
  );
};

export default Home;