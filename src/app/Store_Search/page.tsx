'use client';
import Footer from '../components/Footer';
import { useState } from 'react';
import styles from '../Store_Search/Search.module.css'


export default function StoreSearch() {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const searchStore = async () => {
        setError(null); // 前回のエラーをクリア

        try {
            const res = await fetch(`/api/hotpepper?q=${encodeURIComponent(keyword)}`);
            if (!res.ok) {
                throw new Error('Error fetching search results');
            }
            const data = await res.json();
            setResults(data.results.shop); // APIレスポンスに応じてデータを整形
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message); // エラーオブジェクトからメッセージを取得
            } else {
                setError('An unknown error occurred'); // 予期しないエラー
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchStore(); // Enterキーが押されたら検索を実行
        }
    };

    return (
        <div className={styles.text}>
            <h1>飲食店検索</h1>
            <input className={styles.holder}
                type="text" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder="キーワードを入力"
            />

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <ul className={styles.searchResults}>
                {results.map((shop, index) => (
                    <li key={index} className={styles.shopItem}>
                        <h3>{shop.name}</h3>
                        <p>{shop.address}</p>
                        <p>{shop.genre.name}</p>
                        {shop.logo_image && (
                            <img src={shop.logo_image} alt={`${shop.name} logo`} />
                        )}
                    </li>
                ))}
            </ul>
            <Footer />
        </div>
    );
}
