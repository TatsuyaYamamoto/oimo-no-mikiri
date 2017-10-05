import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import ReadyState from "../game/ReadyState";
import ActionState, {EnterParams as ActionStateEnterParams} from "../game/ActionState";
import ResultState from "../game/ResultState";
import GameOverState, {EnterParams as GameOverEnterParams} from "../game/GameOverState";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";

import {NPC_LEVELS} from "../../Constants";
import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Uchicchi from "../../texture/sprite/character/Uchicchi";

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
    private _roundNumber: number;
    private _isFalseStarted: boolean;
    private _results: { [roundNumber: string]: number };

    private _player: Player;
    private _opponent: Opponent;


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
        this._results = {};

        this._player = new Hanamaru();
        this._opponent = new Uchicchi();

        this._readyState = new ReadyState(this._player, this._opponent);
        this._actionState = new ActionState(this._player, this._opponent);
        this._resultState = new ResultState(this._player, this._opponent);
        this._gameOverState = new GameOverState(this._player, this._opponent);

        this._gameStateMachine = new StateMachine({
            [ReadyState.TAG]: this._readyState,
            [ActionState.TAG]: this._actionState,
            [ResultState.TAG]: this._resultState,
            [GameOverState.TAG]: this._gameOverState
        });

        addEvents({
            [Events.REQUEST_READY]: this._handleRequestReadyEvent,
            [Events.IS_READY]: this._handleIsReadyEvent,
            [Events.ACTION_SUCCESS]: this._handleActionSuccessEvent,
            [Events.ACTION_FAILURE]: this._handleActionFailureEvent,
            [Events.FALSE_START]: this._handleFalseStartEvent,
            [Events.FIXED_RESULT]: this._handleFixedResultEvent,
        });

        this._gameStateMachine.init(ReadyState.TAG);
        this.applicationLayer.addChild(this._readyState);
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
            this.applicationLayer.removeChildren();
            this.applicationLayer.addChild(this._readyState);
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
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._actionState);
    };

    /**
     *
     * @private
     */
    private _handleActionSuccessEvent = (e: CustomEvent) => {
        this._results[this._roundNumber] = e.detail.time;
        this._isFalseStarted = false;
        this._roundNumber += 1;

        this._gameStateMachine.change(ResultState.TAG);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._resultState);
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
            this.applicationLayer.removeChildren();
            this.applicationLayer.addChild(this._readyState);
        }
    };

    /**
     *
     * @private
     */
    private _handleFixedResultEvent = () => {
        // set max best time as constants.
        const times: number[] = Object.keys(this._results).map((roundNumber) => this._results[roundNumber]);
        times.push(99 * 1000);

        const bestTime = Math.max(...times);
        const round = this._roundNumber;

        this._gameStateMachine.change(GameOverState.TAG, () => {
            const params: GameOverEnterParams = {
                bestTime,
                round
            };
            return params;
        });
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._gameOverState);
    };
}

export default GameViewState;
