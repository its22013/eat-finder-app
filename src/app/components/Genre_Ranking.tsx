import React, { useState, useEffect } from "react";
import { db } from "@/app/hooks/firebase"; // Firebase初期化ファイル
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // ログイン状態を確認
import styles from "./CategoryRanking.module.css";
import { TbHandClick } from "react-icons/tb";
import { Spinner } from "@chakra-ui/react/spinner";
import { FaMedal } from "react-icons/fa"; // メダルアイコン
import { PiRankingFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5"; // 閉じるアイコン

interface Genre {
  id: string;
  count: number;
  name: string;
}

const GenreRanking: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // ログイン状態

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ユーザーのログイン状態を確認
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // ユーザーが存在するかどうか
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  // ログイン後にカテゴリデータを取得
  useEffect(() => {
    const fetchGenres = async () => {
      if (!isLoggedIn) return; // ログイン状態が確定するまで待つ

      setLoading(true);
      setError(null);

      try {
        const genreCollection = collection(db, "genre");
        const snapshot = await getDocs(genreCollection);

        if (snapshot.empty) {
          setError("カテゴリデータが見つかりません");
          setLoading(false);
          return;
        }

        const genresData: Genre[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          count: doc.data().count,
          name: doc.data().name, // name を取得
        }));

        // カウントで降順にソート
        const sortedGenres = genresData.sort((a, b) => b.count - a.count);

        setGenres(sortedGenres.slice(0, 10)); // トップ10に制限
      } catch (err) {
        setError("カテゴリデータの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [isLoggedIn]); // isLoggedIn が変化したときに実行

  if (isLoggedIn === null) {
    // ログイン確認中
    return (
      <div>
        <Spinner size="xl" color="teal" />
        <p className={styles.loadingText}>ログイン状態を確認しています...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    // ログインしていない場合
    return <p className={styles.notLoggedIn}></p>;
  }

  if (loading) {
    return (
      <div>
        <Spinner size="xl" color="teal" />
        <p className={styles.loadingText}>情報を取得中...</p>
      </div>
    );
  }

  if (error) {
    return <p>エラーが発生しました: {error}</p>;
  }

  // 順位に応じたアイコンを表示する関数
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <FaMedal className={styles.gold} size={24} />; // 金メダル
      case 1:
        return <FaMedal className={styles.silver} size={24} />; // 銀メダル
      case 2:
        return <FaMedal className={styles.bronze} size={24} />; // 銅メダル
      default:
        return <span>{rank + 1}位</span>;
    }
  };

  return (
    <div className={styles.rankingContainer}>
      {/* ハンバーガーメニューアイコン (スマホ用) */}
      <div className={styles.hamburgerIcon} onClick={toggleMenu}>
        {isMenuOpen ? <IoClose size={28} /> : <PiRankingFill size={28} />}
      </div>

      {/* ハンバーガーメニューの内容 */}
      {isMenuOpen && (
        <div className={styles.menuContent}>
          <h2 className={styles.rankingTitle}>今月のカテゴリTop10</h2>
          <ul className={styles.rankingList}>
            {genres.map((genre, index) => (
              <li key={genre.id} className={styles.rankingItem}>
                <span className={styles.rankingPosition}>
                  {getRankIcon(index)} {/* 順位に応じたアイコン */}
                </span>
                <span className={styles.rankingName}>{genre.name}</span>
                <span className={styles.rankingCount}>
                  <TbHandClick />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 通常のランキングリスト (Web用) */}
      <div className={styles.desktopContent}>
        <h2 className={styles.rankingTitle}>今月のカテゴリTop10</h2>
        <ul className={styles.rankingList}>
          {genres.map((genre, index) => (
            <li key={genre.id} className={styles.rankingItem}>
              <span className={styles.rankingPosition}>
                {getRankIcon(index)} {/* 順位に応じたアイコン */}
              </span>
              <span className={styles.rankingName}>{genre.name}</span>
              <span className={styles.rankingCount}>
                <TbHandClick />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenreRanking;
