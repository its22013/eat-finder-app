// src/app/Store_Search/api.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q') || ''; // 検索キーワードが無い場合、空文字列に設定
    const apikey = process.env.SEARCH_API_KEY; // あなたのホットペッパーAPIキー

    // パラメータの組み立て
    const params = new URLSearchParams({
        key: apikey || '', // APIキーがない場合、空文字列に設定
        keyword: keyword,
        format: 'json'
    });

    const url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`;

    // APIリクエストを送信
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
}
