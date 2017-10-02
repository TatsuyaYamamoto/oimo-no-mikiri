import ViewContainer from "../../../framework/ViewContainer";
import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";
import {getRandomInteger} from "../../../framework/utils";

import {Events} from "../views/GameViewState";

import GameBackground from "../../texture/sprite/background/GameBackground";
import Signal from "../../texture/sprite/Signal";

import {GAME_PARAMETERS, NPC_LEVELS} from "../../Constants";

export interface EnterParams extends Deliverable {
    level: NPC_LEVELS,
    round: number,
}

class ActionState extends ViewContainer {
    public static TAG = ActionState.name;

    private _isTapActive: boolean;

    private _signalTime: number;
    private _npcAttackTime: number;

    private _isSignaled: boolean;
    private _isNpcAttacked: boolean;

    private _signalSprite: Signal;

    private _background: GameBackground;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);

        if (!this._isSignaled && this._signalTime < this.elapsedTimeMillis) {
            this._isSignaled = true;
            console.log("Signaled!");
            this.applicationLayer.addChild(this._signalSprite);
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

        this._signalSprite = new Signal();
        this._signalSprite.position.set(this.viewWidth * 0.5, this.viewHeight * 0.4);

        this.backGroundLayer.addChild(
            this._background,
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

        this.applicationLayer.removeChild(this._signalSprite);

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
        this.applicationLayer.removeChild(this._signalSprite);
        dispatchEvent(Events.ACTION_FAILURE);
    };
}

export default ActionState;
