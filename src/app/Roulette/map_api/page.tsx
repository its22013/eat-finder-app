"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import Footer from '../../components/Footer';
import Header from './header/header';

// Dynamically import components with SSR disabled
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
}

const RestaurantMap: React.FC = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightedStore, setHighlightedStore] = useState<Store | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);

          fetch(`/api/hotpepper_geolocation?q=飲食店&lat=${latitude}&lng=${longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data.results?.shop) {
                const fetchedStores = data.results.shop.map((shop: any) => ({
                  name: shop.name,
                  lat: parseFloat(shop.lat),
                  lng: parseFloat(shop.lng),
                  address: shop.address || '住所不明',
                  phone: shop.tel || '電話番号不明',
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
                  },
                  open: shop.open
                }));
                setStores(fetchedStores);
                setHighlightedStore(fetchedStores[Math.floor(Math.random() * fetchedStores.length)]);
              } else {
                setError('飲食店が見つかりませんでした。');
              }
            })
            .catch(() => setError('データ取得中にエラーが発生しました。'));
        },
        (error) => setError('現在地を取得できませんでした。' + error.message)
      );
    } else {
      setError('Geolocationはサポートされていません。');
    }
  }, []);

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

  if (error) return <p>{error}</p>;
  if (!position) return <p>現在地を取得中...</p>;

  return (
    <div>
      <Header />
      <div className={styles.container}>
        {highlightedStore && <StoreInfo store={highlightedStore} />}
        <MapContainer center={position} zoom={14.2} className={styles.map}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <UserLocation position={position} />
          <Circle center={position} radius={1000} color="red" fillOpacity={0.2} />
          {highlightedStore && (
            <Circle center={[highlightedStore.lat, highlightedStore.lng]} radius={75} color="blue" fillOpacity={0.3} />
          )}
          <StoreMarkers stores={stores} highlightedStore={highlightedStore} setHighlightedStore={setHighlightedStore} />
        </MapContainer>
        <SearchButton isSpinning={isSpinning} onClick={startSpin} />
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantMap;