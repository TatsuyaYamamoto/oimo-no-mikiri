import {filters} from 'pixi.js';
import * as anime from 'animejs'

import {t} from "../../../../framework/i18n";
import Deliverable from "../../../../framework/Deliverable";

import AbstractGameState from "../AbstractGameState";

import BackGround from "../../../texture/containers/BackGround";
import BattleResultLabel from '../../../texture/containers/BattleResultLabel';

import {Ids as StringIds} from '../../../resources/string';

abstract class ResultState extends AbstractGameState {
    protected _resultLabel: BattleResultLabel;
    protected _playerLabel: BattleResultLabel;
    protected _opponentLabel: BattleResultLabel;

    protected _hueFilter: filters.ColorMatrixFilter;
    protected _brightnessFilter: filters.ColorMatrixFilter;

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

        this.background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        this._resultLabel = new BattleResultLabel(t(StringIds.LABEL_WINNER));
        this._resultLabel.position.set(this.viewWidth * 0.5, this.viewHeight * 0.3);
        this._resultLabel.visible = false;

        this._playerLabel = new BattleResultLabel(this.player.name);
        this._playerLabel.position.set(this.viewWidth * 0.3, this.viewHeight * 0.3);
        this._playerLabel.visible = false;

        this._opponentLabel = new BattleResultLabel(this.opponent.name);
        this._opponentLabel.position.set(this.viewWidth * 0.7, this.viewHeight * 0.3);
        this._opponentLabel.visible = false;

        this.whiteLayer.alpha = 0;

        this._hueFilter = new filters.ColorMatrixFilter();
        this._brightnessFilter = new filters.ColorMatrixFilter();
        this.background.filters = [this._hueFilter, this._brightnessFilter];

        this.backGroundLayer.addChild(
            this.background,
        );

        this.applicationLayer.addChild(
            this.player,
            this.opponent,
            this.oimo,
            this._resultLabel,
            this._playerLabel,
            this._opponentLabel,
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
