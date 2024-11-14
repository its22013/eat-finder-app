import React from 'react';
import styles from './map.module.css';
import { RiMoneyCnyCircleFill } from 'react-icons/ri';
import { IoTimeOutline } from 'react-icons/io5';
import { IoMdHeart } from 'react-icons/io';

interface StoreInfoProps {
  store: Store;
  addToFavorites: () => void;
  isFavorite: boolean;
}

interface Store {
  name: string;
  address: string;
  phone: string;
  genre: string;
  url?: string;
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
  open: string;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store, addToFavorites, isFavorite }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
  const displayOpenHours = store.open.split('（')[0].trim();

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
        <div className={styles.Business_hours}>
          <IoTimeOutline />
          <h2>営業時間</h2>
        </div>
        <div className={styles.Business_text}>
          {displayOpenHours} 
        </div>
      </div>
    
      <div className={styles.text_container}>
        <h1 className={styles.Restauran_title}>{store.name}</h1><br />
        <h3 className={styles.genre_text}>#{store.genre}</h3> 
        <p className={styles.average_text}>
          <RiMoneyCnyCircleFill />{store.budget?.name}
        </p><br />
        
        <div className={styles.sub_container}>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className={styles.address_link}>
            マップで表示
          </a>
          <div 
            className={`${styles.heart_icon} ${isFavorite ? styles.favorited : ''}`} 
            onClick={addToFavorites}
          >
            <IoMdHeart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;