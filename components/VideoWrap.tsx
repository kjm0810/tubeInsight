'use client';

import { formatKoreanDate } from "@/utils/common"
import { useMemo, useState } from "react"

export default function VideoWrap({videos}: {videos:any}) {

    const [filterType, setFilterType] = useState<number>(1);

    const filterList = [
        {
            name: '최신순',
            id: 1
        },
        {
            name: '오래된 순',
            id: 2
        },
        {
            name: '조회수 높은 순',
            id: 3
        },
        {
            name: '조회수 낮은 순',
            id: 4
        }
    ]

    const sortedVideos = useMemo(() => {
        if (!videos) return [];

        const arr = [...videos];

        switch (filterType) {
            case 1: // 최신순
                return arr.sort((a, b) =>
                    new Date(b.snippet.publishedAt).getTime() -
                    new Date(a.snippet.publishedAt).getTime()
                );

            case 2: // 오래된순
                return arr.sort((a, b) =>
                    new Date(a.snippet.publishedAt).getTime() -
                    new Date(b.snippet.publishedAt).getTime()
                );

            case 3: // 조회수 높은순
                return arr.sort((a, b) =>
                    Number(b.viewCount) - Number(a.viewCount)
                );

            case 4: // 조회수 낮은순
                return arr.sort((a, b) =>
                    Number(a.viewCount) - Number(b.viewCount)
                );

            default:
                return arr;
        }
    }, [videos, filterType]);


    return (
        <div className="container">
            <div className="filter-wrap">
                <div className="filter-head">
                    <div className="title">
                        영상 리스트
                    </div>
                    <div className="desc">
                        최근 2년 업로드 영상을 원하는 기준으로 정렬해 살펴볼 수 있습니다.
                    </div>
                </div>
                <div className="filter-list">
                    {
                        filterList.map((filter: any, index: any) => {
                            return (
                                <button type="button" key={`filter-key=${index}`} className={`filter-item ${filterType === filter.id ? 'on' : ''}`} onClick={() => {if (filterType !== filter.id) {setFilterType(filter.id)}}}>
                                    {filter.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            <div className="video-list">
                {
                    sortedVideos.map((item: any, index: number) => (
                        <div key={index} className="video-item">
                            <div className="left">
                                <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
                            </div>
                            <div className="right">
                                <div className="title">
                                    {item.snippet.title}
                                </div>
                                <div className="meta-row">
                                    <div className="viewer">
                                        조회수 {Number(item.viewCount).toLocaleString()}회
                                    </div>
                                    <div className="date">
                                        {formatKoreanDate(item.snippet.publishedAt)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
