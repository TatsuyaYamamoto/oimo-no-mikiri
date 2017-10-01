import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import {addEvents, removeEvents} from "../../../framework/EventUtils";

import ReadyState from "../game/ReadyState";
import ActionState from "../game/ActionState";
import ResultState from "../game/ResultState";

export enum Events {
    REQUEST_READY = 'GameViewState@REQUEST_READY',
    IS_READY = 'GameViewState@IS_READY',
    ACTION_SUCCESS = 'GameViewState@ACTION_SUCCESS',
    FALSE_START = 'GameViewState@FALSE_START',
}

class GameViewState extends ViewContainer {
    public static TAG = GameViewState.name;

    private _gameStateMachine: StateMachine;
    private _readyState: ReadyState;
    private _actionState: ActionState;
    private _resultState: ResultState;

    /**
     * @override
     */
    update(elapsedTime: number): void {
        super.update(elapsedTime);

        this._gameStateMachine.update(elapsedTime);
    }

    /**
     * @override
     */
    onEnter(): void {
        super.onEnter();

        this._readyState = new ReadyState();
        this._actionState = new ActionState();
        this._resultState = new ResultState();

        this._gameStateMachine = new StateMachine({
            [ReadyState.TAG]: this._readyState,
            [ActionState.TAG]: this._actionState,
            [ResultState.TAG]: this._resultState
        });

        this._gameStateMachine.init(ReadyState.TAG);

        addEvents({
            [Events.REQUEST_READY]: this._handleRequestReadyEvent,
            [Events.IS_READY]: this._handleIsReadyEvent,
            [Events.ACTION_SUCCESS]: this._handleActionSuccessEvent,
        });
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        removeEvents([
            Events.REQUEST_READY,
            Events.IS_READY,
            Events.ACTION_SUCCESS
        ])
    }

    /**
     *
     * @private
     */
    private _handleRequestReadyEvent = () => {
        this._gameStateMachine.change(ReadyState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleIsReadyEvent = () => {
        this._gameStateMachine.change(ActionState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleActionSuccessEvent = () => {
        this._gameStateMachine.change(ResultState.TAG);
    };
}

export default GameViewState;
