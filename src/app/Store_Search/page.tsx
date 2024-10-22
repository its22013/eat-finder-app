'use client';
import Footer from '../components/Footer';
import { useState } from 'react';
import styles from '../Store_Search/Search.module.css';

export default function StoreSearch() {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [wifi, setWifi] = useState(false); // Wi-Fi有無のチェックボックスの状態
    const [privateRoom, setPrivateRoom] = useState(false); // 個室有無のチェックボックスの状態
    const [isFilterOpen, setIsFilterOpen] = useState(false); // 絞り込みメニューの開閉状態
    const [lunch, setlunch] = useState(false);
    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen); // 絞り込みメニューの開閉を切り替え
    };

    const searchStore = async () => {
        setError(null); // 前回のエラーをクリア

        try {
            const params = new URLSearchParams({
                q: keyword,
                wifi: wifi ? '1' : '0', // Wi-Fiが有効なら1、無効なら0
                private_room: privateRoom ? '1' : '0', // 個室が有効なら1、無効なら0
            });

            const res = await fetch(`/api/hotpepper?${params.toString()}`);
            if (!res.ok) {
                throw new Error('Error fetching search results');
            }
            const data = await res.json();
            setResults(data.results.shop); // APIレスポンスに応じてデータを整形
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message); // エラーオブジェクトからメッセージを取得
            } else {
                setError('An unknown error occurred'); // 予期しないエラー
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchStore(); // Enterキーが押されたら検索を実行
        }
    };

    return (
        <div className={styles.text}>
            <h1>飲食店検索</h1>
            <input
                className={styles.holder}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="キーワードを入力"
            />

            {/* 絞り込みメニューのトグルボタン */}
            <button onClick={toggleFilterMenu} className={styles.filterButton}>
                絞り込み条件
            </button>

            {/* 絞り込みメニューの内容（開いたときに表示） */}
            {isFilterOpen && (
                <div className={styles.filterMenu}>
                    {/* Wi-Fi有無のチェックボックス */}
                    <label>
                        <input
                            type="checkbox"
                            checked={wifi}
                            onChange={(e) => setWifi(e.target.checked)}
                        />
                        Wi-Fi有り
                    </label>

                    {/* 個室有無のチェックボックス */}
                    <label>
                        <input
                            type="checkbox"
                            checked={privateRoom}
                            onChange={(e) => setPrivateRoom(e.target.checked)}
                        />
                        個室有り
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={lunch}
                            onChange={(e) => setlunch(e.target.checked)}
                        />
                        ランチ有り
                    </label>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button onClick={searchStore} className={styles.searchButton}>
                    検索
                </button>
            </div>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            <ul className={styles.searchResults}>
    {results.map((shop, index) => (
        <li key={index} className={styles.shopItem}>
            <h3>{shop.name}</h3>
            <div className={styles.imageAndAddressContainer}>
                {/* ロゴ画像 */}
                {shop.logo_image && (
                    <img
                        src={shop.logo_image}
                        alt={`${shop.name} logo`}
                        className={`${styles.shopImage} ${styles.shopLogo}`} // ロゴと写真を区別
                    />
                )}
                {/* 写真 */}
                {shop.photo?.pc?.l && (
                    <img
                        src={shop.photo.pc.l}
                        alt={`${shop.name} photo`}
                        className={styles.shopImage}
                    />
                )}
                {/* 住所と営業時間 */}
                <div>
                    <p className={styles.address}>{shop.address}</p>
                    <p className={styles.open}>営業時間: {shop.open}</p>
                </div>
            </div>
            <div className={styles.infoContainer}>
                <p className={styles.genre}>ジャンル: {shop.genre.name}</p>
            </div>
        </li>
    ))}
</ul>
            <Footer />
        </div>
    );
}
