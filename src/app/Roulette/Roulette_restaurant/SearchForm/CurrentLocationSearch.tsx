import { useState } from "react";
import styles from "../style/SearchForm.module.css";

interface CurrentLocationSearchProps {
    handleSearch: (lat: number, lng: number, category: string, range: number, count: number) => void;
    isLoading: boolean;
    setCategory: (category: string) => void;
    setRange: (range: number) => void;
    setCount: (count: number) => void;
    category: string;
    range: number;
    count: number;
}

const CurrentLocationSearch = ({
    handleSearch,
    isLoading,
    setCategory,
    setRange,
    setCount,
    category,
    range,
    count,
}: CurrentLocationSearchProps) => {
    return (
        <div>
            <div className={styles.selectGroup}>
                <label htmlFor="category">カテゴリを選択</label>
                <select
                    id="category"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    className={styles.label_container}
                >
                    <option value="">全選択</option>
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
                    <option value="G015">その他・グルメ</option>
                    <option value="G016">お好み焼き・もんじゃ</option>
                    <option value="G017">韓国料理</option>
                </select>
            </div>
            <div className={styles.selectGroup}>
                <label htmlFor="range">範囲</label>
                <select
                    id="range"
                    onChange={(e) => setRange(Number(e.target.value))}
                    value={range}
                    className={styles.label_container}
                >
                    <option value={1}>300 m</option>
                    <option value={2}>500 m</option>
                    <option value={3}>1 km</option>
                    <option value={4}>2 km</option>
                    <option value={5}>3 km</option>
                </select>
            </div>
            <div className={styles.selectGroup}>
                <label htmlFor="count">表示件数</label>
                <select
                    id="count"
                    onChange={(e) => setCount(Number(e.target.value))}
                    value={count}
                    className={styles.label_container}
                >
                    <option value={10}>10件</option>
                    <option value={20}>20件</option>
                    <option value={30}>30件</option>
                    <option value={40}>40件</option>
                    <option value={50}>50件</option>
                </select>
            </div>

            <button
                onClick={() => handleSearch(26.1564543, 127.6600793, category, range, count)}
                disabled={isLoading}
                className={styles.search_button}
            >
                {isLoading ? "検索中..." : "検索"}
            </button>
        </div>
    );
};

export default CurrentLocationSearch;
