import React, { useState, useEffect } from "react";
import { db } from "@/app/hooks/firebase"; // Firebase初期化ファイル
import { collection, getDocs } from "firebase/firestore";
import styles from "./CategoryRanking.module.css";
import { TbHandClick } from "react-icons/tb";
import { Spinner } from "@chakra-ui/react/spinner";
import { FaMedal } from "react-icons/fa"; // メダルアイコン

interface Genre {
  id: string;
  count: number;
  name: string;
}

const GenreRanking: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGenres = async () => {
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
          name: doc.data().name,  // name を取得
        }));

        // カウントで降順にソート
        const sortedGenres = genresData.sort((a, b) => b.count - a.count);

        setGenres(sortedGenres.slice(0, 10));  // トップ10に制限
      } catch (err) {
        console.error("カテゴリデータの取得に失敗しました", err);
        setError("カテゴリデータの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

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
  );
};

export default GenreRanking;