'use client';

import { useState } from 'react';

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

    return (
        <div>
            <h1>Store Search</h1>
            <input 
                type="text" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="Enter keyword"
            />
            <button onClick={searchStore}>Search</button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <ul>
                {results.map((shop, index) => (
                    <li key={index}>
                        <h3>{shop.name}</h3>
                        <p>{shop.address}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
