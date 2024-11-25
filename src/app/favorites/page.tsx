"use client";

import React, { useEffect, useState } from 'react';
import { onAuthStateChangedListener } from '../hooks/login';
import { db } from '../hooks/firebase';
import { doc, getDocs, collection } from 'firebase/firestore';
import Footer from "../components/Footer";
import LoadingScreen from '../components/LoadingScreen';
import { User } from 'firebase/auth';
import styles from './Favorites.module.css';
import OperatingHours from './OperatingHours';

interface FavoriteStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  open: string;
  lat: number;
  lng: number;
  photo: string;
}

const Favorites: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // エラーメッセージ用

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      if (user) {
        fetchAllFavorites(user.uid); // ユーザーがログインしていればデータ取得
      } else {
        setFavorites([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const fetchAllFavorites = async (userId: string) => {
    setLoading(true);
    setError(null); // エラーをリセット
    try {
      const snapshot = await getDocs(collection(doc(db, "users", userId), "favorites"));
      const fetchedFavorites: FavoriteStore[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        address: doc.data().address,
        phone: doc.data().phone,
        open: doc.data().open,
        lat: doc.data().lat,
        lng: doc.data().lng,
        photo: doc.data().photo,
      }));
      setFavorites(fetchedFavorites);
    } catch (error) {
      setError('お気に入りの取得に失敗しました。再試行してください。');
      console.error("お気に入りを取得中にエラーが発生しました: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className={styles.message}>ログインして、お気に入りの飲食店を表示しましょう。</div>;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className={styles.message}>{error}</div>;
  }

  if (favorites.length === 0) {
    return <div className={styles.message}>お気に入りはまだありません。</div>;
  }



  return (
    <div className={styles.favorites_container}>
      <div className={styles.title_container}>
        <h1 className={styles.title_text}>お気に入りの飲食店 ({favorites.length}件)</h1>
      </div>

      <div className={styles.favorites_list_container}>
        <ul className={styles.favorites_list}>
          {favorites.map((store) => (
            <li key={store.id} className={styles.favorite_item}>
              <h2>{store.name}</h2>
              {store.photo && (
                <img
                  src={store.photo}
                  alt="店舗写真（モバイル用）"
                  className={styles.store_photo}
                />
              )}
              <p>住所: {store.address}</p>
              <p>営業時間:</p>
              <OperatingHours hours={store.open} />
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;