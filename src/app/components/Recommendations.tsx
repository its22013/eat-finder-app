import React, { useState, useEffect } from "react";
import { db } from "@/app/hooks/firebase"; // Firebase初期化ファイル
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/app/hooks/login"; // 認証関連のhooksをインポート
import styles from "./Recommendation.module.css";

interface Restaurant {
  id: string;
  name: string;
  genre: string;
  photo: string;
  address: string;
  sub_genre: string;
  lat: string;
  lng: string;
}

const Recommendations: React.FC = () => {
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // 現在の認証状態を取得
  const [searchCategories, setSearchCategories] = useState<string[]>([]); // 複数カテゴリ
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("位置情報の取得に失敗しました", error);
            setError("位置情報の取得に失敗しました");
          }
        );
      } else {
        setError("位置情報取得がサポートされていません");
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchSearchCategory = async () => {
      try {
        let genreWithCount: { genreCode: string; count: number }[] = [];

        if (user) {
          // ユーザーごとのジャンルデータを取得
          const userId = user.uid;
          const genreRef = collection(db, `users/${userId}/genre`);
          const snapshot = await getDocs(genreRef);

          if (!snapshot.empty) {
            snapshot.docs.forEach((doc) => {
              const genreCode = doc.id;
              const count = doc.data().count;
              if (genreCode && count !== undefined) {
                genreWithCount.push({ genreCode, count });
              }
            });
          }
        }

        // ユーザー固有のデータがない場合、全体のデータを取得
        if (genreWithCount.length === 0 && user) {
          const allGenresRef = collection(db, "genre");
          const globalSnapshot = await getDocs(allGenresRef);

          if (globalSnapshot.empty) {
            setError("全体のジャンルデータが見つかりません");
            return;
          }

          globalSnapshot.docs.forEach((doc) => {
            const genreCode = doc.id;
            const count = doc.data().count;
            if (genreCode && count !== undefined) {
              genreWithCount.push({ genreCode, count });
            }
          });
        }

        // ログインしていない場合はデフォルトカテゴリを使用
        if (!user) {
          const defaultGenres = ["G001", "G002", "G003", "G004", "G005", "G006",
                                "G007", "G008", "G009", "G010", "G011", "G012",
                                "G013", "G014", 
          ];
          const randomGenres = defaultGenres.sort(() => 0.5 - Math.random()).slice(0, 3);
          setSearchCategories(randomGenres);
          return;
        }

        // 降順でソートして上位3つを取得
        const sortedGenres = genreWithCount.sort((a, b) => b.count - a.count);
        const top3Genres = sortedGenres.slice(0, 3).map((item) => item.genreCode);

        if (!top3Genres.length) {
          setError("カテゴリが見つかりません");
          return;
        }

        setSearchCategories(top3Genres);
      } catch (error) {
        console.error(error);
        setError("カテゴリの取得に失敗しました");
      }
    };

    fetchSearchCategory();
  }, [user]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!searchCategories.length || !userLocation) return;

      try {
        const allRestaurants: Restaurant[] = [];
        const genreParam = searchCategories.join(",");
        const queryString = `genre=${genreParam}&lat=${userLocation.lat}&lng=${userLocation.lng}&range=5&count=10`;
        const url = `/api/Roulette_api?${queryString}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Error fetching search results");
        }

        const data = await res.json();
        if (data.results && data.results.shop) {
          allRestaurants.push(
            ...data.results.shop.map((shop: any) => ({
              id: shop.id,
              name: shop.name,
              genre: shop.genre.name,
              photo: shop.photo.pc.m,
              address: shop.address,
              sub_genre: shop.sub_genre?.name || "",
            }))
          );
        }

        if (allRestaurants.length > 0) {
          setRecommendedRestaurants(allRestaurants.slice(0, 3));
        } else {
          setError("飲食店が見つかりませんでした");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    if (searchCategories.length && userLocation) {
      fetchRecommendations();
    }
  }, [searchCategories, userLocation]);

  if (error) {
    return <p>エラーが発生しました: {error}</p>;
  }

  return (
    <div>
      <div className={styles.recommendationsContainer}>
        {recommendedRestaurants.map((restaurant) => (
          <div key={restaurant.id} className={styles.restaurant}>
            <img
              src={restaurant.photo}
              alt={restaurant.name}
              className={styles.restaurantImage}
            />
            <h2 className={styles.restaurantName}>{restaurant.name}</h2>
            <p className={styles.restaurantGenre}>
              ジャンル: <span>{restaurant.genre}</span>
            </p>
            <a
              href={`https://www.google.com/maps?q=${restaurant.name} ${restaurant.lat},${restaurant.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.address_link}
            >
              マップで表示
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;