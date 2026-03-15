export function formatKoreanDate(date: string) {
    const d = new Date(date);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${yyyy}년 ${mm}월 ${dd}일`;
}

export function getMonthlyUploads(videos: any[]) {
    const map: Record<string, number> = {};

    videos.forEach((v) => {
        const date = new Date(v.snippet.publishedAt);

        const key =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0");

        map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map)
        .map(([month, count]) => ({
            month,
            업로드수: count
        }))
        .sort((a, b) => a.month.localeCompare(b.month)); // 핵심

}

export function getMonthlyViews(videos: any[]) {
    const map: Record<string, number> = {};

    videos.forEach((v) => {
        const date = new Date(v.snippet.publishedAt);

        const key =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0");

        const views = Number(v.viewCount);

        map[key] = (map[key] || 0) + views;
    });

    return Object.entries(map)
        .map(([month, views]) => ({
            month,
            조회수: views
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

export function getTotalViews(videos: any[]) {
    return videos.reduce((sum, v) => {
        return sum + Number(v.viewCount);
    }, 0);
}