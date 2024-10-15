// src/app/Store_Search/api.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q');
    const apikey = process.env.SEARCH_API_KEY; // あなたのホットペッパーAPIキー

    const url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apikey}&keyword=${encodeURIComponent(keyword || '')}&format=json`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
}
