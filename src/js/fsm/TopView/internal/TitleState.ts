import Deliverable from "../../../../framework/Deliverable";
import { dispatchEvent } from '../../../../framework/EventUtils';
import { t } from "../../../../framework/i18n";

import AbstractTopState from "./TopViewState";
import { Events } from "../TopView";

import TitleLogo from "../../../texture/sprite/TitleLogo";
import Text from "../../../texture/internal/Text";

import { play, playOnLoop, stop } from "../../../helper/MusicPlayer";
import { trackPageView, VirtualPageViews } from "../../../helper/tracker";
import {
    getRoomIdFromUrl,
    onMemberFulfilled,
    requestJoinRoom
} from "../../../helper/firebase";
import ReadyModal from "../../../helper/modal/ReadyModal";
import JoinModal from "../../../helper/modal/JoinModal";

import { Ids as SoundIds } from '../../../resources/sound';
import { Ids as StringIds } from '../../../resources/string';
import Mode from "../../../models/Mode";

const {version} = require('../../../../../package.json');

class TitleState extends AbstractTopState {
    private _titleLogo: TitleLogo;
    private _appVersion: Text;
    private _tapInfoText: Text;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);
        this.background.progress(elapsedMS);
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        // Tracking
        trackPageView(VirtualPageViews.TITLE);

        this._titleLogo = new TitleLogo();
        this._titleLogo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._appVersion = new Text(`v${version}`, {
            fontSize: 20,
            stroke: '#ffffff',
            strokeThickness: 1,
        });
        this._appVersion.position.set(this.viewWidth * 0.9, this.viewHeight * 0.95);

        this._tapInfoText = new Text(t(StringIds.TAP_DISPLAY_INFO), {
            fontSize: 40,
            stroke: '#ffffff',
            strokeThickness: 2,
        });
        this._tapInfoText.position.set(this.viewWidth * 0.5, this.viewHeight * 0.9);

        this.backGroundLayer.addChild(
            this.background
        );
        this.applicationLayer.addChild(
            this._titleLogo,
            this._tapInfoText,
            this._appVersion
        );

        this.addClickWindowEventListener(this._handleTapWindow);

        playOnLoop(SoundIds.SOUND_ZENKAI);

        const roomId = getRoomIdFromUrl();
        if (roomId) {
            const joinModal = new JoinModal(roomId);
            joinModal.open();

            onMemberFulfilled(roomId, () => {
                joinModal.close();

                const readyModal = new ReadyModal();
                readyModal.open();

                setTimeout(() => {
                    dispatchEvent(Events.FIXED_PLAY_MODE, {mode: Mode.MULTI_ONLINE});

                    const url = `${location.protocol}//${location.host}${location.pathname}`;
                    history.replaceState(null, null, url);
                    readyModal.close();
                    stop(SoundIds.SOUND_ZENKAI);
                    //TODO: check this logic is required
                    this.removeClickWindowEventListener(this._handleTapWindow);
                }, 3000);
            });

            requestJoinRoom(roomId);
        }
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
        this.removeClickWindowEventListener(this._handleTapWindow);
    }

    private _handleTapWindow = () => {
        dispatchEvent(Events.TAP_TITLE);

        play(SoundIds.SOUND_OK);
    };
}

export default TitleState;
