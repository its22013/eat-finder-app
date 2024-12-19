// RouletteRestaurantPage.tsx
"use client";

import { useState, useEffect } from "react";
import { Restaurant } from "./types/Restaurant";
import SearchForm from "./SearchForm";
import RestaurantSlider from "./RestaurantSlider";
import Footer from "@/app/components/Footer";
import dynamic from "next/dynamic";
import styles from "./style/main.module.css";
import { SlArrowLeftCircle } from "react-icons/sl";
import { useAuth } from "../../hooks/login";
import Header from "./header";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const RouletteRestaurantPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sliderActive, setSliderActive] = useState(false);
  const [mapActive, setMapActive] = useState(false);

  // useAuthフックを使って認証状態を取得
  const { user } = useAuth();  // user情報を取得

  const goBackToOptions = () => {
    setSliderActive(false);
    setMapActive(false);
    setRestaurants([]);
    setIsLoading(false);
  };

  return (
    <div>
      <Header />
      <div>
      {!sliderActive && !mapActive ? (
        <SearchForm
          setRestaurants={setRestaurants}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setSliderActive={setSliderActive}
          setMapActive={setMapActive}
          userId={user?.uid || ""} 
        />
      ) : (
        <div className={styles.main_container}>
          
          <div onClick={goBackToOptions} className={styles.buck_button}>
            <SlArrowLeftCircle />
          </div>

          
          <div className={styles.slider_and_map_container}>
            
            {sliderActive && (
              <div className={styles.slider_container}>
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

            
            {mapActive && restaurants.length > 0 && (
              <div className={styles.map_container}>
                <MapComponent
                  restaurants={restaurants}
                  selectedRestaurantId={selectedRestaurant?.id || ""}
                  onRestaurantClick={(id) =>
                    setSelectedRestaurant(restaurants.find((restaurant) => restaurant.id === id) || null)
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default RouletteRestaurantPage;