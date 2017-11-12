import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import ReadyState from "./internal/ReadyState";
import ActionState, {EnterParams as ActionStateEnterParams} from "./internal/ActionState";
import ResultState from "./internal/ResultState";
import DrawState from "./internal/ResultState/DrawState";
import PlayerWinState from "./internal/ResultState/PlayerWinState";
import OpponentWinState from "./internal/ResultState/OpponentWinState";
import FalseStartedState, {EnterParams as FalseStartedStateEnterParams} from "./internal/ResultState/FalseStartedState";
import OverState, {EnterParams as OverEnterParams} from "./internal/OverState";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";

import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Shitake from "../../texture/sprite/character/Shitake";
import LittleDaemon from "../../texture/sprite/character/LittleDeamon";
import Wataame from "../../texture/sprite/character/Wataame";

import {NPC_LEVELS} from "../../Constants";

export enum Events {
    REQUEST_READY = 'GameView@REQUEST_READY',
    IS_READY = 'GameView@IS_READY',
    ACTION_SUCCESS = 'GameView@ACTION_SUCCESS',
    ACTION_FAILURE = 'GameView@ACTION_FAILURE',
    FALSE_START = 'GameView@FALSE_START',
    FIXED_RESULT = 'GameView@FIXED_RESULT',
    RESTART_GAME = 'GameView@RESTART_GAME',
}

export interface EnterParams extends Deliverable {
    level: NPC_LEVELS,
    roundLength: number,
}

class GameViewState extends ViewContainer {
    public static TAG = GameViewState.name;

    private _gameStateMachine: StateMachine<ViewContainer>;

    private _gameLevel: NPC_LEVELS = null;
    private _roundLength: number;
    private _roundNumber: number;
    private _isFalseStarted: boolean;
    private _isGameFailed: boolean;
    private _results: { [roundNumber: string]: number };

    private _player: Player;
    private _opponents: {
        [roundNumber: number]: Opponent
    } = Object.create(null);

    public get player(): Player {
        return this._player;
    }

    public get opponent(): Opponent {
        return this._opponents[this._roundNumber];
    }


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
        this._initState();

        this._player = new Hanamaru();

        this._opponents[1] = new Wataame();
        this._opponents[2] = new LittleDaemon();
        this._opponents[3] = new Shitake();
        this._opponents[4] = new Uchicchi();
        this._opponents[5] = new LittleDaemon();

        this._gameStateMachine = new StateMachine({
            [ReadyState.TAG]: new ReadyState(this),
            [ActionState.TAG]:new ActionState(this),
            [DrawState.TAG]: new DrawState(this),
            [PlayerWinState.TAG]: new PlayerWinState(this),
            [OpponentWinState.TAG]: new OpponentWinState(this),
            [FalseStartedState.TAG]: new FalseStartedState(this),
            [OverState.TAG]: new OverState(this)
        });

        addEvents({
            [Events.REQUEST_READY]: this._handleRequestReadyEvent,
            [Events.IS_READY]: this._handleIsReadyEvent,
            [Events.ACTION_SUCCESS]: this._handleActionSuccessEvent,
            [Events.ACTION_FAILURE]: this._handleActionFailureEvent,
            [Events.FALSE_START]: this._handleFalseStartEvent,
            [Events.FIXED_RESULT]: this._handleFixedResultEvent,
            [Events.RESTART_GAME]: this._handleRestartGameEvent,
        });

        dispatchEvent(Events.REQUEST_READY);
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
            Events.RESTART_GAME,
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

        this._player.playWait();
        this._opponents[this._roundNumber].playWait();

        this._gameStateMachine.change(ReadyState.TAG);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._gameStateMachine.current);

    };

    /**
     *
     * @private
     */
    private _handleIsReadyEvent = () => {
        this._gameStateMachine.change<ActionStateEnterParams>(ActionState.TAG, {
            level: this._gameLevel,
            round: this._roundNumber
        });
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._gameStateMachine.current);
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
        this.applicationLayer.addChild(this._gameStateMachine.current);
    };

    /**
     *
     * @private
     */
    private _handleActionFailureEvent = () => {
        this._isGameFailed = true;

        this._gameStateMachine.change(OpponentWinState.TAG);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._gameStateMachine.current);
    };

    /**
     *
     * @private
     */
    private _handleFalseStartEvent = () => {
        this._isGameFailed = this._isFalseStarted;

        this._gameStateMachine.change<FalseStartedStateEnterParams>(FalseStartedState.TAG, {
            actor: 'player',
            isEnded: this._isGameFailed,
        });

        this._isFalseStarted = true;

        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._gameStateMachine.current);
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

        this._gameStateMachine.change<OverEnterParams>(OverState.TAG, {bestTime, round});
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._gameStateMachine.current);
    };

    private _handleRestartGameEvent = () => {
        this._initState();
        dispatchEvent(Events.REQUEST_READY);
    };

    private _initState = () => {
        this._roundNumber = 1;
        this._isFalseStarted = false;
        this._isGameFailed = false;
        this._results = {};
    };
}

export default GameViewState;
