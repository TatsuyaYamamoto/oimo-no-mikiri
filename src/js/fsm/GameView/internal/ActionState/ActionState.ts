import {dispatchEvent} from "../../../../../framework/EventUtils";
import Deliverable from "../../../../../framework/Deliverable";
import {getRandomInteger} from "../../../../../framework/utils";

import AbstractGameState from "../GameViewState";
import {Events} from "../../GameView";

import Signal from "../../../../texture/sprite/Signal";
import FalseStartCheck from "../../../../texture/sprite/text/FalseStartCheck";

import Actor from '../../../../models/Actor';

import {play} from "../../../../helper/MusicPlayer";

import {Ids as SoundIds} from '../../../../resources/sound';

import {GAME_PARAMETERS} from '../../../../Constants';

export interface EnterParams extends Deliverable {
    isFalseStarted?: { player?: boolean, opponent?: boolean }
}

abstract class ActionState extends AbstractGameState {
    private _signalTime: number;
    private _isSignaled: boolean;
    private _isJudging: boolean;
    private _attackTimeMap: Map<Actor, number>;

    private _signalSprite: Signal;
    private _playerFalseStartCheck: FalseStartCheck;
    private _opponentFalseStartCheck: FalseStartCheck;

    protected get signalTime(): number {
        return this._signalTime;
    }

    constructor(params) {
        super(params);

        // Bind this instance to class' abstract methods that can't define as bind property.
        this.bindKeyboardEvents = this.bindKeyboardEvents.bind(this);
        this.unbindKeyboardEvents = this.unbindKeyboardEvents.bind(this);
        this.onWindowTaped = this.onWindowTaped.bind(this);
    }

    /**
     * Return true if the battle is already signed.
     *
     * @return {boolean}
     */
    protected get isSignaled(): boolean {
        return this._isSignaled;
    }

    protected get signalSprite(): Signal {
        return this._signalSprite;
    }

    protected get playerFalseStartCheck(): FalseStartCheck {
        return this._playerFalseStartCheck;
    }

    protected get opponentFalseStartCheck(): FalseStartCheck {
        return this._opponentFalseStartCheck;
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._signalTime = this.createSignalTime();
        this._isSignaled = false;
        this._isJudging = false;
        this._attackTimeMap = new Map();

        this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        this._signalSprite = new Signal();
        this._signalSprite.position.set(this.viewWidth * 0.5, this.viewHeight * 0.4);
        this._signalSprite.hide();

        this._playerFalseStartCheck = new FalseStartCheck();
        this._playerFalseStartCheck.position.set(this.viewWidth * 0.1, this.viewHeight * 0.3);
        this._playerFalseStartCheck.visible = params.isFalseStarted && params.isFalseStarted.player;

        this._opponentFalseStartCheck = new FalseStartCheck();
        this._opponentFalseStartCheck.position.set(this.viewWidth * 0.9, this.viewHeight * 0.3);
        this._opponentFalseStartCheck.visible = params.isFalseStarted && params.isFalseStarted.opponent;

        this.bindKeyboardEvents();
        this.addClickWindowEventListener(this.onWindowTaped);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        this.unbindKeyboardEvents();
        this.removeClickWindowEventListener(this.onWindowTaped);
    }

    abstract bindKeyboardEvents(): void;

    abstract unbindKeyboardEvents(): void;

    abstract onWindowTaped(e: MouseEvent | TouchEvent): void;

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

        const attackTime = this.elapsedTimeMillis - this.signalTime;
        this._attackTimeMap.set(actor, attackTime);

        if (!this.isSignaled) {
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
        return !this.isSignaled && this.signalTime < this.elapsedTimeMillis;
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
     * Return true if provided actor already attacked.
     *
     * @param {Actor} actor
     * @return {boolean}
     */
    protected isAttacked = (actor: Actor): boolean => {
        return !!this._attackTimeMap.get(actor);
    };

    private _judge = (actor: Actor, attackTime: number): void => {
        console.log(`Judge attack. actor: ${actor}, time: ${attackTime}ms`);

        if (this._isJudging) {
            this._isJudging = false;
            console.log("=> draw.");
            play(SoundIds.SOUND_DRAW);
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
