import {filters} from 'pixi.js';
import * as anime from 'animejs'

import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import {Events} from "../GameView";
import AbstractGameState from "./GameViewState";

import BackGround from "../../../texture/containers/BackGround";
import BattleResultLabelBoard from "../../../texture/containers/BattleResultLabel";

import Actor from '../../../models/Actor';


class ResultState extends AbstractGameState {
    public static TAG = ResultState.name;

    private _battleResultLabelBoard: BattleResultLabelBoard;

    protected _hueFilter: filters.ColorMatrixFilter;
    protected _brightnessFilter: filters.ColorMatrixFilter;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        if (this.battle.isFixed()) {
            this._battleResultLabelBoard = new BattleResultLabelBoard(
                this.viewWidth,
                this.viewHeight,
                this.battle.winner === Actor.PLAYER ? 'playerWin' : 'opponentWin',
                this.battle.winner === Actor.PLAYER ? this.player.name : this.opponent.name);
        } else {
            this._battleResultLabelBoard = new BattleResultLabelBoard(this.viewWidth, this.viewHeight, 'falseStart');
        }
        this._battleResultLabelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._hueFilter = new filters.ColorMatrixFilter();
        this._brightnessFilter = new filters.ColorMatrixFilter();
        this.background.filters = [this._hueFilter, this._brightnessFilter];

        this.whiteLayer.alpha = 0;

        this.backGroundLayer.addChild(
            this.background,
        );

        this.applicationLayer.addChild(
            this.player,
            this.opponent,
            this.oimo,
            this.whiteLayer,
        );


        if (this.battle.winnerAttackTime && this.battle.winner === Actor.PLAYER) {
            this._showPlayerWon();
            return;
        }

        if (this.battle.winnerAttackTime && this.battle.winner === Actor.OPPONENT) {
            this._showOpponentWon();
            return;
        }

        this._showFalseStart();
    }

    private _showPlayerWon(): void {
        this.whiteOut(
            () => {
                this.player.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
                this.opponent.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

                this.oimo.visible = false;

                this.player.playSuccessAttack();
                this.opponent.playTryAttack();
            },
            () => {
                this.player.playWin();
                this.opponent.playLose();

                this.applicationLayer.addChild(this._battleResultLabelBoard);

                setTimeout(() => dispatchEvent(Events.REQUEST_READY), 3000);
            });
    }

    private _showOpponentWon(): void {
        this.whiteOut(
            () => {
                this.player.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
                this.opponent.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

                this.oimo.visible = false;

                this.player.playTryAttack();
                this.opponent.playSuccessAttack();
            },
            () => {
                this.player.playLose();
                this.opponent.playWin();

                this.applicationLayer.addChild(this._battleResultLabelBoard);

                setTimeout(() => dispatchEvent(Events.REQUEST_READY), 3000);
            });
    }

    private _showFalseStart(): void {
        this._hueFilter.hue(180);
        this._brightnessFilter.brightness(0.5);

        this.applicationLayer.addChild(this._battleResultLabelBoard);

        setTimeout(() => dispatchEvent(Events.REQUEST_READY), 3000);
    }

    protected whiteOut = (onStartRefresh: Function, onComplete: Function) => {

        const timeLine = anime.timeline({
            targets: this.whiteLayer,
            easing: 'linear',
        });

        timeLine
        // Start white out.
            .add({
                alpha: 1,
                duration: 100,
            })
            // Refresh white out.
            .add({
                begin: onStartRefresh,
                alpha: 0,
                duration: 300,
            })
            // Show result animation.
            .add({
                duration: 300,
                complete: onComplete
            });

        timeLine.play();
    };
}

export default ResultState;
