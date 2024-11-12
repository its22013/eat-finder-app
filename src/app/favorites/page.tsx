// Favorites.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { onAuthStateChangedListener } from '../hooks/login';
import { db } from '../hooks/firebase';
import { doc, getDocs, collection } from 'firebase/firestore';
import Footer from "../components/Footer";
import LoadingScreen from '../Roulette/map_api/LoadingScreen';
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
}

const Favorites: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      if (user) {
        fetchFavorites(user.uid);
      } else {
        setFavorites([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const fetchFavorites = async (userId: string) => {
    setLoading(true);
    try {
      const favoritesRef = collection(doc(db, "users", userId), "favorites");
      const snapshot = await getDocs(favoritesRef);

      const fetchedFavorites: FavoriteStore[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        address: doc.data().address,
        phone: doc.data().phone,
        open: doc.data().open,
        lat: doc.data().lat,
        lng: doc.data().lng,
      }));

      setFavorites(fetchedFavorites);
    } catch (error) {
      console.error("お気に入りを取得中にエラーが発生しました: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const paginatedFavorites = favorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!user) {
    return <div>ログインして、お気に入りの飲食店を表示しましょう。</div>;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (favorites.length === 0) {
    return <div>お気に入りはまだありません。</div>;
  }

  return (
    <div className={styles.favorites_container}>
      <div className={styles.title_container}>
        <h1 className={styles.title_text}>お気に入りの飲食店 ({favorites.length}件)</h1>
      </div>
      <ul className={styles.favorites_list}>
        {paginatedFavorites.map((store) => (
          <li key={store.id} className={styles.favorite_item}>
            <h2>{store.name}</h2>
            <p>住所: {store.address}</p>
            <p>電話番号: {store.phone}</p>
            <p>営業時間:</p>
            <OperatingHours hours={store.open} />
          </li>
        ))}
      </ul>

      {/* ページネーションのナビゲーション */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;