import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation"; // ページ遷移用
import { db } from "@/app/hooks/firebase";
import styles from "./FavoritesRoulette.module.css"
import { createFavoriteRoulette } from "./createFavoriteRoulette";

interface Restaurant {
  id: string;
  name: string;
}

interface Roulette {
  id: string;
  name: string;
  restaurantIds: string[];
}

const FavoritesRouletteCreation = ({ userId }: { userId: string }) => {
  const [favorites, setFavorites] = useState<Restaurant[]>([]); // ユーザーのお気に入り飲食店
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]); // 選択された飲食店ID
  const [rouletteName, setRouletteName] = useState(""); // ルーレット名
  const [roulettes, setRoulettes] = useState<Roulette[]>([]); // 作成済みのルーレット
  const router = useRouter(); // ページ遷移用

  // お気に入り飲食店を取得
  useEffect(() => {
    const fetchFavorites = async () => {
      const favoritesRef = collection(db, "users", userId, "favorites");
      const favoritesSnapshot = await getDocs(favoritesRef);
      const favoritesList = favoritesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Restaurant[];
      setFavorites(favoritesList);
    };

    const fetchRoulettes = async () => {
      const roulettesRef = collection(db, "users", userId, "favorites_roulette");
      const roulettesSnapshot = await getDocs(roulettesRef);
      const roulettesList = roulettesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Roulette[];
      setRoulettes(roulettesList);
    };

    fetchFavorites();
    fetchRoulettes();
  }, [userId]);

  // 飲食店選択のハンドラー
  const handleRestaurantSelect = (restaurantId: string) => {
    setSelectedRestaurants((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId) // 選択解除
        : [...prev, restaurantId] // 新たに選択
    );
  };

  // ルーレット作成のハンドラー
  const handleCreateRoulette = async () => {
    if (roulettes.length >= 5) {
      alert("ルーレットは最大5つまでしか作成できません");
      return;
    }
  
    if (selectedRestaurants.length < 3) {
      alert("少なくとも3つの飲食店を選択してください");
      return;
    }
  
    if (!rouletteName.trim()) {
      alert("ルーレット名を入力してください");
      return;
    }
  
    if (rouletteName.trim().length < 1 || rouletteName.trim().length > 5) {
      alert("ルーレット名は1文字以上5文字以内で入力してください");
      return;
    }
  
    createFavoriteRoulette(userId, rouletteName.trim(), selectedRestaurants, favorites);
  };  

  // ルーレット削除のハンドラー
  const handleDeleteRoulette = async (rouletteId: string) => {
    const rouletteRef = doc(db, "users", userId, "favorites_roulette", rouletteId);
    await deleteDoc(rouletteRef);

    // ルーレット削除後、表示されているルーレットを更新
    setRoulettes((prevRoulettes) => prevRoulettes.filter((roulette) => roulette.id !== rouletteId));
  };

  // ページ遷移
  const navigateToRoulette = (rouletteId: string) => {
    router.push(`/Roulette/FavoriteRoulette/${rouletteId}`);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="ルーレット名を入力"
        value={rouletteName}
        onChange={(e) => setRouletteName(e.target.value)}
      />

      <div>
        <h3>お気に入り飲食店 (タップして選択)</h3>
        <div className={styles.restaurant_container}>
          {favorites.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() => handleRestaurantSelect(restaurant.id)}
              className={`${styles["Check_FavoritesRoulette"]} ${
                selectedRestaurants.includes(restaurant.id) ? styles.selected : ""
              }`}
            >
              {restaurant.name}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleCreateRoulette} className={styles.button}>ルーレットを作成</button>

      <div className={styles.Already_created_roulette}>
      <div className={styles.text_line}>
        <hr className={styles.line} />
        <h3>作成済みのルーレット</h3>
        <hr className={styles.line} />
      </div>
        <div className={styles.Already_created_container}>
          {roulettes.map((roulette) => (
            <div key={roulette.id}className={styles.Already_created_box}>
              <div onClick={() => navigateToRoulette(roulette.id)}>
                {roulette.name}
              </div>
              <button 
                onClick={() => handleDeleteRoulette(roulette.id)} 
                className={styles.deleteButton}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesRouletteCreation;