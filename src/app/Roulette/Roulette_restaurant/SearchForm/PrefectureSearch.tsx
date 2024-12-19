import styles from "../style/SearchForm.module.css";

interface PrefectureSearchProps {
    prefectures: string[];
    prefecture: string;
    category: string;
    count: number;
    setPrefecture: (prefecture: string) => void;
    setCategory: (category: string) => void;
    setCount: (count: number) => void;
    handleSearch: (prefecture: string, category: string, count: number) => void;
    isLoading: boolean;
}

const PrefectureSearch = ({
    prefectures,
    prefecture,
    category,
    count,
    setPrefecture,
    setCategory,
    setCount,
    handleSearch,
    isLoading,
}: PrefectureSearchProps) => {
    return (
        <div>
            <div className={styles.selectGroup}>
                <label htmlFor="prefecture">都道府県を選択</label>
                <select
                    id="prefecture"
                    onChange={(e) => setPrefecture(e.target.value)}
                    value={prefecture}
                    className={styles.label_container}
                >
                    <option value="">都道府県を選択</option>
                    {prefectures.map((pref) => (
                        <option key={pref} value={pref}>
                            {pref}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.selectGroup}>
                <label htmlFor="category">カテゴリを選択</label>
                <select
                    id="category"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    className={styles.label_container}
                >
                    <option value="">全選択</option>
                    <option value="G001">居酒屋</option>
                    <option value="G002">ダイニングバー・バル</option>
                    <option value="G003">創作料理</option>
                    <option value="G004">和食</option>
                    <option value="G005">洋食</option>
                    <option value="G006">イタリアン・フレンチ</option>
                    <option value="G007">中華</option>
                    <option value="G008">焼肉・ホルモン</option>
                    <option value="G009">アジア・エスニック料理</option>
                    <option value="G010">各国料理</option>
                    <option value="G011">カラオケ・パーティ</option>
                    <option value="G012">バー・カクテル</option>
                    <option value="G013">ラーメン</option>
                    <option value="G014">カフェ・スイーツ</option>
                    <option value="G015">その他・グルメ</option>
                    <option value="G016">お好み焼き・もんじゃ</option>
                    <option value="G017">韓国料理</option>
                </select>
            </div>
            <div className={styles.selectGroup}>
                <label htmlFor="count">表示件数</label>
                <select
                    id="count"
                    onChange={(e) => setCount(Number(e.target.value))}
                    value={count}
                    className={styles.label_container}
                >
                    <option value={10}>10件</option>
                    <option value={20}>20件</option>
                    <option value={30}>30件</option>
                    <option value={40}>40件</option>
                    <option value={50}>50件</option>
                </select>
            </div>

            <button
                onClick={() => handleSearch(prefecture, category, count)}
                disabled={isLoading}
                className={styles.search_button}
            >
                {isLoading ? "検索中..." : "検索"}
            </button>
        </div>
    );
};

export default PrefectureSearch;