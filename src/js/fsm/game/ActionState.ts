import * as anime from 'animejs'

import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";
import {getRandomInteger} from "../../../framework/utils";

import AbstractGameState from "./AbstractGameState";
import {Events} from "../views/GameViewState";

import GameBackground from "../../texture/sprite/background/GameBackground";
import Signal from "../../texture/sprite/Signal";

import {GAME_PARAMETERS, NPC_LEVELS} from "../../Constants";

export interface EnterParams extends Deliverable {
    level: NPC_LEVELS,
    round: number,
}

class ActionState extends AbstractGameState {
    public static TAG = ActionState.name;

    private _isTapActive: boolean;

    private _signalTime: number;
    private _npcAttackTime: number;

    private _isSignaled: boolean;
    private _isNpcAttacked: boolean;

    private _background: GameBackground;
    private _signalSprite: Signal;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);

        if (!this._isSignaled && this._signalTime < this.elapsedTimeMillis) {
            console.log("Signaled!");
            this._isSignaled = true;
            this._signalSprite.visible = true;
        }

        if (!this._isNpcAttacked && this._npcAttackTime < this.elapsedTimeMillis) {
            this._isNpcAttacked = true;
            console.log(`NPC attacked! ${this.elapsedTimeMillis - this._signalTime}ms`);
            this._handleNpcAttack();
        }

    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this.addClickWindowEventListener(this._handleTapWindow);

        this._signalTime = this._createSignalTime();
        this._npcAttackTime = this._signalTime + GAME_PARAMETERS.reaction_rate[params.level][params.round] * 1000;
        this._isTapActive = false;
        this._isSignaled = false;
        this._isNpcAttacked = false;

        this._background = new GameBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        this._signalSprite = new Signal();
        this._signalSprite.position.set(this.viewWidth * 0.5, this.viewHeight * 0.4);
        this._signalSprite.visible = false;

        this.backGroundLayer.addChild(
            this._background,
        );
        this.applicationLayer.addChild(
            this.oimo,
            this.player,
            this.opponent,
            this._signalSprite,
        );
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        this.removeClickWindowEventListener(this._handleTapWindow);
    }

    private _createSignalTime = (): number => {
        return getRandomInteger(3000, 5000);
    };

    /**
     * Handle player tap.
     * If it's active to tap, after signal time, dispatch {@link Events.DETERMINED_OUTCOME}.
     * Otherwise, it's dispatched {@link Event.FALSE_START}
     *
     * @private
     */
    private _handleTapWindow = () => {
        if (this._isNpcAttacked) {
            return;
        }

        this._signalSprite.visible = false;

        if (this._isSignaled) {
            const time = this.elapsedTimeMillis - this._signalTime;
            console.log(`Tap! result time: ${time}ms`);
            dispatchEvent(Events.ACTION_SUCCESS, {time});
            return;
        }

        console.log("It's fault to tap. play again.");
        dispatchEvent(Events.FALSE_START);
    };

    /**
     *
     * @private
     */
    private _handleNpcAttack = () => {
        this._signalSprite.visible = false;
        dispatchEvent(Events.ACTION_FAILURE);
    };
}

export default ActionState;
