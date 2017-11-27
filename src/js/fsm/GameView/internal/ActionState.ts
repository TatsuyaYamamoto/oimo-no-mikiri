import {dispatchEvent} from "../../../../framework/EventUtils";
import Deliverable from "../../../../framework/Deliverable";
import {getRandomInteger} from "../../../../framework/utils";

import AbstractGameState from "./GameViewState";
import {Events} from "../GameView";

import Signal from "../../../texture/sprite/Signal";
import FalseStartCheck from "../../../texture/sprite/text/FalseStartCheck";

import Actor from '../../../models/Actor';

import {play} from "../../../helper/MusicPlayer";

import {Ids as SoundIds} from '../../../resources/sound';

export interface EnterParams extends Deliverable {
    autoOpponentAttackInterval?: number,
    isFalseStarted?: { player?: boolean, opponent?: boolean }
}

const ACCEPTABLE_ATTACK_TIME_DISTANCE = 16; // [ms]

class ActionState extends AbstractGameState {
    public static TAG = ActionState.name;

    private _signalTime: number;
    private _isSignaled: boolean;
    private _isJudging: boolean;
    private _opponentAttackTime: number;
    private _isOpponentAttacked: boolean;

    private _signalSprite: Signal;
    private _playerFalseStartCheck: FalseStartCheck;
    private _opponentFalseStartCheck: FalseStartCheck;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);

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
        this._isSignaled = false;
        this._isJudging = false;
        this._opponentAttackTime = params.autoOpponentAttackInterval && this._signalTime + params.autoOpponentAttackInterval;
        this._isOpponentAttacked = false;

        this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        this._signalSprite = new Signal();
        this._signalSprite.position.set(this.viewWidth * 0.5, this.viewHeight * 0.4);
        this._signalSprite.hide();

        this._playerFalseStartCheck = new FalseStartCheck();
        this._playerFalseStartCheck.position.set(this.viewWidth * 0.2, this.viewHeight * 0.2);

        this._opponentFalseStartCheck = new FalseStartCheck();
        this._opponentFalseStartCheck.position.set(this.viewWidth * 0.8, this.viewHeight * 0.2);

        this.backGroundLayer.addChild(
            this.background,
        );
        this.applicationLayer.addChild(
            this.oimo,
            this.player,
            this.opponent,
            this._signalSprite
        );

        if (params.isFalseStarted && params.isFalseStarted.player) {
            this.applicationLayer.addChild(this._playerFalseStartCheck);
        }

        if (params.isFalseStarted && params.isFalseStarted.opponent) {
            this.applicationLayer.addChild(this._opponentFalseStartCheck);
        }

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
        // TODO: Exclusive process

        const attackTime = this.elapsedTimeMillis - this._signalTime;

        if (!this._isSignaled) {
            console.log(`It's fault tap. Player false-started. ${attackTime}ms`);

            play(SoundIds.SOUND_FALSE_START);
            dispatchEvent(Events.FALSE_START, {actor: Actor.PLAYER});
            return;
        }

        // play(SoundIds.SOUND_ATTACK);
        // this._signalSprite.hide();

        this._judge(Actor.PLAYER, attackTime);
    };

    /**
     *
     * @private
     */
    private _onAttackedByOpponent = () => {
        // TODO: Exclusive process

        const attackTime = this.elapsedTimeMillis - this._signalTime;

        if (!this._isSignaled) {
            console.log(`It's fault tap. Opponent false-started. ${attackTime}ms`);

            play(SoundIds.SOUND_FALSE_START);
            dispatchEvent(Events.FALSE_START, {actor: Actor.OPPONENT});
            return;
        }

        // play(SoundIds.SOUND_ATTACK);
        this._isOpponentAttacked = true;
        // this._signalSprite.hide();

        this._judge(Actor.OPPONENT, attackTime);
    };

    private _judge = (actor: Actor, attackTime: number): void => {
        console.log(`Judge attack. actor: ${actor}, time: ${attackTime}ms`);

        if (this._isJudging) {
            this._isJudging = false;
            console.log("=> draw.");
            dispatchEvent(Events.DRAW);
            return;
        }

        this._isJudging = true;
        setTimeout(() => {
            if (this._isJudging) {
                console.log(`=> Succeed attack! actor: ${actor}, time: ${attackTime}ms`);
                play(SoundIds.SOUND_ATTACK);
                dispatchEvent(Events.ATTACK_SUCCESS, {actor, attackTime});
            }
        }, ACCEPTABLE_ATTACK_TIME_DISTANCE)
    }
}

export default ActionState;
