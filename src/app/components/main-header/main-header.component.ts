import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { GeneralStateModel } from '../../store/states/general.state';
import { GeneralActions } from '../../store/actions/general.action';
import { AppComponent } from '../../app.component';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-main-header',
    standalone: true,
    templateUrl: './main-header.component.html',
    styleUrl: './main-header.component.scss',
    imports: [FormsModule, AppComponent],
})
export class MainHeaderComponent {
    protected initialChannelId!: string;
    protected channelId!: string;

    constructor(
        private store: Store,
        private storageService: StorageService,
        private apiService: ApiService
    ) {
        this.channelId = this.storageService.getStoredChannelId();
        this.initialChannelId = this.channelId;
    }

    protected search() {
        if (this.initialChannelId === this.channelId) {
            alert('I saw that one coming ;) The entered ID is already in use');
        }

        this.store.dispatch(new GeneralActions.SetChannelId(this.channelId));

        this.apiService.setAllData(this.channelId);
    }
}
