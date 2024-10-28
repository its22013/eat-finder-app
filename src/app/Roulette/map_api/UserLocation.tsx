import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

// カスタムアイコンの設定
const geolocationIcon = L.icon({
  iconUrl: '/images/current-location-icon.png', // アイコンの画像URL
  iconSize: [41, 41], // アイコンのサイズ
  iconAnchor: [12, 41], // アイコンの基準位置
});

interface UserLocationProps {
  position: LatLngExpression; // LatLngExpression型を使用して汎用的に
}

const UserLocation: React.FC<UserLocationProps> = ({ position }) => {
  if (!position) return null; // 位置が存在しない場合は何も表示しない

  return (
    <Marker position={position} icon={geolocationIcon}>
      <Popup>あなたの現在地</Popup>
    </Marker>
  );
};

export default UserLocation;