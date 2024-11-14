"use client";

import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import Footer from '../../components/Footer';
import Header from './header/header';
import LoadingScreen from './LoadingScreen';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/app/hooks/firebase';
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const StoreInfo = dynamic(() => import('./StoreInfo'), { ssr: false });
const StoreMarkers = dynamic(() => import('./StoreMarkers'), { ssr: false });
const UserLocation = dynamic(() => import('./UserLocation'), { ssr: false });
const SearchButton = dynamic(() => import('./SearchButton'), { ssr: false });

interface Store {
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  open: string;
  genre: string;
  url?: string;
  photo?: {
    mobile?: {
      l: string;
      s: string;
    };
  };
  
}

const RestaurantMap: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favoriteStores, setFavoriteStores] = useState<Store[]>([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // ログインしているユーザーを設定
    });
    return () => unsubscribe();
  }, []);
  const addToFavorites = async (store: Store) => {
    if (!user) {
      alert('お気に入りに追加するにはログインしてください。');
      return;
    }
  
    try {
      // Check if the store is already in the user's favorites
      const favoriteRef = doc(collection(db, 'users', user.uid, 'favorites'), store.name);
      const favoriteDoc = await getDoc(favoriteRef);
  
      if (favoriteDoc.exists()) {
        alert('この店舗はすでにお気に入りに追加されています。');
        console.log('この店舗はすでにお気に入りです:', store.name);
        return;
      }
  
      // If not, add to favorites
      await setDoc(favoriteRef, {
        name: store.name,
        lat: store.lat,
        lng: store.lng,
        address: store.address,
        phone: store.phone,
        open: store.open,
        genre: store.genre,
        url: store.url,
        photoUrl: store.photo?.mobile?.l,
      });
      alert('お気に入りに追加しました！');
      console.log('お気に入りに追加しました:', store.name);
    } catch (error) {
      console.error('お気に入りの追加に失敗しました:', error);
      alert('お気に入りの追加に失敗しました。');
    }
  };  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // ログインしているユーザーを設定
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch the user's favorite stores
      const favoritesRef = collection(db, 'users', user.uid, 'favorites');
      const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
        const favorites = snapshot.docs.map(doc => doc.data()) as Store[];
        setFavoriteStores(favorites);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const isStoreFavorited = (store: Store): boolean => {
    return favoriteStores.some(fav => fav.name === store.name);
  };

  const [category, setCategory] = useState('飲食店');
  const [budget, setBudget] = useState('');
  const [range, setRange] = useState('');
  const [numResults, setNumResults] = useState('10');

  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([35.6895, 139.6917]); 
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightedStore, setHighlightedStore] = useState<Store | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [loadingStores, setLoadingStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  // searchParams がクライアント側でのみ使用されていることを確認します。
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    // ウィンドウチェックを使用してクライアント側にいることを確認する
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(params);
    }
  }, []);

  useEffect(() => {
  if (searchParams) {
    const queryCategory = searchParams.get('category') || '';
    const queryBudget = searchParams.get('budget') || '';
    const queryRange = searchParams.get('range') || '';
    const queryNumResults = searchParams.get('numResults') || '10';

    setCategory(queryCategory);
    setBudget(queryBudget);
    setRange(queryRange);
    setNumResults(queryNumResults);
  }
}, [searchParams]);

useEffect(() => {
  if (typeof window !== "undefined" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const currentPosition: LatLngExpression = [latitude, longitude];
        setPosition(currentPosition);
        setMapCenter(currentPosition); 
        handleSearch(latitude, longitude);
        setLoading(false); 
      },
      (error) => {
        setError(`現在地を取得できませんでした: ${error.message}`);
        setLoading(false);
      }
    );
  } else {
    setError('Geolocationがサポートされていません。');
    setLoading(false);
  }
}, [category, budget, range, numResults]);

