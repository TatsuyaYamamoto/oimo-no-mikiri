import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import ReadyState from "../game/ReadyState";
import ActionState, {EnterParams as ActionStateEnterParams} from "../game/ActionState";
import ResultState from "../game/ResultState";

import {Events as ApplicationEvents} from '../ApplicationState';
import {NPC_LEVELS} from "../../Constants";

export enum Events {
    REQUEST_READY = 'GameViewState@REQUEST_READY',
    IS_READY = 'GameViewState@IS_READY',
    ACTION_SUCCESS = 'GameViewState@ACTION_SUCCESS',
    FALSE_START = 'GameViewState@FALSE_START',
}

class GameViewState extends ViewContainer {
    public static TAG = GameViewState.name;

    private static TOTAL_ROUND = 5;

    private _gameStateMachine: StateMachine;
    private _readyState: ReadyState;
    private _actionState: ActionState;
    private _resultState: ResultState;

    private _gameLevel: NPC_LEVELS = null;
    private _roundNumber: number = null;
    private _isFalseStarted: boolean = null;
    private _results = {};


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
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._gameLevel = NPC_LEVELS.MIDDLE;
        this._roundNumber = 1;
        this._isFalseStarted = false;

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
            [Events.FALSE_START]: this._handleFalseStartEvent,
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
        console.log("round number", this._roundNumber);
        if (this._roundNumber > GameViewState.TOTAL_ROUND) {
            dispatchEvent(ApplicationEvents.GAME_OVER);
        } else {
            this._gameStateMachine.change(ReadyState.TAG);
        }
    };

    /**
     *
     * @private
     */
    private _handleIsReadyEvent = () => {
        this._gameStateMachine.change(ActionState.TAG, (source: Deliverable): ActionStateEnterParams => {
            return {
                level: this._gameLevel,
                round: this._roundNumber
            }
        });
    };

    /**
     *
     * @private
     */
    private _handleActionSuccessEvent = (e: CustomEvent) => {
        console.log(e.detail);
        this._resultState[this._roundNumber] = e.detail.time;
        this._isFalseStarted = false;
        this._roundNumber += 1;
        this._gameStateMachine.change(ResultState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleFalseStartEvent = () => {
        if (this._isFalseStarted) {
            dispatchEvent(ApplicationEvents.GAME_OVER);
        } else {
            this._isFalseStarted = true;
            this._gameStateMachine.change(ReadyState.TAG);
        }
    }
}

export default GameViewState;
