import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "@/app/hooks/firebase"; // Firestoreのインポート

export const createFavoriteRoulette = async (
  userId: string,
  rouletteName: string,
  restaurantIds: string[],
  restaurants: any[] // restaurantsを受け取るように修正
) => {
  try {
    // 新しいルーレット用のドキュメントを作成
    const rouletteRef = doc(collection(db, "users", userId, "favorites_roulette"));
    
    // restaurantIds に基づいて restaurants 配列から詳細を取得
    const restaurantDetails = restaurantIds
      .map((restaurantId) => {
        const restaurant = restaurants.find((res) => res.id === restaurantId);
        if (restaurant) {
          return {
            id: restaurant.id,
            name: restaurant.name || "不明",
            genre: restaurant.genre || "不明", 
            photo: restaurant.photo || "",
            open: restaurant.open?.split("（")[0].trim() || "不明", 
            budget: restaurant.budget || "不明", 
            address: restaurant.address || "不明",
            lat: restaurant.lat || 0,
            lng: restaurant.lng || 0, 
          };
        }
        return null; // 見つからない場合はnullを返す
      })
      .filter((restaurant) => restaurant !== null); // nullを取り除く

    // もし restaurantDetails が空の場合はエラーを投げる
    if (restaurantDetails.length === 0) {
      throw new Error("選択されたレストランが無効です。");
    }

    // ルーレットデータをFirestoreに保存
    const newDocRef = await addDoc(collection(db, "users", userId, "favorites_roulette"), {
      name: rouletteName,
      restaurantDetails: restaurantDetails, // 飲食店詳細情報を保存
    });

    // 作成されたドキュメントのIDを取得
    const rouletteId = newDocRef.id;

    // ルーレット作成後にページ遷移
    window.location.href = `/Roulette/FavoriteRoulette/${rouletteId}`; // 作成したルーレットページのIDに遷移

    alert("ルーレットが作成されました");

  } catch (error) {
    console.error("ルーレット作成エラー:", error);
    alert(`エラーが発生しました`);
  }
};