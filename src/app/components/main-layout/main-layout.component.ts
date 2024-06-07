import { Component } from '@angular/core';
import { MainHeaderComponent } from '../main-header/main-header.component';
import { MainChannelInfoComponent } from '../main-channel-info/main-channel-info.component';
import { MainChannelVideosComponent } from '../main-channel-videos/main-channel-videos.component';
import { SectionBreakComponent } from '../section-break/section-break.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        MainHeaderComponent,
        MainChannelInfoComponent,
        MainChannelVideosComponent,
        SectionBreakComponent,
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
