
'use client';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import styles from '../Store_Search/Search.module.css';
import { prefectures , area_range} from '../Store_Search/areaCode';
import { TriangleUpIcon, CloseIcon } from '@chakra-ui/icons';
import { useMediaQuery } from '@chakra-ui/react';
import dynamic from 'next/dynamic'; // dynamicインポートを追加
import { TiArrowRightThick, TiArrowLeftThick } from "react-icons/ti";
const MapView = dynamic(() => import('./MapView'), {
    ssr: false, // サーバーサイドレンダリングを無効にする
});
import  Modal from 'react-modal';
import { db, addDoc, collection } from '../hooks/firebase';
import { getAuth } from 'firebase/auth';

Modal.setAppElement('body');
export default function StoreSearch() {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState('');
    const [selectedRange, setSelectedRange] = useState('');
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
    const [lng, setLng] = useState<number | null>(null);
    const [lat, setLat] = useState<number | null>(null);
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [selectedShop, setSelectedShop] = useState<any>(null);
    const [modal, setModal] = useState(false);
    const perPage = 20; 
    const [currentLat, setCurrentLat] = useState<number | null>(null);
    const [currentLng, setCurrentLng] = useState<number | null>(null);
    const [isMobile] = useMediaQuery("(max-width: 768px)"); 
    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };
    const saveToHistory = async (shop: any) => { // shopを引数として受け取る
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user?.uid
        if (user) {
            try {
                // user.uid を使ってデータを保存
                await addDoc(collection(db, `users/${userId}/history`), {
                    userId: user.uid,
                    name: shop.name,  // shopオブジェクトのプロパティにアクセス
                    address: shop.address,
                    photo: shop.photo?.pc?.l || '',
                    open: shop.open,
                    budget: shop.budget?.average || '情報なし',
                    genre: shop.genre.name,
                    lat: shop.lat,
                    lng: shop.lng,
                    createdAt: new Date()
                });
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        } else {
            console.log("User is not authenticated");
        }
    };
    
    const openModal = (shop: any) => {
        setSelectedShop(shop); // 選択したショップの情報を設定
        saveToHistory(shop); // Firestoreに保存
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
        setSelectedShop(null); // モーダルを閉じたときにショップ情報をリセット
    };
    useEffect(() => {
        // `typeof window !== 'undefined'` でクライアントサイドであることを確認
        if (typeof window !== 'undefined') {
            const handleScroll = () => {
                if (window.scrollY === 0) {
                    setIsAtTop(true);
                } else {
                    setIsAtTop(false);
                }
            };
    
            window.addEventListener('scroll', handleScroll);
    
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);
        
    useEffect(() => {
        if (typeof window !== 'undefined' && useCurrentLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLat(latitude);
                    setLng(longitude);
                    setCurrentLat(latitude);
                    setCurrentLng(longitude);
                },
                (error) => {
                    console.error("位置情報の取得に失敗しました:", error);
                }
            );
        } else {
            setLat(null);
            setLng(null);
            setCurrentLat(null);
            setCurrentLng(null);
        }
    }, [useCurrentLocation]);

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
            const paramsObject: any = {
                q: keyword || '',
                wifi: wifi ? '1' : '0',
                private_room: privateRoom ? '1' : '0',
                lunch: lunch ? '1' : '0',
                free_drink: free_d ? '1' : '0',
                free_food: free_f ? '1' : '0',
                parking: parking ? '1' : '0',
                midnight: midnight ? '1' : '0',
                service_area: selectedPrefecture,
                lat: lat || '',
                lng: lng || '',
                range: selectedRange
            };


            const params = new URLSearchParams(paramsObject);

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
            <h1>キーワード検索</h1>
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
            {!useCurrentLocation && (
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
            )}
            {useCurrentLocation && (
                    <select
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                    >
                        <option value="">範囲を選択</option>
                        {area_range.map((range, index) => (
                            <option key={index} value={range.value}>
                                {range.key}
                            </option>
                        ))}
                    </select>
                )}
            </div>   

            {/* 絞り込みメニューの内容（開いたときに表示） */}
            {isFilterOpen && (
                                <div className={styles.filterMenu}>
                                <label><input type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} /> Wi-Fi有り</label>
                                <label><input type="checkbox" checked={privateRoom} onChange={(e) => setPrivateRoom(e.target.checked)} /> 個室有り</label>
                                <label><input type="checkbox" checked={lunch} onChange={(e) => setLunch(e.target.checked)} /> ランチ有り</label>
                                <label><input type="checkbox" checked={free_d} onChange={(e) => setFree_d(e.target.checked)} /> 飲み放題有り</label>
                                <label><input type="checkbox" checked={free_f} onChange={(e) => setfree_f(e.target.checked)} /> 食べ放題有り</label>
                                <label><input type="checkbox" checked={parking} onChange={(e) => setparking(e.target.checked)} /> 駐車場有り</label>
                                <label><input type="checkbox" checked={midnight} onChange={(e) => setmidnight(e.target.checked)} /> 23時以降も営業</label>
                                <label><input type="checkbox" checked={useCurrentLocation} onChange={(e) => setUseCurrentLocation(e.target.checked)} /> 現在地から検索する</label>
                            </div>
            )}
            
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            <ul className={styles.searchResults} >

                {Array.isArray(currentResults) && currentResults.map((shop, index) => (
                    <li key={index} className={styles.shopItem} onClick={() => openModal(shop)}>
                        <h3 className={styles.ShopName}>{shop.name}</h3>
                        <div className={styles.imageAndAddressContainer}>
                          
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
                                <p className={styles.ave}>平均予算: {shop.budget?.average && shop.budget.average !== '' ? shop.budget.average : '情報なし'}</p>

                            </div>
                        </div>
                        <div className={styles.infoContainer}>
                            <p className={styles.genre}>ジャンル: {shop.genre.name}</p>
                        </div>
                    </li>
                ))}
                   
                   {hasSearched && (
    <p>
        Powered by <a href="http://webservice.recruit.co.jp/" style={{ color: 'blue', textDecoration: 'underline' }}>ホットペッパーグルメ Webサービス</a>
    </p>
)}

