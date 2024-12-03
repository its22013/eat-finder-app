'use client'
import { useEffect, useState } from 'react';
import { db } from '../hooks/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Footer from '../components/Footer';
import styles from './history.module.css'; // CSSモジュールをインポート

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userId = user.uid;
                const historyCollectionRef = collection(db, `users/${userId}/history`);

                try {
                    // 新しい順にデータを取得
                    const historyQuery = query(historyCollectionRef, orderBy('createdAt', 'desc'));
                    const querySnapshot = await getDocs(historyQuery);
                    const historyData = querySnapshot.docs.map((doc) => doc.data());
                    setHistory(historyData);
                } catch (error) {
                    console.error('Error fetching history:', error);
                }
            } else {
                console.log('User is not authenticated');
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className={styles.main}>
            <h1 className={styles.h1style}>検索履歴</h1>
            <div className={styles.historyContainer}>
                {history.length === 0 ? (
                    <p>履歴はありません</p>
                ) : (
                    <div>
                        {history.map((shop, index) => (
                            <div className={styles.card} key={index}>
                                {shop.photo && (
                                    <img
                                        className={styles.image}
                                        src={shop.photo}
                                        alt={shop.name}
                                    />
                                )}
                                <div className={styles.details}>
                                    <div className={styles.title}>{shop.name}</div>
                                    <div className={styles.info}>住所: {shop.address}</div>
                                    <div className={styles.info}>営業時間: {shop.open}</div>
                                    <div className={styles.info}>予算: {shop.budget}</div>
                                    <div className={styles.info}>ジャンル: {shop.genre}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
