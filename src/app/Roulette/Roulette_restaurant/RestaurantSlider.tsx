import { useState, useEffect } from "react";
import { Restaurant } from "./types/Restaurant";
import styles from "./style/SearchComponent.module.css";
import { RiMoneyCnyCircleFill } from "react-icons/ri";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../hooks/firebase";
import { useAuth } from "../../hooks/login"; // useAuthフックをインポート
import { IoMdHeart } from "react-icons/io";
import confetti from "canvas-confetti";

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
  const [isSliding, setIsSliding] = useState(false); // ルーレットが開始されていない状態からスタート
  const [favorites, setFavorites] = useState<any[]>([]); // 飲食店情報を保存する配列
  const { user } = useAuth(); // ログインユーザーの情報を取得

  // Firebaseからお気に入りのレストラン情報を取得
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        const docRef = collection(db, "users", user.uid, "favorites");
        const querySnapshot = await getDocs(docRef);

        const fetchedFavorites: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedFavorites.push(doc.data());
        });

        setFavorites(fetchedFavorites);
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

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSliding) {
      setIsLoading(true);

      let elapsedTime = 0; // 経過時間を追跡

      timer = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * restaurants.length);
        setCurrentIndex(randomIndex);
        elapsedTime += 100; // 100msごとに経過時間を加算

        if (elapsedTime >= 5000) { // 5秒経過したら停止
          clearInterval(timer); // ルーレット停止
          setIsSliding(false); // ルーレット停止状態にする
          const selectedRestaurant = restaurants[randomIndex]; // 最後に選ばれた飲食店
          setSelectedRestaurant(selectedRestaurant); // 選ばれた飲食店を表示
          setIsLoading(false); // 読み込み終了
          console.log("選ばれた飲食店:", selectedRestaurant);

          // クラッカーを表示
          confetti({
            particleCount: 100,
            spread: 70,
            origin: window.innerWidth <= 768 ? { x: 0.5, y: 0.6 } : { x: 0.2, y: 0.6 },
          });
        }
      }, 100); // 100msごとにランダムな飲食店を選ぶ
    }

    return () => {
      clearInterval(timer); // クリーンアップ
    };
  }, [isSliding, restaurants, setIsLoading, setSelectedRestaurant]);

  const startSliding = () => {
    if (!isSliding) {
      setIsSliding(true); // ルーレット開始
    }
  };

  const toggleFavorite = async (restaurantId: string, restaurant: Restaurant) => {
    if (!user) {
      alert("ログインしてください");
      return;
    }

    const docRef = collection(db, "users", user.uid, "favorites");

    let updatedFavorites = [...favorites];

    const isAlreadyFavorite = favorites.some((fav) => fav.id === restaurantId);

    if (isAlreadyFavorite) {
      updatedFavorites = updatedFavorites.filter((fav) => fav.id !== restaurantId);
      const docToDelete = doc(db, "users", user.uid, "favorites", restaurantId);

      await Promise.all([deleteDoc(docToDelete)]);
      alert("お気に入りから削除しました！");
    } else {
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

      await Promise.all([setDoc(favoriteDoc, restaurantData)]);
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