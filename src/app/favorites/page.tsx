// Favorites.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { onAuthStateChangedListener } from '../hooks/login';
import { db } from '../hooks/firebase';
import { doc, getDocs, collection, query, orderBy, startAfter, limit } from 'firebase/firestore';
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
  const [lastDoc, setLastDoc] = useState<any | null>(null); // ページネーション用の最後のドキュメント
  const itemsPerPage = 5;

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      if (user) {
        fetchFavorites(user.uid); // 最初のページのデータを取得
      } else {
        setFavorites([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const fetchFavorites = async (userId: string, lastVisibleDoc = null) => {
    setLoading(true);
    try {
      // クエリ作成（ソート、ページサイズ設定）
      let favoritesQuery = query(
        collection(doc(db, "users", userId), "favorites"),
        orderBy("name"), // 名前でソート（任意のフィールドで変更可能）
        limit(itemsPerPage) // 1ページあたりのアイテム数
      );

      // ページネーションのために、前ページの最後のドキュメントからスタート
      if (lastVisibleDoc) {
        favoritesQuery = query(favoritesQuery, startAfter(lastVisibleDoc));
      }

      const snapshot = await getDocs(favoritesQuery);

      const fetchedFavorites: FavoriteStore[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        address: doc.data().address,
        phone: doc.data().phone,
        open: doc.data().open,
        lat: doc.data().lat,
        lng: doc.data().lng,
      }));

      // ページごとのデータを設定し、次ページのために最後のドキュメントを保存
      setFavorites(fetchedFavorites);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("お気に入りを取得中にエラーが発生しました: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      await fetchFavorites(user?.uid as string, lastDoc); // 次ページのデータ取得
    }
  };

  const totalPages = Math.ceil(favorites.length / itemsPerPage);

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
        {favorites.map((store) => (
          <li key={store.id} className={styles.favorite_item}>
            <h2>{store.name}</h2>
            <p>住所: {store.address}</p>
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