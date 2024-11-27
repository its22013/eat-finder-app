"use client";

import { useState, useEffect } from "react";
import styles from "./style/main.module.css";
import { RiMoneyCnyCircleFill } from "react-icons/ri";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../hooks/firebase";
import { useAuth } from "../../hooks/login";
import Footer from "@/app/components/Footer";
import dynamic from "next/dynamic"; // 動的インポート
import Header from "./header";
import { SlArrowLeftCircle } from "react-icons/sl";
import { useRouter } from "next/navigation";

// MapComponent をクライアントサイドでのみレンダリング
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

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
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          const docRef = collection(db, "users", user.uid, "favorites");
          const querySnapshot = await getDocs(docRef);

          const fetchedFavorites: Restaurant[] = [];
          querySnapshot.forEach((doc) => {
            fetchedFavorites.push(doc.data() as Restaurant);
          });

          setFavorites(fetchedFavorites);
        } catch (error) {
          console.error("お気に入りの取得中にエラーが発生しました:", error);
        }
      };

      fetchFavorites();
    }
  }, [user]);

  const startSliding = () => {
    if (favorites.length === 0) {
      alert("お気に入りの飲食店がありません");
      return;
    }

    setIsSliding(true);
    setIsLoading(true);

    let spinCount = 0;
    let finalIndex = currentIndex;

    const spinInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % favorites.length;
        finalIndex = nextIndex; // 現在のインデックスを追跡
        return nextIndex;
      });
      spinCount++;

      if (spinCount >= 30) {
        clearInterval(spinInterval);
        setIsSliding(false);
        setIsLoading(false);
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
              {favorites.map((restaurant) => {
                const googleMapsUrl = `https://www.google.com/maps?q=${restaurant.name} ${restaurant.lat},${restaurant.lng}`;
                return (
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
                      <p>{restaurant.open.split("（")[0].trim()}</p>
                    </div>
                    <div className={styles.store_text}>
                      <h3>
                        {restaurant.name.length > 15
                          ? `${restaurant.name.substring(0, 15)} . . .`
                          : restaurant.name}
                      </h3>
                      <h2 className={styles.genre_container}># {restaurant.genre}</h2>
                      <h3 className={styles.budget_container}>
                        <RiMoneyCnyCircleFill />
                        {restaurant.budget || "不明"}
                      </h3>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.address_link}
                      >
                        マップで表示
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button
          onClick={startSliding}
          disabled={isLoading || isSliding}
          className={styles.search_button}
        >
          {isSliding ? "・・・" : "開始"}
        </button>

        <div className={styles.map_container}>
          {user && (
            <MapComponent
              userId={user.uid}
              selectedRestaurantId={favorites[currentIndex]?.id || null}
              onRestaurantClick={handleRestaurantClick}
              restaurants={favorites}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavoriteRestaurantRoulette;