import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import ReadyState from "../game/ReadyState";
import ActionState, {EnterParams as ActionStateEnterParams} from "../game/ActionState";
import ResultState from "../game/ResultState";
import GameOverState from "../game/GameOverState";

import {NPC_LEVELS} from "../../Constants";

export enum Events {
    REQUEST_READY = 'GameViewState@REQUEST_READY',
    IS_READY = 'GameViewState@IS_READY',
    ACTION_SUCCESS = 'GameViewState@ACTION_SUCCESS',
    ACTION_FAILURE = 'GameViewState@ACTION_FAILURE',
    FALSE_START = 'GameViewState@FALSE_START',
    FIXED_RESULT = 'GameViewState@FIXED_RESULT',
}

export interface EnterParams extends Deliverable {
    level: NPC_LEVELS,
    roundLength: number,
}

class GameViewState extends ViewContainer {
    public static TAG = GameViewState.name;

    private _gameStateMachine: StateMachine;
    private _readyState: ReadyState;
    private _actionState: ActionState;
    private _resultState: ResultState;
    private _gameOverState: GameOverState;

    private _gameLevel: NPC_LEVELS = null;
    private _roundLength: number;
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
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._gameLevel = params.level;
        this._roundLength = params.roundLength;
        this._roundNumber = 1;
        this._isFalseStarted = false;

        this._readyState = new ReadyState();
        this._actionState = new ActionState();
        this._resultState = new ResultState();
        this._gameOverState = new GameOverState();

        this._gameStateMachine = new StateMachine({
            [ReadyState.TAG]: this._readyState,
            [ActionState.TAG]: this._actionState,
            [ResultState.TAG]: this._resultState,
            [GameOverState.TAG]: this._gameOverState
        });

        this._gameStateMachine.init(ReadyState.TAG);

        addEvents({
            [Events.REQUEST_READY]: this._handleRequestReadyEvent,
            [Events.IS_READY]: this._handleIsReadyEvent,
            [Events.ACTION_SUCCESS]: this._handleActionSuccessEvent,
            [Events.ACTION_FAILURE]: this._handleActionFailureEvent,
            [Events.FALSE_START]: this._handleFalseStartEvent,
            [Events.FIXED_RESULT]: this._handleFixedResultEvent,
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
            Events.ACTION_SUCCESS,
            Events.ACTION_FAILURE,
            Events.FALSE_START,
            Events.FIXED_RESULT,
        ])
    }

    /**
     *
     * @private
     */
    private _handleRequestReadyEvent = () => {
        console.log("round number", this._roundNumber);
        if (this._roundNumber > this._roundLength) {
            dispatchEvent(Events.FIXED_RESULT);
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
        this._resultState[this._roundNumber] = e.detail.time;
        this._isFalseStarted = false;
        this._roundNumber += 1;
        this._gameStateMachine.change(ResultState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleActionFailureEvent = () => {
        dispatchEvent(Events.FIXED_RESULT);
    };

    /**
     *
     * @private
     */
    private _handleFalseStartEvent = () => {
        if (this._isFalseStarted) {
            dispatchEvent(Events.FIXED_RESULT);
        } else {
            this._isFalseStarted = true;
            this._gameStateMachine.change(ReadyState.TAG);
        }
    };

    /**
     *
     * @private
     */
    private _handleFixedResultEvent = () => {
        this._gameStateMachine.change(GameOverState.TAG);
    };
}

export default GameViewState;
