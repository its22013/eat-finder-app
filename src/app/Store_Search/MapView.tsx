import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { icon } from 'leaflet'
import styles from './Search.module.css'
// Propsの型を定義
interface MapViewProps {
  lat: number; // 緯度
  lng: number; // 経度
  shopName: string; // 店名
  shopAddress: string; // 店の住所
  currentLat: number; // 現在地の緯度
  currentLng: number; // 現在地の経度
}
const customIcon = L.icon({
  iconUrl: '/images/makar01.png',
  iconSize: [70, 50],
  iconAnchor: [32, 47],
});
const MapView: React.FC<MapViewProps> = ({ lat, lng, shopName, shopAddress, currentLat, currentLng}) => {
  return (
    <MapContainer center={[lat, lng]} zoom={20} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]} icon={customIcon} >
        <Popup>
          <strong>{shopName}</strong><br />
          {shopAddress}
        </Popup>
      </Marker>
      {currentLat && currentLng && (
                <Marker position={[currentLat, currentLng]} >
                    <Popup>
                        現在地
                    </Popup>
                </Marker>
      )};
    </MapContainer>
  );
};

export default MapView;
