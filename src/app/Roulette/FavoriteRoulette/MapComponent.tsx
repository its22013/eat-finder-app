import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../../hooks/firebase"; // Firebase設定のインポート
import { doc, getDoc } from "firebase/firestore"; // Firestoreからのデータ取得
import styles from "../Roulette_restaurant/style/MapComponent.module.css";
import { useAuth } from "@/app/hooks/login";
import { useParams } from "next/navigation"; // useParamsを修正

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
const MapViewUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({
  userId,
  selectedRestaurantId,
  onRestaurantClick,
}: {
  userId: string;
  selectedRestaurantId: string | null;
  onRestaurantClick: (id: string) => void;
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const { rouletteId } = useParams(); // URLのパラメータからrouletteIdを取得

  // Firestoreから飲食店データを取得
  useEffect(() => {
    if (userId && rouletteId) {
      const fetchRestaurantDetails = async () => {
        try {
          const id = Array.isArray(rouletteId) ? rouletteId[0] : rouletteId;

          const docRef = doc(db, "users", userId, "favorites_roulette", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("データ取得:", data); // デバッグ用ログ
            if (data?.restaurantDetails && Array.isArray(data.restaurantDetails)) {
              setRestaurants(data.restaurantDetails);
            } else {
              console.error("restaurantDetails が存在しないか、形式が異なります");
            }
          } else {
            console.error("指定されたルーレットが見つかりません");
          }
        } catch (error) {
          console.error("データ取得エラー:", error);
        }
      };

      fetchRestaurantDetails();
    }
  }, [userId, rouletteId]);

  // 現在地を取得
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation: [number, number] = [latitude, longitude];
        setCurrentLocation(userLocation);
        setMapCenter(userLocation);
      },
      (error) => {
        console.error("現在地の取得に失敗しました:", error);
      }
    );
  }, []);

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

      <MapViewUpdater center={mapCenter} />

      {/* 現在地マーカー */}
      {currentLocation && (
        <Marker
          position={currentLocation}
          icon={createIcon("/images/current-location-icon.png", [40, 40])}
        >
          <Popup>あなたの現在地</Popup>
        </Marker>
      )}

      {/* 飲食店マーカー */}
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.lat, restaurant.lng]}
          icon={
            restaurant.id === selectedRestaurantId
              ? createIcon("/images/makar01.png", [70, 45])
              : createIcon("/images/marker-icon.png")
          }
          eventHandlers={{
            click: () => onRestaurantClick(restaurant.id),
          }}
        >
          <Popup>
            <strong>{restaurant.name}</strong>
            <br />
            <em>{restaurant.genre}</em>
            <br />
            {restaurant.address && <p>住所: {restaurant.address}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;