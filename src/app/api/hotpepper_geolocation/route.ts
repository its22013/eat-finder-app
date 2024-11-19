import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('q') || '';  // デフォルトは空文字
  const lat = searchParams.get('lat') || '26.21079';
  const lng = searchParams.get('lng') || '127.68614';
  const budget = searchParams.get('budget');
  const numResults = searchParams.get('numResults') || '10';  // フロントエンドからの値を受け取る
  const categoryName = searchParams.get('genre');  // カテゴリ名（例: 中華）
  let range = searchParams.get('range') || '3';  // 範囲をフロントエンドから受け取る。デフォルトは「3」
  const apikey = process.env.SEARCH_API_KEY;

  if (!apikey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  const params: any = {
    key: apikey,
    lat: lat,
    lng: lng,
    range: range,  // 範囲をフロントエンドから受け取る
    format: 'json',
    count: numResults,  // 取得件数
  };

  // 範囲
  const radiusMap: { [key: string]: number } = {
    "1": 300,    // 300m
    "2": 500,    // 500m
    "3": 1000,   // 1000m (デフォルト)
    "4": 2000,   // 2000m
    "5": 3000    // 3000m
  };

  // 範囲が「null」ならデフォルト値に置き換え
  if (range && radiusMap[range]) {
    range = radiusMap[range].toString();
  }

  // カテゴリ名からカテゴリIDに変換するマッピング（例）
  const categoryMap: { [key: string]: string } = {
    '居酒屋': 'G001',
    'ダイニングバー・バル': 'G002',
    '創作料理': 'G003',
    '和食': 'G004',
    '洋食': 'G005',
    'イタリアン・フレンチ': 'G006',
    '中華': 'G007',
    '焼肉・ホルモン': 'G008',
    'アジア・エスニック料理': 'G009',
    '各国料理': 'G010',
    'カラオケ・パーティ': 'G011',
    'バー・カクテル': 'G012',
    'ラーメン': 'G013',
    'カフェ・スイーツ': 'G014',
    'その他グルメ': 'G015',
    'お好み焼き・もんじゃ': 'G016',
    '韓国料理': 'G017',
  };

  // カテゴリ名があれば、対応するカテゴリIDをparamsに追加
  if (categoryName && categoryMap[categoryName]) {
    params.genre = categoryMap[categoryName];  // genreにカテゴリIDを設定
  }

  // keywordがある場合、paramsに追加
  if (keyword) {
    params.q = keyword;
  }

  // 予算フィルタがある場合、追加
  if (budget && budget !== 'all') {
    params.budget = budget;
  }

  const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${new URLSearchParams(params).toString()}`;
  
  console.log('API Request URL:', url);  

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.results) {
      throw new Error('Invalid API response data');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