{totalPages > 1 && (
    <div className={`${styles.pagination} ${isMobile ? styles.paginationMobile : ''}`}>
        <button className={styles.nbButton}onClick={prevPage} disabled={currentPage === 1}>
            <TiArrowLeftThick />
        </button>
        <span> {currentPage} / {totalPages}</span>
        <button className={styles.nbButton}onClick={nextPage} disabled={currentPage === totalPages}>
            < TiArrowRightThick />
        </button>
    </div>
)}


                {hasSearched && !isAtTop && (
                <div className={styles.ScrollTop}>
                <a onClick={scrolltop}><TriangleUpIcon boxSize={34}/> </a>
                </div>
                    )}
            </ul>
            <div>
            <Modal 
                isOpen={modal}
                onRequestClose={closeModal}
                contentLabel="Shop Details"
                style={{
                    content: {        top: '50%',  left: '50%',right: 'auto',bottom: 'auto',marginRight: '-50%',transform: 'translate(-50%, -50%)',width: isMobile ? '90%' : '1300px',  height: isMobile ? '80%' : '900px',},
                }}
            >
                {selectedShop && (
                    <div className={styles.MODAL}>
                        <button className={styles.closeB} onClick={closeModal}><CloseIcon boxSize={25}/></button>
                        <h2>{selectedShop.name}</h2>
                        <p>{selectedShop.address}</p>
                        {selectedShop.photo?.pc?.l && (
                                <img
                                    src={selectedShop.photo.pc.l}
                                    alt={`${selectedShop.name} photo`}
                                    className={styles.shopImage}
                                />
                            )}
                        <p>営業時間: {selectedShop.open}</p>
                        <p>料金備考: {selectedShop.budget_memo && selectedShop.budget_memo !== '' ? selectedShop.budget_memo : '情報なし'}</p>
                        <div className={styles.Map}>
                        <MapView 
                        lat={selectedShop.lat} 
                        lng={selectedShop.lng} 
                        shopName={selectedShop.name} 
                        shopAddress={selectedShop.address} 
                        currentLat={currentLat ?? 0}  // デフォルト値を設定
                        currentLng={currentLng ?? 0}  // デフォルト値を設定
                        />
                        </div>
                    </div>
                )}
            </Modal>
            </div>
            <Footer />
        </div>
    );
}