// URL構築関数をユーティリティ関数として切り出し
export const buildRequestUrl = (
    lat: number | null,
    lng: number | null,
    keyword?: string,
    genre?: string,
    range: string = "3",
    prefecture?: string,
    count: string = "10"
  ): string => {
    const apiKey = process.env.SEARCH_API_KEY;
    if (!apiKey) {
      throw new Error("SEARCH_API_KEY is not defined in environment variables.");
    }
  
    const baseUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
    const params = new URLSearchParams({
      key: apiKey,
      format: "json",
      range,
      count,
    });
  
    // パラメータを追加
    if (lat !== null && lng !== null) {
      params.append("lat", lat.toString());
      params.append("lng", lng.toString());
    }
  
    if (prefecture?.trim()) {
      params.append("keyword", prefecture.trim());
    } else if (keyword?.trim()) {
      params.append("keyword", keyword.trim());
    }
  
    if (genre?.trim()) {
      params.append("genre", encodeURIComponent(genre));
    }
  
    return `${baseUrl}?${params.toString()}`;
  };
  