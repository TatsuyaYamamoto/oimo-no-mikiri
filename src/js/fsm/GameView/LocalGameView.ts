import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import { dispatchEvent, addEvents, removeEvents } from "../../../framework/EventUtils";

import GameView, { Events, InnerStates } from "./GameView";

import ReadyState from "./internal/ReadyState";
import SinglePlayActionState, {
    EnterParams as SinglePlayActionStateEnterParams
} from "./internal/ActionState/SinglePlayActionState";
import MultiPlayActionState, {
    EnterParams as MultiPlayActionStateEnterParams
} from "./internal/ActionState/MultiPlayActionState";
import ResultState, {
    EnterParams as ResultStateEnterParams
} from './internal/ResultState';
import SinglePlayOverState from "./internal/OverState/SinglePlayOverState";
import MultiPlayOverState, {
    EnterParams as MultiPlayOverStateEnterParams
} from "./internal/OverState/MultiPlayOverState";

import Game from '../../models/Game';
import Actor from "../../models/Actor";
import Mode from "../../models/Mode";

import { trackPageView, VirtualPageViews } from "../../helper/tracker";
import Opponent from "../../texture/sprite/character/Opponent";


export interface EnterParams extends Deliverable {
    mode: Mode;
}

class LocalGameView extends GameView {

    private _game: Game;

    public get game(): Game {
        return this._game;
    }

    /**
     *
     * @return {Opponent}
     * @override
     */
    public get opponent(): Opponent {
        if (this.game.isOnePlayerMode) {
            return this.opponents[this.game.currentRound];
        } else {
            return this.opponent;
        }
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        // Tracking
        trackPageView(VirtualPageViews.GAME);

        this._game = new Game(params.mode);

        this.gameStateMachine = new StateMachine({
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

        this._to<MultiPlayOverStateEnterParams>(InnerStates.OVER, {
            winner,
            bestTime,
            mode,
            onePlayerWins: this.game.getWins(Actor.PLAYER),
            twoPlayerWins: this.game.getWins(Actor.OPPONENT),
        });
    };

    private _onRequestedRestart = () => {
        this.game.start();
        dispatchEvent(Events.REQUEST_READY);
    };
}

export default LocalGameView;
