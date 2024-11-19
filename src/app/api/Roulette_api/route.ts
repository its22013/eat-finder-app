import { NextRequest, NextResponse } from "next/server";
import { buildRequestUrl } from "./buildRequestUrl";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // クエリパラメータを取得
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const keyword = searchParams.get("keyword");
    const genre = searchParams.get("genre");
    const range = searchParams.get("range") || "3";
    const prefecture = searchParams.get("prefecture");
    const count = searchParams.get("count") || "10";

    let latNumber: number | null = null;
    let lngNumber: number | null = null;

    if (lat && lng) {
      latNumber = parseFloat(lat);
      lngNumber = parseFloat(lng);

      if (isNaN(latNumber) || isNaN(lngNumber)) {
        return NextResponse.json(
          { error: "Invalid latitude or longitude" },
          { status: 400 }
        );
      }
    } else if (!prefecture?.trim() && !keyword?.trim() && !genre?.trim()) {
      return NextResponse.json(
        { error: "At least one of lat/lng, prefecture, keyword, or genre is required." },
        { status: 400 }
      );
    }

    // リクエストURLを構築
    const url = buildRequestUrl(
      latNumber,
      lngNumber,
      keyword || "",
      genre || "",
      range,
      prefecture || "",
      count
    );

    console.log("Constructed URL:", url);

    // 外部API呼び出し
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("External API error:", response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch data from the external API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 結果の検証
    if (!data || !data.results) {
      return NextResponse.json(
        { error: "No results found or invalid response structure" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error handling request:", error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}