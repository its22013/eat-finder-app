// FavoriteRestaurantRoulette Component
"use client"

import { useState, useEffect } from "react";
import styles from "../style/main.module.css";
import { RiMoneyCnyCircleFill } from "react-icons/ri";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../hooks/firebase";
import { useAuth } from "../../../hooks/login";
import Footer from "@/app/components/Footer";
import dynamic from "next/dynamic"; // 動的インポート
import Header from "../header";
import { SlArrowLeftCircle } from "react-icons/sl";
import { useParams, useRouter } from "next/navigation";

// MapComponent をクライアントサイドでのみレンダリング
const MapComponent = dynamic(() => import("../MapComponent"), { ssr: false });

interface Restaurant {
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

const FavoriteRestaurantRoulette = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSliding, setIsSliding] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  
  const { rouletteId } = useParams();

  useEffect(() => {
    if (user && rouletteId) {
      const fetchRouletteDetails = async () => {
        try {
          const id = Array.isArray(rouletteId) ? rouletteId[0] : rouletteId;
  
          const docRef = doc(
            db,
            "users",
            user.uid,
            "favorites_roulette",
            id
          );
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.restaurantDetails && Array.isArray(data.restaurantDetails)) {
              setRestaurants(data.restaurantDetails || []);
            }
          } else {
            console.error("指定されたルーレットが見つかりません");
          }
        } catch (error) {
          console.error("ルーレット情報の取得中にエラーが発生しました:", error);
        } finally {
          setIsSliding(false);
        }
      };
  
      fetchRouletteDetails();
    }
  }, [user, rouletteId]);   

  const startSliding = () => {
  if (restaurants.length === 0) {
    alert("飲食店が登録されていません");
    return;
  }

  setIsSliding(true);

  let spinCount = 0;
  const totalSpins = 30; // ルーレットの総回転数
  const randomIndex = Math.floor(Math.random() * restaurants.length); // ランダムで選ぶ最終インデックス

  const spinInterval = setInterval(() => {
    setCurrentIndex((prevIndex) => {
      // 次のインデックスを計算
      const nextIndex = (prevIndex + 1) % restaurants.length;
      return nextIndex;
    });

    spinCount++;

    if (spinCount >= totalSpins) {
      clearInterval(spinInterval); // ルーレットを停止

      // 最終的にランダムで選ばれたインデックスを設定
      setTimeout(() => {
        setCurrentIndex(randomIndex);
        setIsSliding(false);

        // 選ばれた飲食店の情報をコンソールに表示
        const selectedRestaurant = restaurants[randomIndex];
        if (selectedRestaurant) {
          console.log("選ばれた飲食店:", selectedRestaurant);
        }
      }, 300); // アニメーションのスムーズな終了
    }
  }, 100);
};


  const goBack = () => {
    router.push("/Roulette/Roulette_restaurant");
  };

  const handleRestaurantClick = (id: string) => {
    console.log(`Restaurant clicked: ${id}`);
  };

  return (
    <div>
      <Header />
      <div onClick={goBack} className={styles.buck_button}>
        <SlArrowLeftCircle />
      </div>
      {restaurants.length > 0 ? (
        <div className={styles.slider_and_map_container}>
          <div className={styles.store_container}>
            <div className={styles.sliderContainer}>
              <div
                className={styles.slider}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: isSliding ? "transform 0.1s ease-in-out" : "none",
                }}
              >
                {restaurants.map((restaurant) => (
                  <div key={restaurant.id} className={styles.slide}>
                    <div className={styles.images_conatiner}>
                      {restaurant.photo && (
                        <img
                          src={restaurant.photo}
                          alt="店舗写真"
                          className={styles.store_photo}
                        />
                      )}
                      <h3>営業時間</h3>
                      <p>{restaurant.open}</p>
                    </div>
                    <div className={styles.store_text}>
                      <h3>{restaurant.name}</h3>
                      <h2 className={styles.genre_container}># {restaurant.genre}</h2>
                      <h3 className={styles.budget_container}>
                        <RiMoneyCnyCircleFill />
                        {restaurant.budget || "不明"}
                      </h3>
                      <a
                        href={`https://www.google.com/maps?q=${restaurant.name} ${restaurant.lat},${restaurant.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.address_link}
                      >
                        マップで表示
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={startSliding}
            disabled={isSliding}
            className={styles.search_button}
          >
            {isSliding ? "・・・" : "開始"}
          </button>

          <div className={styles.map_container}>
              {user && (
                <MapComponent
                  userId={user.uid}
                  selectedRestaurantId={restaurants[currentIndex]?.id || null}
                  onRestaurantClick={handleRestaurantClick} 
                />
              )}
            </div>
        </div>
      ) : (
        <p></p>
      )}
      <Footer />
    </div>
  );
};

export default FavoriteRestaurantRoulette;