import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from '../../../../framework/EventUtils';

import AbstractTopState from "./TopViewState";
import {Events} from "../TopView";

import TitleLogo from "../../../texture/sprite/TitleLogo";

import {play, playOnLoop} from "../../../helper/MusicPlayer";

import {Ids as SoundIds} from '../../../resources/sound';

class TitleState extends AbstractTopState {
    private _titleLogo: TitleLogo;

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

        this._titleLogo = new TitleLogo();
        this._titleLogo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.backGroundLayer.addChild(
            this.background
        );
        this.applicationLayer.addChild(
            this._titleLogo,
        );

        this.addClickWindowEventListener(this._handleTapWindow);

        playOnLoop(SoundIds.SOUND_ZENKAI);
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
