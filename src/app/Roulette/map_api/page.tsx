"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import StoreInfo from './StoreInfo';
import StoreMarkers from './StoreMarkers';
import UserLocation from './UserLocation';
import SearchButton from './SearchButton';
import Footer from '../../components/Footer';
import Header from './header/header';

// Map, TileLayer, Circle を動的にインポートして、サーバーサイドレンダリングを防止
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

// Store の情報型を定義
interface Store {
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
}

const RestaurantMap: React.FC = () => {
  // 現在地の位置、飲食店リスト、エラーメッセージ、ハイライトされた飲食店、スピン中の状態を管理
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightedStore, setHighlightedStore] = useState<Store | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  

  // 現在地取得と飲食店データの取得を行う useEffect フック
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]); // 現在地を position ステートに設定

          // API を使って周辺の飲食店データを取得
          fetch(`/api/hotpepper?q=飲食店&lat=${latitude}&lng=${longitude}`)
          .then(res => res.json())
          .then(data => {
            if (data.results?.shop) {
              // 飲食店データを取得し、必要な情報に整形して保存
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
                    pc: {
                      l: shop.photo.pc.l || '',
                      m: shop.photo.pc.m || '',
                      s: shop.photo.pc.s || '',
                    },
                    mobile: {
                      l: shop.photo.mobile.l || '',
                      s: shop.photo.mobile.s || '',
                    },
                  },
              }));
              setStores(fetchedStores);
              // ランダムな飲食店をハイライト表示
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

  // ランダムな飲食店を3秒間ハイライトするスピン機能
  const startSpin = () => {
    if (!stores.length) return;
    setIsSpinning(true);
    const spinInterval = setInterval(() => {
      const randomStore = stores[Math.floor(Math.random() * stores.length)];
      setHighlightedStore(randomStore);
    }, 100);

    // 3秒後にスピンを停止
    setTimeout(() => {
      clearInterval(spinInterval);
      setIsSpinning(false);
    }, 3000);
  };

  // エラーメッセージの表示
  if (error) return <p>{error}</p>;
  // 現在地取得中のメッセージ表示
  if (!position) return <p>現在地を取得中...</p>;

  return (
    <div>
      <Header />
    <div className={styles.container}>
      {/* ハイライトされた飲食店の情報を表示 */}
      {highlightedStore && <StoreInfo store={highlightedStore} />}

      {/* 地図コンテナと地図内のレイヤーやマーカー */}
      <MapContainer center={position} zoom={14.2} className={styles.map}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* 現在地を示すユーザーマーカー */}
        <UserLocation position={position} />
        
        {/* 現在地から半径1kmのサークル */}
        <Circle center={position} radius={1000} color="red" fillOpacity={0.2} />

        {/* ハイライトされた店舗の周りにサークル */}
        {highlightedStore && (
          <Circle center={[highlightedStore.lat, highlightedStore.lng]} radius={75} color="blue" fillOpacity={0.3} />
        )}
        
        {/* 飲食店のマーカー */}
        <StoreMarkers stores={stores} highlightedStore={highlightedStore} setHighlightedStore={setHighlightedStore} />
      </MapContainer>

      {/* スピンボタン */}
      <SearchButton isSpinning={isSpinning} onClick={startSpin} />
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantMap;