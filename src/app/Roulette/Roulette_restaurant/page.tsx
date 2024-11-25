"use client";

import { useState } from "react";
import { Restaurant } from "./types/Restaurant";
import SearchForm from "./SearchForm";
import RestaurantSlider from "./RestaurantSlider";
import Footer from "@/app/components/Footer";
import dynamic from "next/dynamic";
import styles from "./style/main.module.css";
import { SlArrowLeftCircle } from "react-icons/sl";
import Header from "./header";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const RouletteRestaurantPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sliderActive, setSliderActive] = useState(false);
  const [mapActive, setMapActive] = useState(false);

  const goBackToOptions = () => {
    setSliderActive(false);
    setMapActive(false);
    setRestaurants([]);
    setIsLoading(false);
  };

  return (
    <div>
      {/* Header */}
      <Header />

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
          {/* Back Button */}
          <div onClick={goBackToOptions} className={styles.buck_button}>
            <SlArrowLeftCircle />
          </div>

          {/* Slider and Map Container */}
          <div className={styles.slider_and_map_container}>
            {/* Restaurant Slider */}
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

            {/* Map Component */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RouletteRestaurantPage;