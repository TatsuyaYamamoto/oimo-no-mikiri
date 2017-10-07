import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import ReadyState from "../game/ReadyState";
import ActionState, {EnterParams as ActionStateEnterParams} from "../game/ActionState";
import ResultState, {EnterParams as ResultEnterParams} from "../game/result/ResultState";
import DrawState from "../game/result/DrawState";
import PlayerWinState from "../game/result/PlayerWinState";
import OpponentWinState from "../game/result/OpponentWinState";
import FalseStartedState, {EnterParams as FalseStartedStateEnterParams} from "../game/result/FalseStartedState";
import GameOverState, {EnterParams as GameOverEnterParams} from "../game/GameOverState";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";

import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Shitake from "../../texture/sprite/character/Shitake";
import LittleDaemon from "../../texture/sprite/character/LittleDeamon";

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
    private _drawResultState: ResultState;
    private _playerWinResultState: ResultState;
    private _opponentWinResultState: ResultState;
    private _falseStartedResultState: ResultState;
    private _gameOverState: GameOverState;

    private _gameLevel: NPC_LEVELS = null;
    private _roundLength: number;
    private _roundNumber: number;
    private _isFalseStarted: boolean;
    private _isGameFailed: boolean;
    private _results: { [roundNumber: string]: number };

    private _player: Player;
    private _opponents: {
        [roundNumber: number]: Opponent
    };


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
        this._isGameFailed = false;
        this._results = {};

        this._player = new Hanamaru();
        this._player.playWait();

        this._opponents = {};
        this._opponents[1] = new Shitake();
        this._opponents[2] = new LittleDaemon();
        this._opponents[3] = new Uchicchi();
        this._opponents[4] = new Shitake();
        this._opponents[5] = new LittleDaemon();

        this._opponents[1].playWait();

        this._readyState = new ReadyState(this._player, this._opponents[1]);
        this._actionState = new ActionState(this._player, this._opponents[1]);
        this._drawResultState = new DrawState(this._player, this._opponents[1]);
        this._playerWinResultState = new PlayerWinState(this._player, this._opponents[1]);
        this._opponentWinResultState = new OpponentWinState(this._player, this._opponents[1]);
        this._falseStartedResultState = new FalseStartedState(this._player, this._opponents[1]);
        this._gameOverState = new GameOverState(this._player, this._opponents[1]);

        this._gameStateMachine = new StateMachine({
            [ReadyState.TAG]: this._readyState,
            [ActionState.TAG]: this._actionState,
            [DrawState.TAG]: this._drawResultState,
            [PlayerWinState.TAG]: this._playerWinResultState,
            [OpponentWinState.TAG]: this._opponentWinResultState,
            [FalseStartedState.TAG]: this._falseStartedResultState,
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

        // is failed previous match?
        if (this._isGameFailed) {
            dispatchEvent(Events.FIXED_RESULT);
            return;
        }

        // is finished every match?
        if (this._roundNumber > this._roundLength) {
            dispatchEvent(Events.FIXED_RESULT);
            return;
        }

        this._updateCurrentOpponent();

        this._gameStateMachine.change(ReadyState.TAG);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._readyState);

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

        this._gameStateMachine.change(PlayerWinState.TAG);

        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._playerWinResultState);
    };

    /**
     *
     * @private
     */
    private _handleActionFailureEvent = () => {
        this._gameStateMachine.change(OpponentWinState.TAG);
        this._isGameFailed = true;

        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._opponentWinResultState);
    };

    /**
     *
     * @private
     */
    private _handleFalseStartEvent = () => {
        this._isGameFailed = this._isFalseStarted;

        this._gameStateMachine.change(FalseStartedState.TAG, () => {
            const params: FalseStartedStateEnterParams = {
                actor: 'player',
                isEnded: this._isGameFailed,
            };
            return params;
        });

        this._isFalseStarted = true;

        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._falseStartedResultState);
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

    private _updateCurrentOpponent = (): void => {
        const opponent = this._opponents[this._roundNumber];

        this._readyState.setOpponent(opponent);
        this._actionState.setOpponent(opponent);
        this._drawResultState.setOpponent(opponent);
        this._playerWinResultState.setOpponent(opponent);
        this._opponentWinResultState.setOpponent(opponent);
        this._falseStartedResultState.setOpponent(opponent);
        this._gameOverState.setOpponent(opponent);
    };
}

export default GameViewState;
