import * as Mousetrap from 'mousetrap';

import Deliverable from "../../../../../framework/Deliverable";

import ActionState from "./ActionState";

import Actor from "../../../../models/Actor";

import BattleStatusBoard from "../../../../texture/containers/label/BattleStatusBoard";

import { requestAttack } from "../../../../helper/firebase";


export interface EnterParams extends Deliverable {
    battleLeft: number,
    signalTime: number;
    wins: { player: number, opponent: number }
    isFalseStarted?: { player?: boolean, opponent?: boolean }
}

class OnlineActionState extends ActionState {
    private _battleStatusBoard: BattleStatusBoard;
    private _playerAttachAreaRange: number;

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

        this._playerAttachAreaRange = this.viewWidth / 2;

        this._battleStatusBoard = new BattleStatusBoard(this.viewWidth, this.viewHeight);
        this._battleStatusBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.12);
        this._battleStatusBoard.battleLeft = params.battleLeft;
        this._battleStatusBoard.onePlayerWins = params.wins.player;
        this._battleStatusBoard.twoPlayerWins = params.wins.opponent;

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
    }

    /**
     * @override
     */
    bindKeyboardEvents() {
        Mousetrap.bind('a', () => {
            this.onAttacked(Actor.PLAYER);
        });
    }

    /**
     * @override
     */
    unbindKeyboardEvents() {
        Mousetrap.unbind('a');
    }

    /**
     *
     * @param e
     * @override
     */
    onWindowTaped(e: MouseEvent | TouchEvent): void {
        this.onAttacked(Actor.PLAYER);
    }

    /**
     * Fired when provided actor requests to attack.
     *
     * @param {Actor} actor
     * @override
     */
    protected onAttacked = (actor: Actor): void => {
        if (this.isAttacked(actor)) {
            return;
        }

        const attackTime = this.elapsedTimeMillis - this.signalTime;
        this._attackTimeMap.set(actor, attackTime);

        console.log(`On attacked. attackTime: ${attackTime}`);

        // Don't judge whether the attack time is false start or not in client side.
        requestAttack(attackTime);
    };
}

export default OnlineActionState;
