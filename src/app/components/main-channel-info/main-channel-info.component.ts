import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GeneralStateModel } from '../../store/states/general.state';

@Component({
    selector: 'app-main-channel-info',
    standalone: true,
    imports: [],
    templateUrl: './main-channel-info.component.html',
    styleUrl: './main-channel-info.component.scss',
})
export class MainChannelInfoComponent {
    name!: string;
    profile!: string;
    banner!: string;
    description!: string;

    @Select((state: { general: GeneralStateModel }) => state.general)
    general$!: Observable<GeneralStateModel>;

    constructor() {
        this.general$.subscribe((state) => {
            this.name = state.channel.name;
            this.profile = state.channel.profile;
            this.banner = state.channel.banner;
            this.description = state.channel.description;
        });
    }
}
