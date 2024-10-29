'use client';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import styles from '../Store_Search/Search.module.css';
import { prefectures } from '../Store_Search/areaCode';
import { TriangleUpIcon } from '@chakra-ui/icons'
export default function StoreSearch() {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState('');
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
    const [isAtTop, setIsAtTop] = useState(true); 
    const [currentPage, setCurrentPage] = useState(1);  
    const perPage = 20; 

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            // スクロール位置が 0 ならページトップにいると判定
            if (window.scrollY === 0) {
                setIsAtTop(true);
            } else {
                setIsAtTop(false);
            }
        };

        // スクロールイベントを監視
        window.addEventListener('scroll', handleScroll);

        // クリーンアップ関数でリスナーを削除
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const searchStore = async () => {
        setError(null);
        setHasSearched(true);

        if (!keyword) {
            setResults([]);
            setError('キーワードを入力してください');
            setHasSearched(false)
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
                midnight: midnight ? '1' : '0',
                service_area: selectedPrefecture
            });

            const res = await fetch(`/api/hotpepper?${params.toString()}`);
            if (!res.ok) {
                throw new Error('Error fetching search results');
            }
            const data = await res.json();
            setResults(data.results.shop || []);
            setCurrentPage(1);
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
    const scrolltop = () => { window.scrollTo( {top: 0, behavior: 'smooth'} )};


    const indexOfLastResult = currentPage * perPage;
    const indexOfFirstResult = indexOfLastResult - perPage;
    const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

    const totalPages = Math.ceil(results.length / perPage);

    // 次のページに移動
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            scrolltop(); // ページを変更するときにトップにスクロール
        }
    };

    // 前のページに戻る
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            scrolltop(); // ページを変更するときにトップにスクロール
        }
    };

    return (
        <div className={styles.text}>
            <h1>飲食店検索</h1>
            {/* 検索入力枠    interface ScrollToTopButtonProps {
        footerHeight     : number
        position         : ResponsiveValue<any>
      }
    const ScrollToTopButton = (props: ScrollToTopButtonProps) => {
        const handleClick = () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }; */}
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
            <select
                value={selectedPrefecture}
                onChange={(e) => setSelectedPrefecture(e.target.value)}
                className={styles.prefectureSelect}
            >
                <option value="">都道府県を選択</option>
                {prefectures.map((pref, index) => (
                    <option key={index} value={pref.code}>
                        {pref.name}
                    </option>
                ))}
            </select>
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
                {Array.isArray(currentResults) && currentResults.map((shop, index) => (
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
                                <p>平均予算: {shop.budget?.average && shop.budget.average !== '' ? shop.budget.average : '情報なし'}</p>

                            </div>
                        </div>
                        <div className={styles.infoContainer}>
                            <p className={styles.genre}>ジャンル: {shop.genre.name}</p>
                        </div>
                    </li>

                ))}

{totalPages > 1 && (
        <div className={styles.pagination}>
            <button onClick={prevPage} disabled={currentPage === 1}>
                前のページ
            </button>
            <span> {currentPage} / {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
                次のページ
            </button>
        </div>
    )}

                {hasSearched && !isAtTop && (
                <div className={styles.ScrollTop}>
                <a onClick={scrolltop}><TriangleUpIcon boxSize={34}/> </a>
                </div>
                    )}
            </ul>
            <Footer />
        </div>
    );
}
