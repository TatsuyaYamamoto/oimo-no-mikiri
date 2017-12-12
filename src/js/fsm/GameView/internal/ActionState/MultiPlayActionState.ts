import * as Mousetrap from 'mousetrap';

import Deliverable from "../../../../../framework/Deliverable";

import ActionState from "./ActionState";

import Actor from "../../../../models/Actor";
import BattleStatusBoard from "../../../../texture/containers/label/BattleStatusBoard";


export interface EnterParams extends Deliverable {
    battleLeft: number,
    wins: { onePlayer: number, twoPlayer: number }
    isFalseStarted?: { player?: boolean, opponent?: boolean }
}

class MultiPlayActionState extends ActionState {
    private _battleStatusBoard: BattleStatusBoard;

    protected get battleStatusBoard(): BattleStatusBoard {
        return this._battleStatusBoard;
    }


    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);

        this.shouldSign() && this.onSignaled();
    }

    /**
     *
     * @param {EnterParams} params
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._battleStatusBoard = new BattleStatusBoard(this.viewWidth, this.viewHeight);
        this._battleStatusBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.12);
        this._battleStatusBoard.battleLeft = params.battleLeft;
        this._battleStatusBoard.onePlayerWins = params.wins.onePlayer;
        this._battleStatusBoard.twoPlayerWins = params.wins.twoPlayer;

        this.backGroundLayer.addChild(
            this.background,
        );
        this.applicationLayer.addChild(
            this.oimo,
            this.player,
            this.opponent,
            this.playerFalseStartCheck,
            this.opponentFalseStartCheck,
            this.signalSprite,
            this.battleStatusBoard,
        );

        Mousetrap.bind('a', () => {
            this.onAttacked(Actor.PLAYER);
        });
        Mousetrap.bind('l', () => {
            this.onAttacked(Actor.OPPONENT);
        });
    }

    /**
     * @override
     */
    bindKeyboardEvents() {
        Mousetrap.bind('a', () => {
            this.onAttacked(Actor.PLAYER);
        });
        Mousetrap.bind('l', () => {
            this.onAttacked(Actor.OPPONENT);
        });
    }

    /**
     * @override
     */
    unbindKeyboardEvents() {
        Mousetrap.unbind('a');
        Mousetrap.unbind('l');
    }

    /**
     *
     * @param e
     * @override
     */
    onWindowTaped(e: MouseEvent): void {
        if (e.clientX < this.viewWidth / 2) {
            this.onAttacked(Actor.PLAYER);
        } else {
            this.onAttacked(Actor.OPPONENT);
        }
    }
}

export default MultiPlayActionState;
