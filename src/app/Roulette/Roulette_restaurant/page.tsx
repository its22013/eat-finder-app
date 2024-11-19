"use client";

import { useState } from "react";
import { Restaurant } from "./types/Restaurant";
import SearchForm from "./SearchForm";
import RestaurantSlider from "./RestaurantSlider";
import Footer from "@/app/components/Footer";
import dynamic from "next/dynamic";
import styles from "./main.module.css";
import { SlArrowLeftCircle } from "react-icons/sl";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const RouletteRestaurantPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sliderActive, setSliderActive] = useState(false);
  const [mapActive, setMapActive] = useState(false); 

  // 戻るボタンで状態をリセットする関数
  const goBackToOptions = () => {
    setSliderActive(false);  // スライダーを非表示
    setMapActive(false);     // マップを非表示
    setRestaurants([]);      // レストランデータをリセット（必要に応じて）
    setIsLoading(false);     // ローディング状態をリセット
  };

  return (
    <div>
      {/* Search Form */}
      {!sliderActive && !mapActive ? (
        <SearchForm
          setRestaurants={setRestaurants}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setSliderActive={setSliderActive}
          setMapActive={setMapActive}
        />
      ) : (
        <div className={styles.main_container}>
          {/* Restaurant Slider */}
          {sliderActive && (
            <div >
              <div onClick={goBackToOptions} className={styles.buck_button}>
              <SlArrowLeftCircle />
              </div>
              <RestaurantSlider
                restaurants={restaurants}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                sliderActive={sliderActive}
                setSliderActive={setSliderActive}
                setSelectedRestaurant={setSelectedRestaurant} 
                selectedRestaurantId={selectedRestaurant?.id || ""} 
              />
            </div>
          )}

          {/* Map Component */}
          {mapActive && restaurants.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <MapComponent
                restaurants={restaurants}
                selectedRestaurantId={selectedRestaurant?.id || ""}
                onRestaurantClick={(id) => setSelectedRestaurant(restaurants.find(restaurant => restaurant.id === id) || null)} 
              />
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RouletteRestaurantPage;