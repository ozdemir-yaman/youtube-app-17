type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

type Thumbnails = {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
};

export type NextPageToken = string | undefined;

export type Video = {
    id: string;
    thumbnail: string;
    title: string;
    publishedAt: string;
    note: string;
};

export type Channel = {
    banner: string;
    profile: string;
    name: string;
    description: string;
};

export type VideoResponse = {
    id: {
        videoId: string;
    };
    snippet: {
        publishedAt: string;
        title: string;
        thumbnails: Thumbnails;
    };
};

export type ChannelResponse = {
    id: string;
    snippet: {
        title: string;
        description: string;
        thumbnails: Thumbnails;
    };
    brandingSettings: {
        image: {
            bannerExternalUrl: string;
        };
    };
};

export type FormatUrlParams = {
    type: 'channels' | 'search';
    params: Record<string, string>;
};
