"use client";

import { useState, useEffect } from "react";
import { Restaurant } from "./types/Restaurant";
import styles from "./style/SearchComponent.module.css";
import { RiMoneyCnyCircleFill } from "react-icons/ri";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../hooks/firebase";
import { useAuth } from "../../hooks/login"; // useAuthフックをインポート
import { IoMdHeart } from "react-icons/io";


interface Props {
  restaurants: Restaurant[];
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  sliderActive: boolean;
  setSliderActive: (active: boolean) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  selectedRestaurantId: string | null;
}

const RestaurantSlider = ({
  restaurants,
  setIsLoading,
  isLoading,
  sliderActive,
  setSliderActive,
  setSelectedRestaurant,
  selectedRestaurantId,
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]); // 飲食店情報を保存する配列
  const { user } = useAuth(); // ログインユーザーの情報を取得

  // Firebaseからお気に入りのレストラン情報を取得
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        // ユーザーIDを使って、お気に入りのレストランIDを取得
        const docRef = collection(db, "users", user.uid, "favorites");
        const querySnapshot = await getDocs(docRef); // すべてのドキュメントを取得

        // ドキュメントが存在する場合、IDのリストをfavoritesに設定
        const fetchedFavorites: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedFavorites.push(doc.data()); // 各レストランのデータを取得
        });

        setFavorites(fetchedFavorites); // お気に入りのレストラン情報をセット
      };
      fetchFavorites();
    }
  }, [user]);

  // 選択中のレストランIDの状態を監視
  useEffect(() => {
    if (selectedRestaurantId) {
      const selectedRestaurantIndex = restaurants.findIndex(
        (restaurant) => restaurant.id === selectedRestaurantId
      );
      if (selectedRestaurantIndex !== -1) {
        setCurrentIndex(selectedRestaurantIndex);
      }
    }
  }, [selectedRestaurantId, restaurants]);

  // スライドが終了したときに選択する飲食店を管理する
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSliding) {
      setIsLoading(true);
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % restaurants.length);
      }, 100);
    } else {
      setIsLoading(false);
      // スライドが停止したら選ばれた飲食店を更新
      const selectedRestaurant = restaurants[currentIndex];
      setSelectedRestaurant(selectedRestaurant);
      console.log("選ばれた飲食店:", selectedRestaurant);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isSliding, restaurants, setIsLoading, currentIndex, setSelectedRestaurant]);

  const startSliding = () => {
    setIsSliding(true);
    setTimeout(() => {
      setIsSliding(false); // 3秒後にスライド停止
    }, 3000);
  };

  // お気に入りを切り替える処理
  const toggleFavorite = async (restaurantId: string, restaurant: Restaurant) => {
    if (!user) {
      alert("ログインしてください");
      return;
    }

    const docRef = collection(db, "users", user.uid, "favorites");
  
    let updatedFavorites = [...favorites];

    // お気に入りに追加または削除
    const isAlreadyFavorite = favorites.some((fav) => fav.id === restaurantId);

    if (isAlreadyFavorite) {
      // お気に入りから削除
      updatedFavorites = updatedFavorites.filter((fav) => fav.id !== restaurantId);
      const docToDelete = doc(db, "users", user.uid, "favorites", restaurantId);
   
      await Promise.all ([
        deleteDoc(docToDelete),
      ]); // お気に入り削除
      alert("お気に入りから削除しました！");
    } else {
      // お気に入りに追加
      const restaurantData = {
        id: restaurant.id,
        name: restaurant.name,
        genre: restaurant.genre.name,
        photo: restaurant.photo?.mobile?.s || "",
        open: restaurant.open.split("（")[0].trim(),
        budget: restaurant.budget?.name || "不明",
        address: restaurant.address,
        lat: restaurant.lat,
        lng: restaurant.lng,
      };
      const favoriteDoc = doc(db, 'users', user.uid, 'favorites', restaurant.id);
  
      await Promise.all([
        setDoc(favoriteDoc, restaurantData),
      ]);
      updatedFavorites.push(restaurantData);
      alert("お気に入りに追加しました！");
    }

    setFavorites(updatedFavorites);
  };

  return (
    <div>
      {sliderActive ? (
        <div className={styles.store_container}>
          <div className={styles.sliderContainer}>
            <div
              className={styles.slider}
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isSliding ? "transform 0.1s ease-in-out" : "none",
              }}
            >
              {restaurants.map((restaurant, index) => {
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  restaurant.address
                )}`;
                const isFavorite = favorites.some((fav) => fav.id === restaurant.id); // お気に入りかどうかの判定

                return (
                  <div key={index} className={styles.slide}>
                    <div className={styles.images_conatiner}>
                      {restaurant.photo && (
                        <img
                          src={restaurant.photo.mobile?.s}
                          alt="店舗写真（モバイル用）"
                          className={styles.store_photo}
                        />
                      )}
                      <h3>営業時間</h3>
                      <p>{restaurant.open.split("（")[0].trim()}</p>
                    </div>
                    <div className={styles.store_text}>
                      <h3>
                        {restaurant.name.length > 15
                          ? `${restaurant.name.substring(0, 15)} . . .`
                          : restaurant.name}
                      </h3>
                      <h2 className={styles.genre_container}># {restaurant.genre.name}</h2>
                      <h3 className={styles.budget_container}>
                        <RiMoneyCnyCircleFill />
                        {restaurant.budget?.name || "不明"}
                      </h3>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.address_link}
                      >
                        マップで表示
                      </a>
                      <div
                        onClick={() => toggleFavorite(restaurant.id, restaurant)}
                        className={`${styles.heart_icon} ${isFavorite ? styles.favorited : ''}`} 
                      >
                        <IoMdHeart />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={startSliding}
            disabled={isLoading || isSliding}
            className={styles.search_button}
          >
            {isSliding ? "・・・" : "開始"}
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => setSliderActive(true)}>
            飲食店を表示する
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantSlider;
