import * as anime from 'animejs'

import ViewContainer from "../../../framework/ViewContainer";
import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";

import {Events} from '../views/GameViewState';

import GameBackground from "../../texture/sprite/background/GameBackground";
import Uchicchi from "../../texture/sprite/character/Uchicchi";
import UchicchiCloseUp from "../../texture/sprite/character/UchicchiCloseUp";
import Hanamaru from "../../texture/sprite/character/Hanamaru";
import HanamaruCloseUp from "../../texture/sprite/character/HanamaruCloseUp";
import CloseupBrightnessFilter from "../../filter/CloseupBrightnessFilter";

const ANIMATION_TIME_LINE = {
    PLAY_READY_SOUND: 1000,
    START_BLACK_OUT: 1000,
    SHOW_CLOSEUP_LINE_IMAGES: 1000,
    START_MOVING_CLOSEUP_LINE_IMAGES: 1000,
    END_MOVING_CLOSING_LINE_IMAGES: 1000,
    FINISH: 1000,
};

class ReadyState extends ViewContainer {
    public static TAG = ReadyState.name;

    private _background: GameBackground;

    private _playerCharacter: Hanamaru;
    private _playerCharacterCloseup: HanamaruCloseUp;
    private _opponentCharacter: Uchicchi;
    private _opponentCharacterCloseup: UchicchiCloseUp;

    private _closeupBrightnessFilter: CloseupBrightnessFilter;

    private _soundTimeLine;
    private _filterTimeLine;
    private _closeupTimeLine;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new GameBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._playerCharacter = new Hanamaru();
        this._playerCharacter.position.set(this.viewWidth * 0.3, this.viewHeight * 0.5);

        this._playerCharacterCloseup = new HanamaruCloseUp();
        this._playerCharacterCloseup.position.set(this.viewWidth * 0.5, this.viewHeight * 0.2);

        this._opponentCharacter = new Uchicchi();
        this._opponentCharacter.position.set(this.viewWidth * 0.7, this.viewHeight * 0.5);

        this._opponentCharacterCloseup = new UchicchiCloseUp();
        this._opponentCharacterCloseup.position.set(this.viewWidth * 0.5, this.viewHeight * 0.8);

        this._closeupBrightnessFilter = new CloseupBrightnessFilter();
        this._closeupBrightnessFilter.contrast(0.2);
        this.backGroundLayer.addChild(
            this._background,
        );

        this.applicationLayer.addChild(
            this._playerCharacter,
            this._opponentCharacter,
            this._playerCharacterCloseup,
            this._opponentCharacterCloseup,
        );

        this.backGroundLayer.filters = [this._closeupBrightnessFilter];

        // Setup animation time lines
        this._soundTimeLine = this._getSoundTimeLine();
        this._filterTimeLine = this._getFilterAnimeTimeLine();
        this._closeupTimeLine = this._getCloseupTimeline();

        // Create animation promise.
        Promise
            .all([
                new Promise((onfulfilled) => this._soundTimeLine.complete = onfulfilled),
                new Promise((onfulfilled) => this._filterTimeLine.complete = onfulfilled),
                new Promise((onfulfilled) => this._closeupTimeLine.complete = onfulfilled),
            ])
            .then(() => {
                dispatchEvent(Events.IS_READY);
            });

        this._playAnimation();
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }

    /**
     *
     * @private
     */
    private _playAnimation = () => {
        this._soundTimeLine.play();
        this._filterTimeLine.play();
        this._closeupTimeLine.play();
    };

    /**
     *
     * @returns {any}
     * @private
     */
    private _getSoundTimeLine = () => {
        const timeLine = anime.timeline();

        return timeLine;
    };

    /**
     *
     * @returns {any}
     * @private
     */
    private _getFilterAnimeTimeLine = () => {
        let hoge = 0;
        const timeLine = anime.timeline();
        timeLine
            .add({
                targets: this._closeupBrightnessFilter,
                delay: ANIMATION_TIME_LINE.START_BLACK_OUT,
                update: () => {
                    hoge += 0.01;
                    this._closeupBrightnessFilter.brightness(hoge)
                }
            });

        return timeLine;
    };

    /**
     *
     * @returns {any}
     * @private
     */
    private _getCloseupTimeline = () => {
        const timeLine = anime.timeline();

        return timeLine;
    };
}

export default ReadyState;
