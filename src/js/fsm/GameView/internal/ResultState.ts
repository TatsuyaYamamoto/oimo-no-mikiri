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

    private _background: BackGround;
    private _battleResultLabelBoard: BattleResultLabelBoard;

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


        if (this.battle.winner && !this.battle.winnerAttackTime) {
            this._showFalseStart();
            return;
        }

        if (this.battle.winner === Actor.PLAYER) {
            this._showPlayerWon();
            return;
        }

        if (this.battle.winner === Actor.OPPONENT) {
            this._showOpponentWon();
            return;
        }

        this._showFalseStart();
    }

    private _showPlayerWon(): void {
        this._battleResultLabelBoard = new BattleResultLabelBoard(
            this.viewWidth,
            this.viewHeight,
            'playerWin',
            this.player.name
        );
        this._battleResultLabelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.applicationLayer.addChild(this._battleResultLabelBoard);

        this.whiteOut('player', () => {
            window.setTimeout(function () {
                dispatchEvent(Events.REQUEST_READY);
            }, 3000);
        });
    }

    private _showOpponentWon(): void {
        this._battleResultLabelBoard = new BattleResultLabelBoard(
            this.viewWidth,
            this.viewHeight,
            'opponentWin',
            this.opponent.name
        );
        this._battleResultLabelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.applicationLayer.addChild(this._battleResultLabelBoard);

        this.whiteOut('opponent', () => {
            window.setTimeout(function () {
                dispatchEvent(Events.REQUEST_READY);
            }, 3000);
        });
    }

    private _showFalseStart(): void {
        if (this.battle.isFixed()) {
            const winnerName = this.battle.winner === Actor.PLAYER ?
                this.player.name :
                this.opponent.name;


            const resultType = this.battle.winner === Actor.PLAYER ?
                'playerWin' :
                'opponentWin';


            this._battleResultLabelBoard = new BattleResultLabelBoard(
                this.viewWidth,
                this.viewHeight,
                resultType,
                winnerName
            );
        } else {
            this._battleResultLabelBoard = new BattleResultLabelBoard(
                this.viewWidth,
                this.viewHeight,
                'falseStart'
            );
        }
        this._battleResultLabelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this.applicationLayer.addChild(this._battleResultLabelBoard);

        this._hueFilter.hue(180);
        this._brightnessFilter.brightness(0.5);

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 3000);
    }

    private _showDraw(): void {
        this.player.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

        this._battleResultLabelBoard = new BattleResultLabelBoard(
            this.viewWidth,
            this.viewHeight,
            'draw'
        );
        this._battleResultLabelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.applicationLayer.addChild(this._battleResultLabelBoard);

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 3000);
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
