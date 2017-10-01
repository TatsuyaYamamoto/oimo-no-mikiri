import State from "./State";
import Deliverable from "./Deliverable";

/**
 * Function type to convert {@link Deliverable} instance provided from {@link State#onExit}.
 */
export type DeliverableConverter = (source?: Deliverable) => Deliverable;

/**
 * Handle {@code State}.
 *
 * @class
 */
class StateMachine {
    private _currentState: State;
    private _states: Map<String, State> = new Map();

    constructor(states: { [key: string]: State }) {
        Object.keys(states).forEach((key) => {
            this._states.set(key, states[key]);
        });
    }

    public update(elapsedTime: number): void {
        this._currentState.update(elapsedTime);
    }

    public init(firstStateTag, params?: Deliverable): void {
        this._currentState = this._states.get(firstStateTag);
        this._currentState.onEnter(params);
    }

    /**
     * Change state.
     * If it has {@param converter}, converted {@link Deliverable} provided from {@link State#onExit} is set as args of {@State#onEnter}.
     *
     * @param {string} stateTag
     * @param {DeliverableConverter} converter
     */
    public change(stateTag: string, converter?: DeliverableConverter): void {
        const nextState = this._states.get(stateTag);
        if (!nextState) {
            throw new Error('Provided tag is not supported on the state machine.');
        }
        const delivered = this._currentState.onExit() || {};

        this._currentState = nextState;
        this._currentState.onEnter(converter ?
            converter(delivered) :
            delivered
        );
    }
}

export default StateMachine;
