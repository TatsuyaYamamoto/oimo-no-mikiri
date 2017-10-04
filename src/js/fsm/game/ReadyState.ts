import * as anime from 'animejs'

import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";

import AbstractGameState from "./AbstractGameState";
import {Events} from '../views/GameViewState';

import GameBackground from "../../texture/sprite/background/GameBackground";
import Uchicchi from "../../texture/sprite/character/Uchicchi";
import UchicchiCloseUp from "../../texture/sprite/character/UchicchiCloseUp";
import Hanamaru from "../../texture/sprite/character/Hanamaru";
import HanamaruCloseUp from "../../texture/sprite/character/HanamaruCloseUp";
import CloseupBrightnessFilter from "../../filter/CloseupBrightnessFilter";

const ANIMATION_TIME_LINE = {
    START_INCREASING_BRIGHTNESS: 1000,
    END_INCREASING_BRIGHTNESS: 2000,
    PLAY_READY_SOUND: 3000,
    SHOW_CLOSEUP_LINE_IMAGES: 3000,
    START_MOVING_CLOSEUP_LINE_IMAGES: 4000,
    END_MOVING_CLOSING_LINE_IMAGES: 5000,
    HIDE_CLOSEUP_LINE_IMAGES: 6000,
    START_DECREASING_BRIGHTNESS: 7000,
    END_DECREASING_BRIGHTNESS: 8000,
};

class ReadyState extends AbstractGameState {
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
        this._playerCharacterCloseup.visible = false;

        this._opponentCharacter = new Uchicchi();
        this._opponentCharacter.position.set(this.viewWidth * 0.7, this.viewHeight * 0.5);

        this._opponentCharacterCloseup = new UchicchiCloseUp();
        this._opponentCharacterCloseup.position.set(this.viewWidth * 0.5, this.viewHeight * 0.8);
        this._opponentCharacterCloseup.visible = false;

        this._closeupBrightnessFilter = new CloseupBrightnessFilter();
        this._closeupBrightnessFilter.brightness(0.5);
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
        const values = {
            brightness: 1,
        };

        const {
            START_INCREASING_BRIGHTNESS,
            END_INCREASING_BRIGHTNESS,
            START_DECREASING_BRIGHTNESS,
            END_DECREASING_BRIGHTNESS
        } = ANIMATION_TIME_LINE;

        const timeLine = anime.timeline({
            targets: values,
            easing: 'linear',
            update: () => {
                this._closeupBrightnessFilter.brightness(values.brightness);
            }
        });

        timeLine
        // black out
            .add({
                brightness: 0,
                offset: START_INCREASING_BRIGHTNESS,
                duration: END_INCREASING_BRIGHTNESS - START_INCREASING_BRIGHTNESS,
            })

            // white out
            .add({
                brightness: 1,
                offset: START_DECREASING_BRIGHTNESS,
                duration: END_DECREASING_BRIGHTNESS - START_DECREASING_BRIGHTNESS,
            });

        return timeLine;
    };

    /**
     *
     * @returns {any}
     * @private
     */
    private _getCloseupTimeline = () => {
        const values = {
            playerX: this.viewWidth * 0.25,
            opponentX: this.viewWidth * 0.75,
        };

        const {
            SHOW_CLOSEUP_LINE_IMAGES,
            START_MOVING_CLOSEUP_LINE_IMAGES,
            END_MOVING_CLOSING_LINE_IMAGES,
            HIDE_CLOSEUP_LINE_IMAGES
        } = ANIMATION_TIME_LINE;

        const timeLine = anime.timeline({
            easing: 'linear',
            targets: values,
            update: () => {
                this._playerCharacterCloseup.x = values.playerX;
                this._opponentCharacterCloseup.x = values.opponentX;

            },
        });

        timeLine
        // show
            .add({
                offset: SHOW_CLOSEUP_LINE_IMAGES,
                begin: () => {
                    this._playerCharacterCloseup.visible = true;
                    this._opponentCharacterCloseup.visible = true;
                }
            })
            // move
            .add({
                offset: START_MOVING_CLOSEUP_LINE_IMAGES,
                duration: END_MOVING_CLOSING_LINE_IMAGES - START_MOVING_CLOSEUP_LINE_IMAGES,
                playerX: this.viewWidth * 0.75,
                opponentX: this.viewWidth * 0.25,
            })
            // hide
            .add({
                offset: HIDE_CLOSEUP_LINE_IMAGES,
                begin: () => {
                    this._playerCharacterCloseup.visible = false;
                    this._opponentCharacterCloseup.visible = false;
                },
            });

        return timeLine;
    };
}

export default ReadyState;
