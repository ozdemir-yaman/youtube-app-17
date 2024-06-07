import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { GeneralActions } from '../actions/general.action';
import { Video, Channel } from '../../../types';
import { StorageService } from '../../services/storage.service';

export interface GeneralStateModel {
    channel: Channel;
    channelId: string;
    loading: boolean;
    videos: Video[];
}

@State<GeneralStateModel>({
    name: 'general',
    defaults: {
        channelId:
            new StorageService().getStoredChannelId() ||
            'UC3mhUecusCu42TUv8TJNtEg',
        loading: true,
        videos: [] as Video[],
    } as GeneralStateModel,
})
@Injectable()
export class GeneralState {
    constructor(private storageService: StorageService) {}

    @Action(GeneralActions.SetChannelInfo) setChannelInfo(
        ctx: StateContext<GeneralStateModel>,
        action: GeneralActions.SetChannelInfo
    ) {
        ctx.patchState({ channel: action.payload });
    }

    @Action(GeneralActions.SetChannelId) setChannelId(
        ctx: StateContext<GeneralStateModel>,
        action: GeneralActions.SetChannelId
    ) {
        this.storageService.storeChannelId(action.payload);

        ctx.patchState({ channelId: action.payload, loading: true });
    }

    @Action(GeneralActions.SetVideos) setVideos(
        ctx: StateContext<GeneralStateModel>,
        action: GeneralActions.SetVideos
    ) {
        ctx.patchState({
            videos: action.payload,
        });
    }

    @Action(GeneralActions.UpdateVideos) updateVideos(
        ctx: StateContext<GeneralStateModel>,
        action: GeneralActions.UpdateVideos
    ) {
        ctx.patchState({
            videos: [...ctx.getState().videos, ...action.payload],
        });
    }

    @Action(GeneralActions.SetLoadingState) setLoadingState(
        ctx: StateContext<GeneralStateModel>,
        action: GeneralActions.SetLoadingState
    ) {
        ctx.patchState({ loading: action.payload });
    }
}
