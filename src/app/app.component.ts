import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { StorageService } from './services/storage.service';
import { GeneralStateModel } from './store/states/general.state';
import { Observable } from 'rxjs';
import { ApiService } from './services/api.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MainLayoutComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    public loading!: boolean;
    private channelId!: string;
    @Select((state: { general: GeneralStateModel }) => state.general)
    general$!: Observable<GeneralStateModel>;

    constructor(
        private storageService: StorageService,
        private apiService: ApiService
    ) {
        this.general$.subscribe((state) => {
            this.channelId = state.channelId;
            this.loading = state.loading;

            this.storageService.storeChannelId(this.channelId);
        });
    }

    public async ngOnInit() {
        await this.apiService.setAllData(this.channelId);
    }
}
