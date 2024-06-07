import { Video, Channel } from '../../../types';

export namespace GeneralActions {
    export class SetChannelInfo {
        static readonly type = '[Channel] Set Info';

        constructor(public payload: Channel) {}
    }

    export class SetVideos {
        static readonly type = '[Videos] Set Videos';

        constructor(public payload: Video[]) {}
    }

    export class UpdateVideos {
        static readonly type = '[Videos] Update Videos';

        constructor(public payload: Video[]) {}
    }

    export class SetChannelId {
        static readonly type = '[ChannelId] Set ChannelId';

        constructor(public payload: string) {}
    }

    export class SetLoadingState {
        static readonly type = '[Loading] Set Loading State';

        constructor(public payload: boolean | undefined) {}
    }
}
