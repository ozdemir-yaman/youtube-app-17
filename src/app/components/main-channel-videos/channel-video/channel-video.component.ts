import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Video } from '../../../../types';
import { TimeAgoPipe } from '../../../pipes/time-ago.pipe';
import { UnescapePipe } from '../../../pipes/unescape.pipe';
import { StorageService } from '../../../services/storage.service';

@Component({
    selector: 'app-channel-video',
    standalone: true,
    imports: [TimeAgoPipe, UnescapePipe, FormsModule],
    templateUrl: './channel-video.component.html',
    styleUrl: './channel-video.component.scss',
})
export class ChannelVideoComponent {
    @Input() video!: Video;
    @Input() channelId!: string;

    constructor(private storageService: StorageService) {}

    protected updateNote() {
        const storedVideos = this.storageService.getStoredChannelVideos(
            this.channelId
        );

        const updatedVideos = storedVideos.map((video) => {
            if (video.id !== this.video.id) {
                return video;
            }
            video.note = this.video.note;
            return video;
        });

        this.storageService.storeChannelVideos(this.channelId, updatedVideos);
    }

    protected openVideo(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        window
            .open(`https://www.youtube.com/watch?v=${this.video.id}`, '_blank')
            ?.focus();
    }
}
