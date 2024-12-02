"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { onAuthStateChangedListener } from '../hooks/login';
import { db } from '../hooks/firebase';
import { doc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import Footer from "../components/Footer";
import LoadingScreen from '../components/LoadingScreen';
import { User } from 'firebase/auth';
import styles from './Favorites.module.css';
import OperatingHours from './OperatingHours';
import { FaDeleteLeft } from "react-icons/fa6";
import { FaMapMarkedAlt } from 'react-icons/fa';
import { RiMoneyCnyCircleFill } from 'react-icons/ri';

interface FavoriteStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  open: string;
  lat: number;
  lng: number;
  photo: string;
  genre: string;
  budget: string;
}

const Favorites: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      if (user) {
        fetchAllFavorites(user.uid);
      } else {
        setFavorites([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const fetchAllFavorites = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(doc(db, "users", userId), "favorites"));
      const fetchedFavorites: FavoriteStore[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FavoriteStore[];
      setFavorites(fetchedFavorites);
    } catch (error) {
      setError('お気に入りの取得に失敗しました。再試行してください。');
      console.error("お気に入りを取得中にエラーが発生しました: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (storeId: string) => {
    if (!window.confirm("本当にこの店舗をお気に入りから削除しますか？")) return;

    try {
      await deleteDoc(doc(db, "users", user?.uid || "", "favorites", storeId));
      setFavorites(favorites.filter((store) => store.id !== storeId));
      alert("店舗が削除されました。");
    } catch (error) {
      setError('削除中にエラーが発生しました。再試行してください。');
      console.error("削除中にエラーが発生しました: ", error);
    }
  };

  if (!user) {
    return (
      <div>
        <div className={styles.message}>ログインして、お気に入りの飲食店を表示しましょう。</div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className={styles.message}>{error}</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className={styles.message}>
        <div className={styles.message_icon}>⭐</div>
        <div className={styles.message_text}>お気に入りはまだありません。</div>
        <div className={styles.suggestion_text}>お気に入りを追加して、ここにリストを表示しましょう。</div>
        <Link legacyBehavior href="/Store_Search">
          <a className={styles.action_button}>飲食店を探す</a>
        </Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.favorites_container}>
      <div className={styles.title_container}>
        <h1 className={styles.title_text}>お気に入りの飲食店 ({favorites.length}件)</h1>
      </div>
      <Link legacyBehavior href="/Roulette/Roulette_restaurant">
        <a className={styles.roulette_link}>ルーレット検索</a>
      </Link>
      <div className={styles.favorites_list_container}>
        <ul className={styles.favorites_list}>
          {favorites.map((store) => {
            const googleMapsUrl = `https://www.google.com/maps?q=${store.name} ${store.lat},${store.lng}`;
            return (
              <li key={store.id} className={styles.favorite_item}>
                <div className={styles.text_container}>
                  {store.photo && (
                    <img
                      src={store.photo}
                      alt="店舗写真（モバイル用）"
                      className={styles.store_photo}
                    />
                  )}
                  <div className={styles.sub_container}>
                    <div className={styles.genre_text}>{store.genre}</div>
                    <h3>{store.name.length > 15 ? `${store.name.substring(0, 15)} . . .` : store.name}</h3>
                    <div className={styles.budget_text}>
                      <RiMoneyCnyCircleFill />
                      <h3>{store.budget}</h3>
                    </div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.address_link}
                    >
                      <FaMapMarkedAlt />
                    </a>
                  </div>
                </div>
                <OperatingHours hours={store.open} />
                <div
                  className={styles.delete_button}
                  onClick={() => deleteFavorite(store.id)}
                >
                  <FaDeleteLeft />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