const startSpin = () => {
  if (!stores.length) return;
  setIsSpinning(true);
  const spinInterval = setInterval(() => {
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    setHighlightedStore(randomStore);
  }, 100);

  setTimeout(() => {
    clearInterval(spinInterval);
    setIsSpinning(false);
  }, 3000);
};

const handleSearch = (latitude: number, longitude: number) => {
  let searchUrl = `/api/hotpepper_geolocation?lat=${latitude}&lng=${longitude}&numResults=${numResults}`;

  // URLパラメータがあればそれを追加
  if (category) searchUrl += `&genre=${category}`;
  if (budget) searchUrl += `&budget=${budget}`;
  if (range) searchUrl += `&range=${range}`; 

  const dummyStores = Array.from({ length: 5 }, () => ({
    name: 'ランダム飲食店',
    lat: latitude + (Math.random() - 0.5) * 0.01,
    lng: longitude + (Math.random() - 0.5) * 0.01,
    address: 'ランダム住所',
    phone: 'ランダム電話番号',
    open: '24時間営業',
    genre: 'ジャンル不明',
    url: 'https://dummyurl.com',
  }));
  setLoadingStores(dummyStores);

  fetch(searchUrl)
    .then(res => res.json())
    .then(data => {
      if (data.results?.shop) {
        const fetchedStores = data.results.shop.map((shop: any) => ({
          name: shop.name,
          lat: parseFloat(shop.lat),
          lng: parseFloat(shop.lng),
          address: shop.address || '住所不明',
          phone: shop.tel || '電話番号不明',
          genre: shop.genre?.name || 'ジャンル不明',
          open: shop.open,
          url: shop.urls?.pc || '',
          budget: shop.budget
                  ? {
                      code: shop.budget.code || '不明',
                      name: shop.budget.name || '不明',
                      average: shop.budget.average || '不明',
                    }
                  : undefined,
                photo: {
                  mobile: {
                    l: shop.photo.mobile.l || '',
                    s: shop.photo.mobile.s || '',
                  },     
                }
        }));
        setStores(fetchedStores);
        setHighlightedStore(fetchedStores[Math.floor(Math.random() * fetchedStores.length)]);
      } else {
        setError('飲食店が見つかりませんでした。');
      }
    })
    .catch(() => setError('データ取得中にエラーが発生しました。'))
    .finally(() => setLoadingStores([]));
};


  const getRadius = (range: string): number => {
    switch (range) {
      case '1':
        return 300; // 300m
      case '2':
        return 500; // 500m
      case '3':
        return 1000; // 1km
      case '4':
        return 1500; // 2km
      case '5':
        return 3000; // 3km
      default:
        return 1000; // デフォルトは1km
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        {highlightedStore && <StoreInfo 
              store={highlightedStore} 
              addToFavorites={() => addToFavorites(highlightedStore)}
              isFavorite={isStoreFavorited(highlightedStore)}
        />}
        {loading ? (
          <LoadingScreen />
        ) : (
          <Suspense fallback={<LoadingScreen />}>
            <MapContainer center={mapCenter} zoom={14.1} className={styles.map}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {position && (
                <>
                  <UserLocation position={position} />
                  <Circle center={position} radius={getRadius(range)} color="red" fillOpacity={0.2} />
                  {highlightedStore && (
                    <Circle center={[highlightedStore.lat, highlightedStore.lng]} radius={75} color="blue" fillOpacity={0.3} />
                  )}
                  <StoreMarkers stores={loadingStores.length > 0 ? loadingStores : stores} highlightedStore={highlightedStore} setHighlightedStore={setHighlightedStore} />
                </>
              )}
            </MapContainer>
          </Suspense>
        )}
        <SearchButton isSpinning={isSpinning} onClick={startSpin} />
        
        <div className={styles.storeCount}>
          <div className={styles.storeCount_text}>
          {stores.length > 0 ? `${stores.length}件` : ''}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantMap;