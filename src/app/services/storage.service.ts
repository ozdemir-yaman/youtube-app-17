import { Injectable } from '@angular/core';
import { Video, Channel, NextPageToken } from '../../types';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() {}

    public getStoredChannelData(channelId: string): Channel {
        return JSON.parse(
            localStorage.getItem(`channel-data-${channelId}`) || '{}'
        );
    }

    public getStoredChannelVideos(channelId: string): Video[] {
        return JSON.parse(
            localStorage.getItem(`channel-videos-${channelId}`) || '[]'
        );
    }

    public getStoredChannelId(): string {
        return localStorage.getItem('last-selected-channel-id') || '';
    }

    public storeChannelData(channelId: string, data: Channel): void {
        localStorage.setItem(`channel-data-${channelId}`, JSON.stringify(data));
    }

    public storeChannelVideos(channelId: string, vidoes: Video[]): void {
        localStorage.setItem(
            `channel-videos-${channelId}`,
            JSON.stringify(vidoes)
        );
    }

    public updateChannelVideos(channelId: string, vidoes: Video[]): void {
        const storedVideos = this.getStoredChannelVideos(channelId);

        localStorage.setItem(
            `channel-videos-${channelId}`,
            JSON.stringify([...storedVideos, ...vidoes])
        );
    }

    public storeChannelId(channelId: string): void {
        localStorage.setItem('last-selected-channel-id', channelId);
    }

    public removeChannelId(): void {
        localStorage.removeItem('last-selected-channel-id');
    }

    getChannelNextPageToken(): Record<string, NextPageToken> {
        return JSON.parse(
            localStorage.getItem('next-page-token-by-channel') || '{}'
        );
    }

    public setChannelNextPageToken(
        channelId: string,
        token: NextPageToken
    ): void {
        let nextPageTokens = this.getChannelNextPageToken();

        nextPageTokens[channelId] = token;

        localStorage.setItem(
            'next-page-token-by-channel',
            JSON.stringify(nextPageTokens)
        );
    }
}
