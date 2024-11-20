"use client";

import { useState, useEffect } from "react";
import styles from "./style/SearchComponent.module.css";

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
}

const SearchForm = ({ setRestaurants, setIsLoading, isLoading, setSliderActive, setMapActive }: SearchFormProps) => {
    const [lat, setLat] = useState<number>(26.1564543); // 初期値として沖縄の座標を設定
    const [lng, setLng] = useState<number>(127.6600793); // 初期値として沖縄の座標を設定
    const [category, setCategory] = useState('');
    const [range, setRange] = useState(5);
    const [count, setCount] = useState(10);
    const [prefecture, setPrefecture] = useState('');
    const [locationChoice, setLocationChoice] = useState<'current' | 'prefecture'>('current');

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
                const currentLocation = await getCurrentLocation(); // 検索時に現在地を取得
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
            setMapActive(true); 
        } catch (error) {
            console.error("Search error:", error);
            alert("飲食店の検索に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <label>検索方法を選択</label>
            <div className={styles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        value="current"
                        checked={locationChoice === 'current'}
                        onChange={() => setLocationChoice('current')}
                    />
                    現在地で検索
                </label>
                <label>
                    <input
                        type="radio"
                        value="prefecture"
                        checked={locationChoice === 'prefecture'}
                        onChange={() => setLocationChoice('prefecture')}
                    />
                    都道府県で検索
                </label>
            </div>
            {locationChoice === 'prefecture' && (
                <div className={styles.selectGroup}>
                    <label htmlFor="prefecture">都道府県を選択</label>
                    <select
                        id="prefecture"
                        onChange={(e) => setPrefecture(e.target.value)}
                        value={prefecture}
                    >
                        <option value="">都道府県を選択</option>
                        {prefectures.map((pref) => (
                            <option key={pref} value={pref}>
                                {pref}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className={styles.selectGroup}>
                <label htmlFor="category">カテゴリを選択</label>
                <select id="category" onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="">カテゴリを選択</option>
                    <option value="G001">居酒屋</option>
                    <option value="G002">ダイニングバー・バル</option>
                    <option value="G003">創作料理</option>
                    <option value="G004">和食</option>
                    <option value="G005">洋食</option>
                    <option value="G006">イタリアン・フレンチ</option>
                    <option value="G007">中華</option>
                    <option value="G008">焼肉・ホルモン</option>
                    <option value="G009">アジア・エスニック料理</option>
                    <option value="G010">各国料理</option>
                    <option value="G011">カラオケ・パーティ</option>
                    <option value="G012">バー・カクテル</option>
                    <option value="G013">ラーメン</option>
                    <option value="G014">カフェ・スイーツ</option>
                    <option value="G015">その他グルメ</option>
                    <option value="G016">お好み焼き・もんじゃ</option>
                    <option value="G017">韓国料理</option>
                </select>
            </div>
            <div className={styles.selectGroup}>
                <label htmlFor="range">範囲（km）</label>
                <select id="range" onChange={(e) => setRange(Number(e.target.value))} value={range}>
                    <option value={1}>300 m</option>
                    <option value={2}>500 m</option>
                    <option value={3}>1 km</option>
                    <option value={4}>2 km</option>
                    <option value={5}>3 km</option>
                </select>
            </div>
            <div className={styles.selectGroup}>
                <label htmlFor="count">件数を選択</label>
                <select id="count" onChange={(e) => setCount(Number(e.target.value))} value={count}>
                    <option value={10}>10件</option>
                    <option value={20}>20件</option>
                    <option value={30}>30件</option>
                </select>
            </div>
            <button onClick={handleSearch} disabled={isLoading} className={styles.button}>
                検索
            </button>
        </div>
    );
};

export default SearchForm;