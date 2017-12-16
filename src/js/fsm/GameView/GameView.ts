import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import ReadyState from "./internal/ReadyState";
import {
    default as SinglePlayActionState,
    EnterParams as SinglePlayActionStateEnterParams
} from "./internal/ActionState/SinglePlayActionState";
import {
    default as MultiPlayActionState,
    EnterParams as MultiPlayActionStateEnterParams
} from "./internal/ActionState/MultiPlayActionState";
import ResultState, {EnterParams as ResultStateEnterParams} from './internal/ResultState';
import {
    default as SinglePlayOverState,
    EnterParams as SinglePlayOverStateEnterParams
} from "./internal/OverState/SinglePlayOverState";
import {
    default as MultiPlayOverState,
    EnterParams as MultiPlayOverStateEnterParams
} from "./internal/OverState/MultiPlayOverState";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";

import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Ruby from "../../texture/sprite/character/Ruby";

import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Shitake from "../../texture/sprite/character/Shitake";
import LittleDaemon from "../../texture/sprite/character/LittleDeamon";
import Wataame from "../../texture/sprite/character/Wataame";
import EnemyRuby from "../../texture/sprite/character/EnemyRuby";

import {trackPageView, VirtualPageViews} from "../../helper/tracker";

import Game from '../../models/Game';
import Actor from "../../models/Actor";
import Mode from "../../models/Mode";

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
    mode: Mode;
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
        if (this.game.isOnePlayerMode) {
            return this._opponents[this._game.currentRound];
        } else {
            return this._opponent;
        }
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

        // Tracking
        trackPageView(VirtualPageViews.GAME);

        this._game = new Game(params.mode);

        this._player = new Hanamaru();

        this._opponent = new Ruby();
        this._opponents = {};
        this._opponents[1] = new Wataame();
        this._opponents[2] = new LittleDaemon();
        this._opponents[3] = new Shitake();
        this._opponents[4] = new Uchicchi();
        this._opponents[5] = new EnemyRuby();

        this._gameStateMachine = new StateMachine({
            [InnerStates.READY]: new ReadyState(this),
            [InnerStates.ACTION]: this.game.isOnePlayerMode ?
                new SinglePlayActionState(this) :
                new MultiPlayActionState(this),
            [InnerStates.RESULT]: new ResultState(this),
            [InnerStates.OVER]: this.game.isOnePlayerMode ?
                new SinglePlayOverState(this) :
                new MultiPlayOverState(this)
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
        if (this.game.isOnePlayerMode) {
            this._to<SinglePlayActionStateEnterParams>(InnerStates.ACTION, {
                autoOpponentAttackInterval: this.game.isOnePlayerMode ? this.game.npcAttackIntervalMillis : null,
                isFalseStarted: {
                    player: this.game.currentBattle.isFalseStarted(Actor.PLAYER),
                    opponent: this.game.currentBattle.isFalseStarted(Actor.OPPONENT),
                },
            });
        } else {
            this._to<MultiPlayActionStateEnterParams>(InnerStates.ACTION, {
                battleLeft: this.game.roundSize - this.game.currentRound + 1,
                wins: {
                    onePlayer: this.game.getWins(Actor.PLAYER),
                    twoPlayer: this.game.getWins(Actor.OPPONENT),
                },
                isFalseStarted: {
                    player: this.game.currentBattle.isFalseStarted(Actor.PLAYER),
                    opponent: this.game.currentBattle.isFalseStarted(Actor.OPPONENT),
                },
            });
        }
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
        console.log(`Fixed the game! player win: ${this.game.getWins(Actor.PLAYER)}, opponent wins: ${this.game.getWins(Actor.OPPONENT)}.`)

        const bestTime = this.game.bestTime;
        const winner = this.game.winner;
        const mode = this.game.mode;

        if (this.game.isOnePlayerMode) {
            this._to<SinglePlayOverStateEnterParams>(InnerStates.OVER, {
                winner,
                bestTime,
                mode,
                straightWins: this.game.straightWins,
            });
        } else {
            this._to<MultiPlayOverStateEnterParams>(InnerStates.OVER, {
                winner,
                bestTime,
                mode,
                onePlayerWins: this.game.getWins(Actor.PLAYER),
                twoPlayerWins: this.game.getWins(Actor.OPPONENT),
            });
        }
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
