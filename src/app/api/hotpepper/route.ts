// src/app/api/hotpper/route.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q') || '飲食店'; // デフォルトの検索キーワード
    const lat = searchParams.get('lat') || '26.21079'; // デフォルト緯度
    const lng = searchParams.get('lng') || '127.68614'; // デフォルト経度
    const apikey = process.env.SEARCH_API_KEY; // あなたのホットペッパーAPIキー

    if (!apikey) {
        return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    // パラメータの組み立て
    const params = new URLSearchParams({
        key: apikey,
        lat: lat,
        lng: lng,
        range: '3', // 半径3km内を検索
        format: 'json'
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