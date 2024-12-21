import { useState } from "react";
import CurrentLocationSearch from "./SearchForm/CurrentLocationSearch";
import PrefectureSearch from "./SearchForm/PrefectureSearch";
import FavoritesRoulette from "./SearchForm/FavoritesRoulette";
import styles from "./style/SearchForm.module.css";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/hooks/firebase";

const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

interface SearchFormProps {
    setRestaurants: (restaurants: any[]) => void;
    setIsLoading: (loading: boolean) => void;
    isLoading: boolean;
    setSliderActive: (active: boolean) => void;
    setMapActive: (active: boolean) => void;
    userId: string;
}

const SearchForm = ({ setRestaurants, setIsLoading, isLoading, setSliderActive, setMapActive, userId }: SearchFormProps) => {
    const [lat, setLat] = useState<number>(26.1564543);
    const [lng, setLng] = useState<number>(127.6600793);
    const [category, setCategory] = useState('');
    const [range, setRange] = useState(5);
    const [count, setCount] = useState(10);
    const [prefecture, setPrefecture] = useState('');
    const [locationChoice, setLocationChoice] = useState<'current' | 'prefecture' | 'roulette' | 'favorites'>('current');

    const getCurrentLocation = () => {
        return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error("位置情報の取得に失敗しました:", error);
                        reject(new Error("位置情報の取得に失敗しました"));
                    }
                );
            } else {
                reject(new Error("Geolocationはサポートされていません"));
            }
        });
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setSliderActive(true);

        try {
            let currentLat = lat;
            let currentLng = lng;

            if (locationChoice === 'current') {
                const currentLocation = await getCurrentLocation();
                currentLat = currentLocation.latitude;
                currentLng = currentLocation.longitude;
            }

            let url = '/api/Roulette_api?format=json';

            if (locationChoice === 'current') {
                url += `&lat=${currentLat}&lng=${currentLng}`;
            }

            if (locationChoice === 'prefecture' && prefecture) {
                url += `&keyword=${prefecture}`;
            }

            if (category) {
                url += `&genre=${category}`;
            }

            if (range) {
                url += `&range=${range}`;
            }

            if (count) {
                url += `&count=${count}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('APIリクエストに失敗しました');
            }

            const data = await response.json();
            setRestaurants(data.results?.shop || []);

            // Firebaseにカテゴリを保存
            await saveCategoryToFirebase(category, userId);

            setMapActive(true);
        } catch (error) {
            console.error("Search error:", error);
            alert("飲食店の検索に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const saveCategoryToFirebase = async (category: string, userId: string | null) => {
        try {
            const genreRef = doc(db, "genre", category);
            const genreDoc = await getDoc(genreRef);

            if (genreDoc.exists()) {
                await updateDoc(genreRef, { count: increment(1) });
            } else {
                await setDoc(genreRef, { count: 1 });
            }

            if (userId) {
                const userGenreRef = doc(db, "users", userId, "genre", category);
                const userGenreDoc = await getDoc(userGenreRef);

                if (userGenreDoc.exists()) {
                    await updateDoc(userGenreRef, { count: increment(1) });
                } else {
                    await setDoc(userGenreRef, { count: 1 });
                }
            }
        } catch (error) {
            console.error("Firebaseエラー:", error);
        }
    };

    return (
        <div className={styles.sub_container}>
            <div className={styles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        value="current"
                        checked={locationChoice === 'current'}
                        onChange={() => setLocationChoice('current')}
                    />
                    現在地
                </label>
                <label>
                    <input
                        type="radio"
                        value="prefecture"
                        checked={locationChoice === 'prefecture'}
                        onChange={() => setLocationChoice('prefecture')}
                    />
                    都道府県
                </label>
                {userId && (
                    <label>
                        <input
                            type="radio"
                            value="favorites"
                            checked={locationChoice === 'favorites'}
                            onChange={() => setLocationChoice('favorites')}
                        />
                        お気に入り
                    </label>
                )}
            </div>
            {locationChoice === 'current' && (
                <CurrentLocationSearch
                    handleSearch={handleSearch}
                    isLoading={isLoading}
                    setCategory={setCategory}
                    setRange={setRange}
                    setCount={setCount}
                    category={category}
                    range={range}
                    count={count}
                />
            )}
            {locationChoice === 'prefecture' && (
                <PrefectureSearch
                    prefectures={prefectures}
                    prefecture={prefecture}
                    setPrefecture={setPrefecture}
                    category={category}
                    count={count}
                    setCategory={setCategory}
                    setCount={setCount}
                    handleSearch={handleSearch}
                    isLoading={isLoading}
                />
            )}
            {locationChoice === 'favorites' && userId && (
                <FavoritesRoulette userId={userId} />
            )}
        </div>
    );
};

export default SearchForm;