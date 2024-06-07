import { Component } from '@angular/core';
import {
    CdkDragDrop,
    CdkDropList,
    CdkDrag,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NextPageToken, Video } from '../../../types';
import { ChannelVideoComponent } from './channel-video/channel-video.component';
import { Select } from '@ngxs/store';
import { StorageService } from '../../services/storage.service';
import { GeneralStateModel } from '../../store/states/general.state';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-main-channel-videos',
    standalone: true,
    imports: [CdkDropList, CdkDrag, ChannelVideoComponent],
    templateUrl: './main-channel-videos.component.html',
    styleUrl: './main-channel-videos.component.scss',
})
export class MainChannelVideosComponent {
    protected videos!: Video[];
    protected channelId!: string;
    protected nextPageToken!: NextPageToken;
    protected loadButtonText:
        | 'Load More'
        | 'No More Videos To Load'
        | 'Loading...' = 'Load More';

    @Select((state: { general: GeneralStateModel }) => state.general)
    protected general$!: Observable<GeneralStateModel>;
    constructor(
        private storageService: StorageService,
        private apiService: ApiService
    ) {}

    protected ngOnInit(): void {
        this.general$.subscribe((state) => {
            this.channelId = state.channelId;
            this.videos = state.videos;

            this.setNextPageToken();
        });
    }

    private setNextPageToken(): void {
        this.nextPageToken =
            this.storageService.getChannelNextPageToken()[this.channelId];

        this.loadButtonText =
            this.nextPageToken === undefined
                ? 'No More Videos To Load'
                : 'Load More';
    }

    protected drop(event: CdkDragDrop<string[]>): void {
        const vidoesCopy = this.videos.slice();

        vidoesCopy.splice(
            event.currentIndex,
            0,
            vidoesCopy.splice(event.previousIndex, 1)[0]
        );

        this.storageService.storeChannelVideos(this.channelId, vidoesCopy);

        moveItemInArray(this.videos, event.previousIndex, event.currentIndex);
    }

    protected async loadMore(): Promise<void> {
        if (this.loadButtonText !== 'Load More') {
            return;
        }

        this.loadButtonText = 'Loading...';

        await this.apiService.updateVideoData(
            this.channelId,
            this.nextPageToken
        );

        this.setNextPageToken();
    }

    protected refresh() {
        this.apiService.refreshVideoData(this.channelId);
    }
}
