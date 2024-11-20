"use client";

import { useState, useEffect } from "react";
import { Restaurant } from "./types/Restaurant";
import styles from "./SearchComponent.module.css";

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
                      <h3>{restaurant.name}</h3>
                      <p>{restaurant.genre.name}</p>
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