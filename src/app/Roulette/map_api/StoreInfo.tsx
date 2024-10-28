import React from 'react';
import styles from './map.module.css';
import { RiMoneyCnyCircleFill } from 'react-icons/ri';

interface Store {
  name: string;
  address: string;
  phone: string;
  budget?: {
    code: string;
    name: string;
    average: string;
  };
  photo?: {
    mobile?: {
      l: string;
      s: string;
    };
  };
}

const StoreInfo: React.FC<{ store: Store }> = ({ store }) => {
  // Google Mapsリンク用のエンコードされた住所URLを生成
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;

  return (
    <div className={styles.store_info}>
      <div className={styles.images_conatiner}>
      {store.photo && (
        <img 
          src={store.photo.mobile?.s} 
          alt="店舗写真（モバイル用）" 
          className={styles.store_photo} 
        />
      )}
      
      </div>
      <div className={styles.text_container}>
        <strong>{store.name}</strong><br />
        {/* Google Maps リンクとして住所を表示 */}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className={styles.address_link}>
          {store.address}
        </a><br />
        <p className={styles.average_text}>
        <RiMoneyCnyCircleFill />{store.budget?.name}
        </p> <br />
      </div>
    </div>
  );
};

export default StoreInfo;