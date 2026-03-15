export interface YouTubeSearchResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: SearchItem[];
}

export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}

export interface SearchItem {
    kind: "youtube#searchResult";
    etag: string;
    id: SearchId;
    snippet: Snippet;
}

export type SearchId =
    | {
        kind: "youtube#video";
        videoId: string;
    }
    | {
        kind: "youtube#channel";
        channelId: string;
    }
    | {
        kind: "youtube#playlist";
        playlistId: string;
    };

export interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    liveBroadcastContent: "none" | "live" | "upcoming";
    publishTime: string;
}

export interface Thumbnails {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
}

export interface Thumbnail {
    url: string;
    width?: number;
    height?: number;
}