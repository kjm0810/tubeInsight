import DashBoard from "@/components/DashBoard";
import VideoWrap from "@/components/VideoWrap";
import { formatKoreanDate } from "@/utils/common";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  let isMaxOver = false;
  const { id } = await params;

  const API_KEY = process.env.YOUTUBE_API_KEY;

  // 1. 채널 정보 가져오기
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${id}&key=${API_KEY}`,
    {
        next: { revalidate: 36000 }
    }
  );

  const channelData = await channelRes.json();

  const channelInfoRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${API_KEY}`,
    {
      next: { revalidate: 36000 }
    }
  )
  const channelInfo = await channelInfoRes.json();

  if (!channelData?.items?.length) {
    return <div className="no-data" style={{marginTop: '50px'}}>채널을 찾을 수 없습니다.</div>;
  }

  const playlistId =
    channelData.items[0].contentDetails.relatedPlaylists.uploads;

  // 2. 최근 2년 날짜
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  let videos: any[] = [];
  let nextPageToken = "";

  while (true) {

    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`, {
        next: { revalidate: 3600 }
      }
    );

    const videoData = await videoRes.json();

    if (!videoData?.items?.length) break;

    const filtered = videoData.items.filter((item: any) => {
      const date = new Date(item.snippet.publishedAt);
      return date >= twoYearsAgo;
    });

    // videoId 목록
    const ids = filtered
      .map((v: any) => v.snippet.resourceId.videoId)
      .join(",");

    // 조회수 가져오기
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${API_KEY}`,
      {
        next: { revalidate: 3600 }
      }
    );

    const statsData = await statsRes.json();

    // 조회수 합치기
    const merged = filtered.map((video: any) => {

      const videoId = video.snippet.resourceId.videoId;

      const stat = statsData.items?.find((s: any) => s.id === videoId);

      return {
        ...video,
        viewCount: stat?.statistics?.viewCount ?? 0
      };
    });

    videos.push(...merged);

    // 2000개 넘으면 종료
    if (videos.length >= 2000) {
      isMaxOver = true;
      videos = videos.slice(0, 2000);
      break;
    }


    // 다음 페이지 없으면 종료
    if (!videoData.nextPageToken) break;

    nextPageToken = videoData.nextPageToken;

    // 이미 2년보다 오래된 영상이면 종료
    const lastItem = videoData.items[videoData.items.length - 1];
    const lastDate = new Date(lastItem.snippet.publishedAt);

    if (lastDate < twoYearsAgo) break;
  }

  return (
    <div className="channel-wrap">
      <DashBoard videos={videos} channelInfo={channelInfo} isMaxOver={isMaxOver}/>
      <VideoWrap videos={videos}></VideoWrap>
    </div>
  );
}