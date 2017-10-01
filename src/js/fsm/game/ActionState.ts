import ViewContainer from "../../../framework/ViewContainer";
import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";

import {Events} from "../views/GameViewState";
import {GAME_PARAMETERS, NPC_LEVELS} from "../../Constants";

export interface EnterParams extends Deliverable {
    level: NPC_LEVELS,
    round: number,
}

class ActionState extends ViewContainer {
    public static TAG = ActionState.name;

    private _signalTime: number = null;
    private _isTapActive: boolean = false;
    private _timeAfterSignal: number = null;

    /**
     * @override
     */
    update(elapsedTimeMillis: number): void {
        super.update(elapsedTimeMillis);
        this._startMeasurementIfAfterSignal();
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this.addClickWindowEventListener(this._handleTapWindow);
        
        this._signalTime = GAME_PARAMETERS.reaction_rate[params.level][params.round] * 1000;
        this._timeAfterSignal = 0;
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        this.removeClickWindowEventListener(this._handleTapWindow);
    }

    /**
     * Turn tap active flag on and start measurement of elapsed time, if it's after staring.
     *
     * @private
     */
    private _startMeasurementIfAfterSignal = () => {
        if (!this._isTapActive && this.elapsedTimeMillis > this._signalTime) {
            this._isTapActive = true;
            this._timeAfterSignal = performance.now();

            console.log("Change tap active.");
        }
    };

    /**
     * Handle player tap.
     * If it's active to tap, after signal time, dispatch {@link Events.DETERMINED_OUTCOME}.
     * Otherwise, it's dispatched {@link Event.FALSE_START}
     *
     * @private
     */
    private _handleTapWindow = () => {
        if (this._isTapActive) {
            const time = performance.now() - this._timeAfterSignal;
            console.log(`Tap! result time: ${time}ms`);
            dispatchEvent(Events.ACTION_SUCCESS);
        } else {
            console.log("It's fault to tap. play again.");
            dispatchEvent(Events.FALSE_START);
        }
    }
}

export default ActionState;
