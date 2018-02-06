import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";

import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Ruby from "../../texture/sprite/character/Ruby";

import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Shitake from "../../texture/sprite/character/Shitake";
import LittleDaemon from "../../texture/sprite/character/LittleDeamon";
import Wataame from "../../texture/sprite/character/Wataame";
import EnemyRuby from "../../texture/sprite/character/EnemyRuby";

import { trackPageView, VirtualPageViews } from "../../helper/tracker";

export enum Events {
    REQUEST_READY = 'GameView@REQUEST_READY',
    IS_READY = 'GameView@IS_READY',
    ATTACK_SUCCESS = 'GameView@ATTACK_SUCCESS',
    FALSE_START = 'GameView@FALSE_START',
    DRAW = 'GameView@DRAW',
    FIXED_RESULT = 'GameView@FIXED_RESULT',
    RESTART_GAME = 'GameView@RESTART_GAME',
}

export enum InnerStates {
    READY = "ready",
    ACTION = "action",
    RESULT = "result",
    OVER = "over",
}

abstract class GameViewState extends ViewContainer {
    private _gameStateMachine: StateMachine<ViewContainer>;

    private _player: Player;
    /**
     * 2Player's character for multi play mode.
     */
    private _opponent: Opponent;

    /**
     * Opponents for single play mode.
     */
    private _opponents: { [roundNumber: number]: Opponent };

    public get player(): Player {
        return this._player;
    }

    public get opponent(): Opponent {
        return this._opponent;
    };

    public get opponents(): { [roundNumber: number]: Opponent } {
        return this._opponents;
    }

    protected set gameStateMachine(machine: StateMachine<ViewContainer>) {
        this._gameStateMachine = machine;
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
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        // Tracking
        trackPageView(VirtualPageViews.GAME);

        this._player = new Hanamaru();

        this._opponent = new Ruby();
        this._opponents = {};
        this._opponents[1] = new Wataame();
        this._opponents[2] = new LittleDaemon();
        this._opponents[3] = new Shitake();
        this._opponents[4] = new Uchicchi();
        this._opponents[5] = new EnemyRuby();
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }

    /**
     *
     *
     * @param {string} stateTag
     * @param {T} params
     * @private
     */
    protected _to = <T>(stateTag: string, params?: T): void => {
        this._gameStateMachine.change(stateTag, params);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._gameStateMachine.current);
    }
}

export default GameViewState;
