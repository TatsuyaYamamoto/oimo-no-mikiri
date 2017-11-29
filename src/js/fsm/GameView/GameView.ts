import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import ReadyState from "./internal/ReadyState";
import ActionState, {EnterParams as ActionStateEnterParams} from "./internal/ActionState";
import ResultState, {EnterParams as ResultStateEnterParams} from './internal/ResultState';
import OverState, {EnterParams as OverEnterParams} from "./internal/OverState";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";

import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Shitake from "../../texture/sprite/character/Shitake";
import LittleDaemon from "../../texture/sprite/character/LittleDeamon";
import Wataame from "../../texture/sprite/character/Wataame";
import EnemyRuby from "../../texture/sprite/character/EnemyRuby";

import Game from '../../models/Game';
import Actor from "../../models/Actor";

import {NPC_LEVELS} from "../../Constants";

export enum Events {
    REQUEST_READY = 'GameView@REQUEST_READY',
    IS_READY = 'GameView@IS_READY',
    ATTACK_SUCCESS = 'GameView@ATTACK_SUCCESS',
    FALSE_START = 'GameView@FALSE_START',
    DRAW = 'GameView@DRAW',
    FIXED_RESULT = 'GameView@FIXED_RESULT',
    RESTART_GAME = 'GameView@RESTART_GAME',
}

export interface EnterParams extends Deliverable {
    level: NPC_LEVELS,
    roundLength: number,
}

enum InnerStates {
    READY = "ready",
    ACTION = "action",
    RESULT = "result",
    OVER = "over",
}

class GameViewState extends ViewContainer {
    private _gameStateMachine: StateMachine<ViewContainer>;

    private _game: Game;

    private _player: Player;
    private _opponents: { [roundNumber: number]: Opponent };

    public get player(): Player {
        return this._player;
    }

    public get opponent(): Opponent {
        return this._opponents[this._game.currentRound];
    }

    public get game(): Game {
        return this._game;
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

        this._player = new Hanamaru();

        this._opponents = {};
        this._opponents[1] = new Wataame();
        this._opponents[2] = new LittleDaemon();
        this._opponents[3] = new Shitake();
        this._opponents[4] = new Uchicchi();
        this._opponents[5] = new EnemyRuby();

        this._gameStateMachine = new StateMachine({
            [InnerStates.READY]: new ReadyState(this),
            [InnerStates.ACTION]: new ActionState(this),
            [InnerStates.RESULT]: new ResultState(this),
            [InnerStates.OVER]: new OverState(this)
        });

        addEvents({
            [Events.REQUEST_READY]: this._onRequestedReady,
            [Events.IS_READY]: this._onReady,
            [Events.ATTACK_SUCCESS]: this._onAttackSucceed,
            [Events.FALSE_START]: this._onFalseStarted,
            [Events.DRAW]: this._onDrew,
            [Events.FIXED_RESULT]: this._onFixedResult,
            [Events.RESTART_GAME]: this._onRequestedRestart,
        });

        this._game = Game.asOnePlayer(params.level);
        this.game.start();

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
            Events.ATTACK_SUCCESS,
            Events.FALSE_START,
            Events.DRAW,
            Events.FIXED_RESULT,
            Events.RESTART_GAME,
        ])
    }

    /**
     *
     * @private
     */
    private _onRequestedReady = () => {
        if (this.game.isFixed()) {
            dispatchEvent(Events.FIXED_RESULT);
            return;
        }

        // is retry battle by false-start?
        if (this.game.currentBattle.isFixed()) {
            this.game.next();
        }

        console.log(`On requested ready. Round${this.game.currentRound}`);

        this.player.playWait();
        this.opponent.playWait();

        this._to(InnerStates.READY);

    };

    /**
     *
     * @private
     */
    private _onReady = () => {
        this._to<ActionStateEnterParams>(InnerStates.ACTION, {
            autoOpponentAttackInterval: this.game.npcAttackIntervalMillis,
            isFalseStarted: {
                player: this.game.currentBattle.isFalseStarted(Actor.PLAYER),
                opponent: this.game.currentBattle.isFalseStarted(Actor.OPPONENT),
            },
        });
    };

    /**
     *
     * @private
     */
    private _onAttackSucceed = (e: CustomEvent) => {
        const {actor, attackTime} = e.detail;
        this.game.currentBattle.win(actor, attackTime);
        this._to<ResultStateEnterParams>(InnerStates.RESULT, {winner: actor});
    };

    /**
     *
     * @private
     */
    private _onFalseStarted = (e: CustomEvent) => {
        const {actor} = e.detail;
        this.game.currentBattle.falseStart(actor);
        this._to<ResultStateEnterParams>(InnerStates.RESULT, {
            winner: this.game.currentBattle.winner,
            falseStarter: actor
        });

    };

    /**
     *
     * @private
     */
    private _onDrew = (e: CustomEvent) => {
        this.game.currentBattle.draw();
        this._to<ResultStateEnterParams>(InnerStates.RESULT);
    };

    /**
     *
     * @private
     */
    private _onFixedResult = () => {
        const bestTime = this.game.bestTime;
        const straightWins = this.game.straightWins;
        const winner = this.game.winner;

        this._to<OverEnterParams>(InnerStates.OVER, {
            winner,
            bestTime,
            straightWins
        });
    };

    private _onRequestedRestart = () => {
        this.game.start();
        dispatchEvent(Events.REQUEST_READY);
    };

    /**
     *
     *
     * @param {string} stateTag
     * @param {T} params
     * @private
     */
    private _to = <T>(stateTag: string, params?: T): void => {
        this._gameStateMachine.change(stateTag, params);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._gameStateMachine.current);
    }
}

export default GameViewState;
