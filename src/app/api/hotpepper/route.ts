// src/app/api/hotpper/route.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q') || '飲食店'; // デフォルトの検索キーワード
    const lat = searchParams.get('lat') || '26.21079'; // デフォルト緯度
    const lng = searchParams.get('lng') || '127.68614'; // デフォルト経度
    const wifi = searchParams.get('wifi') || '0';
    const privateRoom = searchParams.get('private_room') || '0';
    const lunch = searchParams.get('lunch') || '0'; // ランチ有無の取得
    const free_d = searchParams.get('free_d') || '0'; // ドリンク無料の取得
    const free_f = searchParams.get('free_f') || '0';
    const parking = searchParams.get('parking') || '0';
    const midnight = searchParams.get('midnight') || '0';
    const service_a = searchParams.get('service_area')
    const apikey = process.env.SEARCH_API_KEY;
    if (!apikey) {
        return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    // パラメータの組み立て
    const params = new URLSearchParams({

        key: apikey || '',
        keyword: keyword,
        wifi: wifi,
        private_room: privateRoom,
        format: 'json',
        count: '100', // 取得件数を50に設定
        lunch: lunch,
        free_drink: free_d,
        free_food: free_f,
        parking: parking,
        midnight: midnight,
        service_area: service_a || '',
        lat: lat,
        lng: lng,
        range: '3', // 半径3km内を検索

    });

    const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`;

    try {
        // APIリクエストを送信
        const res = await fetch(url);

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch data from HotPepper API' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}