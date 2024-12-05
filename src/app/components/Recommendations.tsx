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
}

// ジャンル名とコードの対応表
const genreMapping: { [key: string]: string } = {
  居酒屋: "G001",
  "ダイニングバー・バル": "G002",
  創作料理: "G003",
  和食: "G004",
  洋食: "G005",
  "イタリアン・フレンチ": "G006",
  中華: "G007",
  "焼肉・ホルモン": "G008",
  韓国料理: "G017",
  "アジア・エスニック料理": "G009",
  各国料理: "G010",
  "カラオケ・パーティ": "G011",
  "バー・カクテル": "G012",
  ラーメン: "G013",
  "お好み焼き・もんじゃ": "G016",
  "カフェ・スイーツ": "G014",
  その他グルメ: "G015",
};

const Recommendations: React.FC = () => {
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // 現在の認証状態を取得

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!user) {
          console.error("User is not authenticated");
          return;
        }

        const userId = user.uid;
        const recommendationRef = collection(db, `users/${userId}/favorites`);
        const snapshot = await getDocs(recommendationRef);

        // ジャンルをカウント
        const genreCount: { [key: string]: number } = {};
        snapshot.docs.forEach((doc) => {
          const genre = doc.data().genre;
          if (genre) {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          }
        });

        // ジャンルを頻度でソート
        const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
        const mostFrequentGenre = sortedGenres.length > 0 ? sortedGenres[0][0] : null;

        // ジャンルコードを取得
        const genreCode = mostFrequentGenre ? genreMapping[mostFrequentGenre] : "G001"; // デフォルト値
        console.log("検索するジャンルコード:", genreCode);
        // APIリクエストパラメータの設定
        const paramsObject: any = {
          q: "",
          genre: genreCode, // ジャンルコード
          wifi: "0",
          private_room: "0",
          lunch: "0",
          free_drink: "0",
          free_food: "0",
          parking: "0",
          midnight: "0",
          service_area: "",
          lat: "",
          lng: "",
          range: "",
        };

        const params = new URLSearchParams(paramsObject);
        const res = await fetch(`/api/hotpepper?${params.toString()}`);
        if (!res.ok) {
          throw new Error("Error fetching search results");
        }

        const data = await res.json();
        if (!data.results.shop) {
          throw new Error("No restaurants found");
        }

        const restaurants: Restaurant[] = data.results.shop
          .slice(0, 3) // 上位3つを取得
          .map((shop: any) => ({
            id: shop.id,
            name: shop.name,
            genre: shop.genre.name,
            photo: shop.photo.pc.m,
            address: shop.address,
            sub_genre: shop.sub_genre?.name || '',
          }));

        setRecommendedRestaurants(restaurants);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    if (user) {
      fetchRecommendations(); // ユーザーが認証済みの場合のみデータ取得
    }
  }, [user]); // ユーザー状態が変化したら再取得

  if (error) {
    return <p>エラーが発生しました: {error}</p>;
  }

  return (
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
            ジャンル: <span className={styles.resutaurantgn}>{restaurant.genre}</span>
          </p>
          <p> サブジャンル:{" "}
          <span style={{ fontWeight: "bold" }}>
          {restaurant.sub_genre || "なし"}
         </span>
          </p>
          {/* <p className={styles.resutaurantGenre}>サブジャンル:{restaurant}</p> */}
          <p className={styles.restaurantAddress}>{restaurant.address}</p>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;