// src/app/Store_Search/api.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q') || '';
    
    // Wi-Fiと個室のパラメータを取得
    const wifi = searchParams.get('wifi') === '1' ? '1' : '0'; // チェックされていれば1、そうでなければ0
    const privateRoom = searchParams.get('private_room') === '1' ? '1' : '0'; // 同上
    const lunch = searchParams.get('lunch') == '1' ? '1' : '0';
    const apikey = process.env.SEARCH_API_KEY;

    const params = new URLSearchParams({
        key: apikey || '',
        keyword: keyword,
        wifi: wifi,
        private_room: privateRoom,
        format: 'json',
        count: '50', // 取得件数を50に設定
        lunch: lunch
    });

    const url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
}
