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

export type Video = {
    id: string;
    thumbnail: string;
    title: string;
    publishedAt: string;
    note: string;
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
