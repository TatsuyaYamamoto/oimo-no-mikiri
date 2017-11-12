import {filters} from 'pixi.js';
import * as anime from 'animejs'

import Deliverable from "../../../../../framework/Deliverable";

import AbstractGameState from "../GameViewState";

import BackGround from "../../../../texture/containers/BackGround";

abstract class ResultState extends AbstractGameState {
    private _background: BackGround;

    protected _hueFilter: filters.ColorMatrixFilter;
    protected _brightnessFilter: filters.ColorMatrixFilter;

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

        this.whiteLayer.alpha = 0;

        this._hueFilter = new filters.ColorMatrixFilter();
        this._brightnessFilter = new filters.ColorMatrixFilter();
        this._background.filters = [this._hueFilter, this._brightnessFilter];

        this.backGroundLayer.addChild(
            this._background,
        );

        this.applicationLayer.addChild(
            this.player,
            this.opponent,
            this.oimo,
            this.whiteLayer,
        );
    }

    protected whiteOut = (winner: 'player' | 'opponent', callback: Function) => {

        const timeLine = anime.timeline({
            targets: this.whiteLayer,
            easing: 'linear',
        });

        const playAttack = () => {
            this.player.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
            this.opponent.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

            this.oimo.visible = false;

            if (winner === 'player') {
                this.player.playSuccessAttack();
                this.opponent.playTryAttack();
            } else {
                this.player.playTryAttack();
                this.opponent.playSuccessAttack();
            }
        };

        const playWinOrLose = () => {
            if (winner === 'player') {
                this.player.playWin();
                this.opponent.playLose();
            } else {
                this.player.playLose();
                this.opponent.playWin();
            }
        };

        timeLine
        // Start white out.
            .add({
                alpha: 1,
                duration: 100,
            })
            // Refresh white out.
            .add({
                begin: () => {
                    playAttack();
                },
                alpha: 0,
                duration: 300,
            })
            // Show result animation.
            .add({
                duration: 300,
                complete: () => {
                    callback();
                    playWinOrLose();
                }
            });

        timeLine.play();
    };
}

export default ResultState;
