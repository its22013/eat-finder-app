import React from 'react';
import styles from './map.module.css';
import { RiMoneyCnyCircleFill } from 'react-icons/ri';
import { IoTimeOutline } from 'react-icons/io5';
import { IoMdHeart } from 'react-icons/io';


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
  open: string;
}

const StoreInfo: React.FC<{ store: Store }> = ({ store }) => {
  // Google Mapsリンク用のエンコードされた住所URLを生成
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
  // 営業時間から括弧以降のテキストを除外
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
        {/* 営業時間 */}
        <div className={styles.Business_hours}>
        <IoTimeOutline />
        <h2>営業時間</h2> 
        </div>
        <div className={styles.Business_text}>
        {displayOpenHours} 
        </div>
        {/* Google Maps リンクを「マップで表示」に変更 */}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className={styles.address_link}>
          マップで表示
        </a><br />
      </div>
    
      <div className={styles.text_container}>
        <h1 className={styles.Restauran_title}>{store.name}</h1><br />

        <p className={styles.average_text}>
          <RiMoneyCnyCircleFill />{store.budget?.name}
        </p><br />

          
        <div className={styles.sub_container}>
        <p>▶詳細はこちら</p>
        <div className={styles.heart_icon}>
        <IoMdHeart />
        </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;