// src/app/Store_Search/api.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q') || ''; // 検索キーワードが無い場合、空文字列に設定
    const apikey = process.env.SEARCH_API_KEY; // あなたのホットペッパーAPIキー

    if (!apikey) {
        return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    // パラメータの組み立て
    const params = new URLSearchParams({
        key: apikey,
        keyword: keyword,
        format: 'json'
    });

    const url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`;

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

