// src/app/api/hotpper/route.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q') || '飲食店'; // デフォルトの検索キーワード
    const lat = searchParams.get('lat') || '26.21079'; // デフォルト緯度
    const lng = searchParams.get('lng') || '127.68614'; // デフォルト経度
    const apikey = process.env.SEARCH_API_KEY; // あなたのホットペッパーAPIキー
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
        key: apikey,
        lat: lat,
        lng: lng,
        range: '3', // 半径3km内を検索
        format: 'json'
        key: apikey || '',
        keyword: keyword,
        wifi: wifi,
        private_room: privateRoom,
        format: 'json',
        count: '50', // 取得件数を50に設定
        lunch: lunch,
        free_drink: free_d,
        free_food: free_f,
        parking: parking,
        midnight: midnight,
        service_area: service_a || ''
    });

    const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`;

    const res = await fetch(url);
    const data = await res.json();

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
    return NextResponse.json(data);
}
