// src/app/Store_Search/api.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q') || '';
    const wifi = searchParams.get('wifi') || '0';
    const privateRoom = searchParams.get('private_room') || '0';
    const lunch = searchParams.get('lunch') || '0'; // ランチ有無の取得
    const free_d = searchParams.get('free_d') || '0'; // ドリンク無料の取得
    const free_f = searchParams.get('free_f') || '0';
    const parking = searchParams.get('parking') || '0';
    const midnight = searchParams.get('midnight') || '0';
    const service_a = searchParams.get('service_area')
    const apikey = process.env.SEARCH_API_KEY;

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
        service_area: service_a || ''
    });

    const url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
}
