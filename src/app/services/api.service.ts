import { Injectable } from '@angular/core';
import {
    ChannelResponse,
    Video,
    VideoResponse,
    Channel,
    NextPageToken,
    FormatUrlParams,
} from '../../types';
import { StorageService } from './storage.service';
import { GeneralActions } from '../store/actions/general.action';
import { Store } from '@ngxs/store';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private storageService: StorageService, private store: Store) {}

    private formatVideodata(items: VideoResponse[]): Video[] {
        const videos: Video[] = [];

        items.forEach((video) => {
            videos.push({
                id: video.id.videoId,
                thumbnail: video.snippet.thumbnails.medium.url,
                title: video.snippet.title,
                publishedAt: video.snippet.publishedAt,
                note: '',
            });
        });

        return videos;
    }

    private formatChanneldata(item: ChannelResponse): Channel {
        return {
            banner: `${item.brandingSettings.image.bannerExternalUrl}=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`,
            profile: item.snippet.thumbnails.medium.url,
            name: item.snippet.title,
            description: item.snippet.description,
        };
    }

    private formatFetchUrl(config: FormatUrlParams): string {
        const baseUrl = new URL(
            `https://www.googleapis.com/youtube/v3/${config.type}?key=AIzaSyBAAhkxdhp6wLcMQsmzd1FDuwJg5IGTocs`
        );

        Object.keys(config.params).forEach((param) => {
            baseUrl.searchParams.append(param, config.params[param]);
        });

        return baseUrl.href;
    }

    private async sendVideoFetchRequest(
        channelId: string,
        nextPageToken?: string
    ): Promise<{
        items: VideoResponse[];
        nextPageToken: NextPageToken;
    }> {
        const fetchUrl = this.formatFetchUrl({
            type: 'search',
            params: {
                channelId,
                pageToken: nextPageToken || '',
                part: 'snippet',
                maxResults: '50',
                type: 'video',
                order: 'date',
            },
        });
        const videoResponse = await fetch(fetchUrl);
        const videoData = (await videoResponse.json()) as {
            items: VideoResponse[];
            nextPageToken: NextPageToken;
        };

        return videoData;
    }

    private async sendChannelFetchRequest(channelId: string): Promise<{
        items: ChannelResponse[];
        pageInfo: { totalResults: number };
    }> {
        const fetchUrl = this.formatFetchUrl({
            type: 'channels',
            params: {
                id: channelId,
                part: 'brandingSettings,snippet,contentDetails',
            },
        });
        const channelResponse = await fetch(fetchUrl);
        const channelData = (await channelResponse.json()) as {
            items: ChannelResponse[];
            pageInfo: { totalResults: number };
        };

        return channelData;
    }

    public async getVideoData(
        channelId: string,
        nextPageToken?: string
    ): Promise<Video[]> {
        const storedChannelVideos =
            this.storageService.getStoredChannelVideos(channelId);

        if (Object.keys(storedChannelVideos).length && !nextPageToken) {
            return storedChannelVideos;
        }

        const videoData = await this.sendVideoFetchRequest(
            channelId,
            nextPageToken
        );
        const videos = this.formatVideodata(videoData.items);

        this.storageService.setChannelNextPageToken(
            channelId,
            videoData.nextPageToken
        );

        this.storageService[
            nextPageToken ? 'updateChannelVideos' : 'storeChannelVideos'
        ](channelId, videos);

        return videos;
    }

    public async refreshVideoData(channelId: string) {
        const storedChannelVideos =
            this.storageService.getStoredChannelVideos(channelId);

        const videoData = await this.sendVideoFetchRequest(channelId);
        const formattedVideos = this.formatVideodata(videoData.items);
        let mutated = false;

        formattedVideos.forEach((video) => {
            if (
                storedChannelVideos.find(
                    (storedVideo) => storedVideo.id === video.id
                )
            ) {
                return;
            }

            mutated = true;

            storedChannelVideos.unshift(video);
        });

        if (!mutated) {
            alert('No new videos to show.');

            return;
        }

        this.setVideoState(storedChannelVideos);
        this.storageService.storeChannelVideos(channelId, storedChannelVideos);
    }

    public async getChannelData(channelId: string): Promise<Channel> {
        const storedChannelData =
            this.storageService.getStoredChannelData(channelId);

        if (Object.keys(storedChannelData).length) {
            return storedChannelData;
        }

        const channelData = await this.sendChannelFetchRequest(channelId);

        if (!channelData.pageInfo.totalResults) {
            alert('Channel not found');
            this.storageService.removeChannelId();
            window.location.reload();
        }

        const channelInfo = this.formatChanneldata(channelData.items[0]);

        this.storageService.storeChannelData(channelId, channelInfo);

        return channelInfo;
    }

    public async getAllData(
        channelId: string
    ): Promise<{ channel: Channel; videos: Video[] }> {
        const channel = await this.getChannelData(channelId);
        const videos = await this.getVideoData(channelId);

        return {
            channel,
            videos,
        };
    }

    private setVideoState(videos: Video[]) {
        this.store.dispatch(new GeneralActions.SetVideos(videos));
    }

    public async setAllData(channelId: string): Promise<void> {
        const { channel, videos } = await this.getAllData(channelId);

        this.store.dispatch(new GeneralActions.SetChannelInfo(channel));
        this.setVideoState(videos);
        this.store.dispatch(new GeneralActions.SetLoadingState(false));
    }

    public async updateVideoData(
        channelId: string,
        nextPageToken: NextPageToken
    ): Promise<void> {
        const videos = await this.getVideoData(channelId, nextPageToken);

        this.store.dispatch(new GeneralActions.UpdateVideos(videos));
        this.store.dispatch(new GeneralActions.SetLoadingState(false));
    }
}
