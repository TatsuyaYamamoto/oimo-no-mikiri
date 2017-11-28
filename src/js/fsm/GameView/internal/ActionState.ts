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

import {GAME_PARAMETERS} from '../../../Constants';

export interface EnterParams extends Deliverable {
    autoOpponentAttackInterval?: number,
    isFalseStarted?: { player?: boolean, opponent?: boolean }
}

class ActionState extends AbstractGameState {
    public static TAG = ActionState.name;

    private _signalTime: number;
    private _isSignaled: boolean;
    private _isJudging: boolean;
    private _attackTimeMap: Map<Actor, number>;
    private _autoAttackTime: number;

    private _signalSprite: Signal;
    private _playerFalseStartCheck: FalseStartCheck;
    private _opponentFalseStartCheck: FalseStartCheck;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);

        this.shouldSign() && this.onSignaled();

        this.shouldAutoAttack() && this.onAttacked(Actor.OPPONENT);
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._signalTime = this.createSignalTime();
        this._isSignaled = false;
        this._isJudging = false;
        this._autoAttackTime = params.autoOpponentAttackInterval && this._signalTime + params.autoOpponentAttackInterval;
        this._attackTimeMap = new Map();

        this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        this._signalSprite = new Signal();
        this._signalSprite.position.set(this.viewWidth * 0.5, this.viewHeight * 0.4);
        this._signalSprite.hide();

        this._playerFalseStartCheck = new FalseStartCheck();
        this._playerFalseStartCheck.position.set(this.viewWidth * 0.2, this.viewHeight * 0.2);
        this._playerFalseStartCheck.visible = params.isFalseStarted && params.isFalseStarted.player;

        this._opponentFalseStartCheck = new FalseStartCheck();
        this._opponentFalseStartCheck.position.set(this.viewWidth * 0.8, this.viewHeight * 0.2);
        this._opponentFalseStartCheck.visible = params.isFalseStarted && params.isFalseStarted.opponent;


        this.backGroundLayer.addChild(
            this.background,
        );
        this.applicationLayer.addChild(
            this.oimo,
            this.player,
            this.opponent,
            this._playerFalseStartCheck,
            this._opponentFalseStartCheck,
            this._signalSprite
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

    /**
     * Fired when attack of the battle is available.
     */
    protected onSignaled = () => {
        console.log("Signaled!");

        this._isSignaled = true;
        this._signalSprite.show();

        play(SoundIds.SOUND_HARISEN);
    };

    /**
     * Fired when provided actor requests to attack.
     *
     * @param {Actor} actor
     */
    protected onAttacked = (actor: Actor): void => {
        if (this.isAttacked(actor)) {
            return;
        }

        const attackTime = this.elapsedTimeMillis - this._signalTime;
        this._attackTimeMap.set(actor, attackTime);

        if (!this.isSignaled()) {
            console.log(`It's fault tap. actor: ${actor}, time: ${attackTime}ms.`);

            play(SoundIds.SOUND_FALSE_START);
            dispatchEvent(Events.FALSE_START, {actor});
            return;
        }

        this._judge(actor, attackTime);
    };

    /**
     * Return true if player and opponent' attack is available.
     *
     * @return {boolean}
     */
    protected shouldSign = (): boolean => {
        return !this._isSignaled && this._signalTime < this.elapsedTimeMillis;
    };

    /**
     * Return true if the opponent is NPC and it's time to attack automatically.
     *
     * @return {boolean}
     */
    protected shouldAutoAttack = (): boolean => {
        return this._autoAttackTime &&
            !this.isAttacked(Actor.OPPONENT)
            && this._autoAttackTime < this.elapsedTimeMillis;
    };

    /**
     * Create time that the battle signs, attack is available.
     *
     * @return {number}
     */
    protected createSignalTime = (): number => {
        return getRandomInteger(3000, 5000);
    };

    /**
     * Return true if the battle is already signed.
     *
     * @return {boolean}
     */
    protected isSignaled = (): boolean => {
        return this._isSignaled;
    };

    /**
     * Return true if provided actor already attacked.
     *
     * @param {Actor} actor
     * @return {boolean}
     */
    protected isAttacked = (actor: Actor): boolean => {
        return !!this._attackTimeMap.get(actor);
    };

    private _onAttackedByPlayer = () => {
        this.onAttacked(Actor.PLAYER);
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
        }, GAME_PARAMETERS.acceptable_attack_time_distance)
    }
}

export default ActionState;
