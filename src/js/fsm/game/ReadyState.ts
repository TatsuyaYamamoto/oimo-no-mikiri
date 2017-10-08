import * as anime from 'animejs'
import {filters} from 'pixi.js';

import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";

import AbstractGameState from "./AbstractGameState";
import {Events} from '../views/GameViewState';

import BackGround from "../../texture/containers/BackGround";
import PlayerCloseUp from "../../texture/sprite/character/PlayerCloseUp";
import OpponentCloseUp from "../../texture/sprite/character/OpponentCloseUp";

import {SKIP_READY_ANIMATION} from '../../Constants';

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

    private _background: BackGround;
    private _playerCharacterCloseup: PlayerCloseUp;
    private _opponentCharacterCloseup: OpponentCloseUp;

    private _brightnessFilter: filters.ColorMatrixFilter;
    private _contrastFilter: filters.ColorMatrixFilter;


    private _soundTimeLine;
    private _filterTimeLine;
    private _closeupTimeLine;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);
        this._background.progress(elapsedMS);
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new BackGround();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        this._playerCharacterCloseup = this.player.closeUpTexture;
        this._playerCharacterCloseup.position.set(this.viewWidth * 1, this.viewHeight * 0);
        this._playerCharacterCloseup.visible = false;

        this._opponentCharacterCloseup = this.opponent.closeUpTexture;
        this._opponentCharacterCloseup.position.set(this.viewWidth * 0, this.viewHeight * 1);
        this._opponentCharacterCloseup.visible = false;

        this._brightnessFilter = new filters.ColorMatrixFilter();
        this._contrastFilter = new filters.ColorMatrixFilter();

        this.backGroundLayer.addChild(
            this._background,
        );

        this.applicationLayer.addChild(
            this.player,
            this.opponent,
            this.oimo,
            this._playerCharacterCloseup,
            this._opponentCharacterCloseup,
        );

        this.backGroundLayer.filters = [
            this._brightnessFilter,
            this._contrastFilter,
        ];

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

        if (SKIP_READY_ANIMATION) {
            // Set timeout to dispatch after ending onEnter logic.
            window.setTimeout(() => dispatchEvent(Events.IS_READY), 1);
        } else {
            this._playAnimation();
        }
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
            contrast: 0,
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
                this._brightnessFilter.contrast(values.contrast);
                this._contrastFilter.brightness(values.brightness);
            }
        });

        timeLine
        // black out
            .add({
                brightness: 0.4,
                contrast: 0.8,
                offset: START_INCREASING_BRIGHTNESS,
                duration: END_INCREASING_BRIGHTNESS - START_INCREASING_BRIGHTNESS,
            })

            // white out
            .add({
                brightness: 1,
                contrast: 0,
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
            playerX: this.viewWidth * 1,
            opponentX: this.viewWidth * 0,
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
                playerX: this.viewWidth * 2,
                opponentX: -1 * this.viewWidth * 1,
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
