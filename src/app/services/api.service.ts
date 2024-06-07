import { Injectable } from '@angular/core';
import { ChannelResponse, Video, VideoResponse } from '../../types';
import { StorageService } from './storage.service';
import { Channel } from '../model/channel.model';
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

    private async sendVideoFetchRequest(
        channelId: string,
        nextPageToken?: string
    ): Promise<{
        items: VideoResponse[];
        nextPageToken: string | undefined;
    }> {
        const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBAAhkxdhp6wLcMQsmzd1FDuwJg5IGTocs&channelId=${channelId}&${
                nextPageToken ? `pageToken=${nextPageToken}&` : ''
            }part=snippet&maxResults=50&type=video&order=date`
        );
        const videoData = (await videoResponse.json()) as {
            items: VideoResponse[];
            nextPageToken: string | undefined;
        };

        return videoData;
    }

    private compareVideos(
        storedVideos: Video[],
        fetchedVideos: Video[]
    ): boolean {
        return JSON.stringify(storedVideos) === JSON.stringify(fetchedVideos);
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

        if (this.compareVideos(storedChannelVideos, formattedVideos)) {
            alert('No new videos to show.');

            return;
        }

        formattedVideos.forEach((video) => {
            if (
                storedChannelVideos.find(
                    (storedVideo) => storedVideo.id === video.id
                )
            ) {
                return;
            }

            storedChannelVideos.unshift(video);
        });

        this.setVideoState(storedChannelVideos);
        this.storageService.storeChannelVideos(channelId, storedChannelVideos);
    }

    public async getChannelData(channelId: string): Promise<Channel> {
        const storedChannelData =
            this.storageService.getStoredChannelData(channelId);

        if (Object.keys(storedChannelData).length) {
            return storedChannelData;
        }

        const channelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?key=AIzaSyBAAhkxdhp6wLcMQsmzd1FDuwJg5IGTocs&id=${channelId}&part=brandingSettings,snippet,contentDetails`
        );
        const channelData = (await channelResponse.json()) as {
            items: ChannelResponse[];
            pageInfo: { totalResults: number };
        };

        if (!channelData.pageInfo.totalResults) {
            alert('Channel not found');
            this.storageService.removeChannelId();
            window.location.reload();
        }

        const {
            snippet: {
                title: name,
                thumbnails: {
                    medium: { url: profile },
                },
                description,
            },
            brandingSettings: {
                image: { bannerExternalUrl: banner },
            },
        } = channelData.items[0];

        const channelInfo = {
            name,
            profile,
            description,
            banner: `${banner}=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`,
        };

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
        this.store.dispatch(
            new GeneralActions.SetVideos({ videos, reset: true })
        );
    }

    public async setAllData(channelId: string): Promise<void> {
        const { channel, videos } = await this.getAllData(channelId);

        this.store.dispatch(new GeneralActions.SetChannelInfo(channel));
        this.setVideoState(videos);
        this.store.dispatch(new GeneralActions.SetLoadingState(false));
    }

    public async updateVideoData(
        channelId: string,
        nextPageToken: string | undefined
    ): Promise<void> {
        const videos = await this.getVideoData(channelId, nextPageToken);

        this.store.dispatch(new GeneralActions.SetVideos({ videos }));
        this.store.dispatch(new GeneralActions.SetLoadingState(false));
    }
}
