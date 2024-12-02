import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../../hooks/firebase"; // Firebase設定のインポート
import { collection, doc, getDocs } from "firebase/firestore"; // Firestoreからのデータ取得
import styles from "../Roulette_restaurant/style/MapComponent.module.css";
import { useAuth } from "@/app/hooks/login";

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

interface MapComponentProps {
  userId: string; // ユーザーID
  selectedRestaurantId: string | null;
  onRestaurantClick: (id: string) => void;
  restaurants: Restaurant[];
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
    if (center && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, zoom);
    }
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
        <em>{restaurant.genre}</em>
        <br />
        {restaurant.address && <p>住所: {restaurant.address}</p>}
      </Popup>
    </Marker>
  );
};

const MapComponent = ({ userId, selectedRestaurantId, onRestaurantClick }: MapComponentProps) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // お気に入り飲食店
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const { user } = useAuth();

  // Firestoreからお気に入り飲食店を取得
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.uid) return;

      try {
        const favoritesRef = collection(doc(db, "users", userId), "favorites");
        const querySnapshot = await getDocs(favoritesRef);

        const fetchedRestaurants: Restaurant[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            fetchedRestaurants.push({
              id: doc.id,
              name: data.name,
              address: data.address,
              phone: data.phone,
              open: data.open,
              lat: data.lat,
              lng: data.lng,
              photo: data.photo,
              genre: data.genre,
              budget: data.budget,
            });
          }
        });

        console.log("Fetched restaurants:", fetchedRestaurants);
        setRestaurants(fetchedRestaurants);

        if (fetchedRestaurants.length > 0) {
          const firstRestaurant = fetchedRestaurants[0];
          setMapCenter([firstRestaurant.lat, firstRestaurant.lng]);
        }
      } catch (error) {
        console.error("お気に入りの取得エラー:", error);
      }
    };

    fetchFavorites();
  }, [user?.uid, userId]);

  // 現在地取得（クライアントサイドでのみ実行）
  useEffect(() => {
    // サーバーサイドでwindowやnavigator.geolocationを使用しないようにする
    if (typeof window !== "undefined" && navigator.geolocation) {
      const fetchCurrentLocation = async () => {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCurrentLocation(location);

          // 飲食店がない場合のみ現在地を中心に設定
          if (restaurants.length === 0) {
            setMapCenter([location.lat, location.lng]);
          }
        } catch (error) {
          console.error("現在地の取得エラー:", error);
          // 現在地取得エラー時の処理
          setCurrentLocation(null);
        }
      };

      fetchCurrentLocation();
    }
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
      {restaurants.length > 0 && restaurants.map(
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