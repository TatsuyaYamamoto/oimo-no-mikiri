import {dispatchEvent} from "../../../../framework/EventUtils";
import Deliverable from "../../../../framework/Deliverable";
import {getRandomInteger} from "../../../../framework/utils";

import AbstractGameState from "./GameViewState";
import {Events} from "../GameView";

import BackGround from "../../../texture/containers/BackGround";
import Signal from "../../../texture/sprite/Signal";

import {play} from "../../../helper/MusicPlayer";

import {Ids as SoundIds} from '../../../resources/sound';

export interface EnterParams extends Deliverable {
    autoOpponentAttackInterval?: number
}

class ActionState extends AbstractGameState {
    public static TAG = ActionState.name;

    private _signalTime: number;
    private _opponentAttackTime: number;

    private _isSignaled: boolean;
    private _isPlayerAttacked: boolean;
    private _isOpponentAttacked: boolean;

    private _background: BackGround;
    private _signalSprite: Signal;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);

        this._background.progress(elapsedMS);

        const shouldSign = !this._isSignaled && this._signalTime < this.elapsedTimeMillis;

        if (shouldSign) this._onSignaled();

        const shouldAutoAttack = this._opponentAttackTime &&
            !this._isOpponentAttacked
            && this._opponentAttackTime < this.elapsedTimeMillis;

        if (shouldAutoAttack) this._onAttackedByOpponent();

    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._signalTime = this._createSignalTime();
        this._opponentAttackTime = params.autoOpponentAttackInterval && this._signalTime + params.autoOpponentAttackInterval;

        this._isSignaled = false;
        this._isPlayerAttacked = false;
        this._isOpponentAttacked = false;

        this._background = new BackGround();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        this._signalSprite = new Signal();
        this._signalSprite.position.set(this.viewWidth * 0.5, this.viewHeight * 0.4);
        this._signalSprite.hide();

        this.backGroundLayer.addChild(
            this._background,
        );
        this.applicationLayer.addChild(
            this.oimo,
            this.player,
            this.opponent,
            this._signalSprite,
        );

        this.addClickWindowEventListener(this._onAttackedByPlayer);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        this.removeClickWindowEventListener(this._onAttackedByPlayer);
    }

    private _createSignalTime = (): number => {
        return getRandomInteger(3000, 5000);
    };

    private _onSignaled = () => {
        console.log("Signaled!");

        this._isSignaled = true;
        this._signalSprite.show();

        play(SoundIds.SOUND_HARISEN);
    };

    /**
     * Handle player tap.
     * If it's active to tap, after signal time, dispatch {@link Events.DETERMINED_OUTCOME}.
     * Otherwise, it's dispatched {@link Event.FALSE_START}
     *
     * @private
     */
    private _onAttackedByPlayer = () => {
        if (this._isOpponentAttacked) {
            return;
        }

        const attackTime = this.elapsedTimeMillis - this._signalTime;

        if (!this._isSignaled) {
            console.log(`It's fault tap. Player false-started. ${attackTime}ms`);
            dispatchEvent(Events.FALSE_START);
            return;
        }

        this._isPlayerAttacked = true;
        this._signalSprite.hide();

        console.log(`Tap! result time: ${attackTime}ms`);
        dispatchEvent(Events.ACTION_SUCCESS, {attackTime});
    };

    /**
     *
     * @private
     */
    private _onAttackedByOpponent = () => {
        if (this._isPlayerAttacked) {
            return;
        }

        const attackTime = this.elapsedTimeMillis - this._signalTime;

        if (!this._isSignaled) {
            console.log(`It's fault tap. Opponent false-started. ${attackTime}ms`);
            dispatchEvent(Events.FALSE_START);
            return;
        }

        this._isOpponentAttacked = true;
        this._signalSprite.hide();

        console.log(`Opponent attacked! ${attackTime}ms`);
        dispatchEvent(Events.ACTION_FAILURE);
    };
}

export default ActionState;
