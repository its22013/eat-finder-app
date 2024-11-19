import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapComponent.module.css";
import { Restaurant } from "./types/Restaurant";

interface MapComponentProps {
  restaurants: Restaurant[];
  selectedRestaurantId: string | null;
  onRestaurantClick: (id: string) => void; 
}

const DEFAULT_CENTER: [number, number] = [26.1564543, 127.6600793]; // 沖縄
const DEFAULT_ZOOM = 16;

// アイコン作成関数
const createIcon = (iconUrl: string, size: [number, number] = [25, 41]): L.Icon => {
  return L.icon({
    iconUrl,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [1, -34],
    shadowUrl: "/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
};

// マップの中心を更新するコンポーネント
const MapViewUpdater = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// マーカーコンポーネント
const RestaurantMarker = ({
  restaurant,
  isSelected,
  onClick,
}: {
  restaurant: Restaurant;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const icon = isSelected
    ? createIcon("/images/makar01.png", [70, 45])
    : createIcon("/images/marker-icon.png");

  return (
    <Marker position={[restaurant.lat, restaurant.lng]} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup>
        <strong>{restaurant.name}</strong>
        <br />
        <em>{restaurant.genre.name}</em>
        <br />
        {restaurant.address && <p>住所: {restaurant.address}</p>}
      </Popup>
    </Marker>
  );
};

const MapComponent = ({ restaurants, selectedRestaurantId, onRestaurantClick }: MapComponentProps) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  // 現在地取得
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          } else {
            reject(new Error("Geolocation is not supported"));
          }
        });
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCurrentLocation(location);

        // 飲食店がない場合のみ現在地を中心に設定
        if (restaurants.length === 0) {
          setMapCenter([location.lat, location.lng]);
        }
      } catch (error) {
        console.error("現在地の取得エラー:", error);
      }
    };

    fetchCurrentLocation();
  }, [restaurants]);

  // 飲食店リストが更新された場合のマップ中心設定
  useEffect(() => {
    if (restaurants.length > 0) {
      const firstRestaurant = restaurants[0];
      setMapCenter([firstRestaurant.lat, firstRestaurant.lng]);
    }
  }, [restaurants]);

  // 選択された飲食店の中心設定
  useEffect(() => {
    if (selectedRestaurantId) {
      const selectedRestaurant = restaurants.find((r) => r.id === selectedRestaurantId);
      if (selectedRestaurant) {
        setMapCenter([selectedRestaurant.lat, selectedRestaurant.lng]);
      }
    }
  }, [selectedRestaurantId, restaurants]);

  return (
    <MapContainer center={mapCenter} zoom={DEFAULT_ZOOM} className={styles.mapContainer}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* マップ中心を更新 */}
      <MapViewUpdater center={mapCenter} zoom={DEFAULT_ZOOM} />

      {/* 現在地マーカー */}
      {currentLocation && (
        <Marker
          position={[currentLocation.lat, currentLocation.lng]}
          icon={createIcon("/images/current-location-icon.png", [41, 41])}
        >
          <Popup>
            <strong>現在地</strong>
          </Popup>
        </Marker>
      )}

      {/* 飲食店マーカー */}
      {restaurants.map(
        (restaurant) =>
          restaurant.lat &&
          restaurant.lng && (
            <RestaurantMarker
              key={restaurant.id}
              restaurant={restaurant}
              isSelected={restaurant.id === selectedRestaurantId}
              onClick={() => onRestaurantClick(restaurant.id)}
            />
          )
      )}
    </MapContainer>
  );
};

export default MapComponent;