'use client'

import { YouTubeSearchResponse } from "@/type";
import { formatKoreanDate } from "@/utils/common";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Search() {
    const [type, setType] = useState<string>('channel');
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const [searchData, setSearchData] = useState<YouTubeSearchResponse | null>(null);
    const [doSearchKeyword, setDoSearchKeyword] = useState<string>('');
    const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
    
    const getData = async () => {
        if (searchKeyword.trim() === '') {
            alert('유튜브 채널 명을 입력해주세요.');
            return null;
        }
        setIsResultLoading(true);
        setDoSearchKeyword(searchKeyword);
        const res = await fetch(
            `/api/ytb?searchKeyword=${searchKeyword}&type=${type}`,
            {
                next: { revalidate: 36000 }
            }
        );
        const data = await res.json();

        setIsResultLoading(false);
        setSearchData(data);
    }

    const keyDownEventHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await getData();
        }
    }
    
    return (
        <div className="search-wrap">
            <div className="search-box">
                <h1 className="site-title">
                    Tube Insight
                </h1>
                <div className="inner">
                    <input type="text" value={searchKeyword} onChange={(e)=>{setSearchKeyword(e.target.value)}} onKeyDown={keyDownEventHandler} placeholder="유튜브 채널 명을 입력해주세요." />
                    <button type="button" onClick={getData}>검색</button>
                </div>
            </div>
            
            <div className="result-wrap">
                {
                    doSearchKeyword !== '' &&
                    <div className="searchDo">
                        {`"${doSearchKeyword}"`}의 채널 검색 결과입니다.
                    </div>
                }
                <div className="result">
                    {
                        isResultLoading ? 
                        <div className="result-loading">
                            <svg width="120" height="120" viewBox="0 0 50 50">
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="#000"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="31.4 31.4"
                                transform="rotate(-90 25 25)"
                            >
                                <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 25 25"
                                to="360 25 25"
                                dur="1s"
                                repeatCount="indefinite"
                                />
                            </circle>
                            </svg>
                            <span className="text">
                                채널 목록을 가져오는 중입니다.
                            </span>
                        </div>:
                        ( searchData && searchData?.items?.length > 0) ?
                        searchData?.items.map((item: any, index: number) => {
                            return (
                                <Link href={`/channel/${item.snippet.channelId}`} key={`youtube-item-${index}`} className="search-item">
                                    <div className="left">
                                        <img src={item.snippet.thumbnails.default.url} alt={item.snippet.title} />
                                    </div>
                                    <div className="right">
                                        <div className="title">
                                            { item.snippet.channelTitle }
                                        </div>
                                        <div className="date">
                                            { formatKoreanDate(item.snippet.publishedAt) }
                                        </div>
                                    </div>
                                </Link>
                            )
                        }):
                        <div className="no-data">
                            검색된 채널이 없습니다.
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}