'use client';
import Footer from '../components/Footer';
import { useState } from 'react';
import styles from '../Store_Search/Search.module.css';

export default function StoreSearch() {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [wifi, setWifi] = useState(false);
    const [privateRoom, setPrivateRoom] = useState(false);
    const [lunch, setLunch] = useState(false);
    const [free_d, setFree_d] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [free_f, setfree_f] = useState(false);
    const [parking, setparking] = useState(false);
    const[midnight, setmidnight] = useState(false)
    const [hasSearched, setHasSearched] = useState(false);
    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const searchStore = async () => {
        setError(null);
        setHasSearched(true);

        if (!keyword) {
            setResults([]);
            setError('キーワードを入力してください');
            return;
        }

        try {
            const params = new URLSearchParams({
                q: keyword,
                wifi: wifi ? '1' : '0',
                private_room: privateRoom ? '1' : '0',
                lunch: lunch ? '1' : '0',
                free_drink: free_d ? '1' : '0',
                free_food: free_f ? '1' : '0',
                parking: parking ? '1' : '0',
                midnight: midnight ? '1' : '0'
            });

            const res = await fetch(`/api/hotpepper?${params.toString()}`);
            if (!res.ok) {
                throw new Error('Error fetching search results');
            }
            const data = await res.json();
            setResults(data.results.shop || []);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setResults([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchStore();
        }
    };

    return (
        <div className={styles.text}>
            <h1>飲食店検索</h1>
            {/* 検索入力枠 */}
            <input
                className={styles.holder}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="キーワードを入力"
            />
            <div className={styles.buttonContainer}>
            {/* 絞り込み条件ボタンを検索枠の下に配置 */}
            <button onClick={toggleFilterMenu} className={styles.filterButton}>
                絞り込み条件
            </button>
            <button onClick={searchStore} className={styles.searchButton}>
                    検索
            </button>
            </div>   

            {/* 絞り込みメニューの内容（開いたときに表示） */}
            {isFilterOpen && (
                <div className={styles.filterMenu}>
                    <label>
                        <input
                            type="checkbox"
                            checked={wifi}
                            onChange={(e) => setWifi(e.target.checked)}
                        />
                        Wi-Fi有り
                    </label>

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
                            onChange={(e) => setLunch(e.target.checked)}
                        />
                        ランチ有り
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={free_d}
                            onChange={(e) => setFree_d(e.target.checked)}
                        />
                        飲み放題有り
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={free_f}
                            onChange={(e) => setfree_f(e.target.checked)}
                        />
                        食べ放題有り
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={parking}
                            onChange={(e) => setparking(e.target.checked)}
                        />
                        駐車場有り
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={midnight}
                            onChange={(e) => setmidnight(e.target.checked)}
                        />
                        23時以降も営業
                    </label>

                    
                </div>
            )}
            
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            <ul className={styles.searchResults}>
                {Array.isArray(results) && results.map((shop, index) => (
                    <li key={index} className={styles.shopItem}>
                        <h3>{shop.name}</h3>
                        <div className={styles.imageAndAddressContainer}>
                            {shop.logo_image && (
                                <img
                                    src={shop.logo_image}
                                    alt={`${shop.name} logo`}
                                    className={`${styles.shopImage} ${styles.shopLogo}`}
                                />
                            )}
                            {shop.photo?.pc?.l && (
                                <img
                                    src={shop.photo.pc.l}
                                    alt={`${shop.name} photo`}
                                    className={styles.shopImage}
                                />
                            )}
                            <div className={styles.jouho}>
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
