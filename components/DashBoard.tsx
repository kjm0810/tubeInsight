'use client'

import { formatKoreanDate, getMonthlyUploads, getMonthlyViews, getTotalViews } from "@/utils/common";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

export default function DashBoard({videos, channelInfo, isMaxOver}: {videos: any, channelInfo: any, isMaxOver: boolean}) {
    const monthlyViews = getMonthlyViews(videos);
    const monthlyData = getMonthlyUploads(videos);

    return (
        <div className="dashboard">
            {
                isMaxOver &&
                <div className="isMaxOver">
                    업로드한 영상이 많아 최근 2년 기준 최대 2,000개까지만 분석됩니다.
                </div>
            }
            <div className="item large channel-card">
                <div className="channel-info">
                    <div className="left">
                        <div className="img">
                            <img src={channelInfo?.items[0].snippet.thumbnails.default.url} alt="" />
                        </div>
                        <div className="channel-name">
                            {channelInfo?.items[0].snippet.title}
                        </div>
                    </div>
                    <div className="right">
                        <div className="info-item">
                            <div className="key">
                                채널 개설일
                            </div>
                            <div className="value">
                                {formatKoreanDate(channelInfo?.items[0].snippet.publishedAt)}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="key">
                                구독자 수
                            </div>
                            <div className="value">
                                {Number(channelInfo?.items[0].statistics.subscriberCount).toLocaleString()}명
                            </div>
                        </div>
                        
                    </div>
                </div>
                {/* {JSON.stringify(channelInfo.items[0].snippet.publishedAt)} */}

            </div>
            <div className="item medium stat-card">
                <div className="title">
                    총 조회수 (2년)
                </div>
                <div className="value">
                    {getTotalViews(videos).toLocaleString()}회
                    {/* {Number(channelInfo.items[0].statistics.viewCount).toLocaleString()}회 */}
                </div>
            </div>
            <div className="item medium stat-card">
                <div className="title">
                    업로드 수 (2년)
                </div>
                <div className="value">
                    {Number(videos?.length).toLocaleString()}개 {isMaxOver && '+'}
                </div>
            </div>
            <div className="item medium stat-card">
                <div className="title">
                    월 평균 업로드 수 (2년)
                </div>
                <div className="value">
                    {Math.round(Number(videos?.length / 24)).toLocaleString()}개
                </div>
            </div>
            <div className="item medium stat-card">
                <div className="title">
                    월 평균 조회 수 (2년)
                </div>
                <div className="value">
                    {Math.round(Number(getTotalViews(videos) / 24)).toLocaleString()}개
                </div>
            </div>
            <div className="item large chart-card">
                <div className="title">
                    월별 업로드 추이 
                </div>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                    <defs>
                        <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f57f4a" />
                            <stop offset="100%" stopColor="#dd4d1f" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                    dataKey="업로드수"
                    fill="url(#uploadGradient)"
                    radius={[8, 8, 0, 0]}
                    />
                </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="item large chart-card">
                <div className="title">
                    월별 조회수 추이 
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyViews}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis width={80}/>
                        <Tooltip />
                        <Line
                        type="monotone"
                        dataKey="조회수"
                        stroke="#ff0000"
                        strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
