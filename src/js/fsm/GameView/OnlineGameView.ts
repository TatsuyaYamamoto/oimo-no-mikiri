import Deliverable from "../../../framework/Deliverable";
import StateMachine from "../../../framework/StateMachine";

import GameView, { InnerStates } from "./GameView";

import MultiPlayOverState from "./internal/OverState/MultiPlayOverState";
import ResultState from "./internal/ResultState";
import ReadyState from "./internal/ReadyState";
import OnlineActionState from "./internal/ActionState/OnlineActionState";

import { trackPageView, VirtualPageViews } from "../../helper/tracker";
import { offStatusUpdated, onStatusUpdated, requestStartGame } from "../../helper/firebase";

import UserStatus from "../../server/service/UserStatus";


class OnlineGameView extends GameView {

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        // Tracking
        trackPageView(VirtualPageViews.GAME);

        this.gameStateMachine = new StateMachine({
            [InnerStates.READY]: new ReadyState(this),
            [InnerStates.ACTION]: new OnlineActionState(this),
            [InnerStates.RESULT]: new ResultState(this),
            [InnerStates.OVER]: new MultiPlayOverState(this),
        });

        onStatusUpdated(this.onStatusUpdated);

        this._to(InnerStates.READY);

        requestStartGame()
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        offStatusUpdated();
    }

    private onStatusUpdated = (status: UserStatus) => {
        switch (status) {
            case UserStatus.GAME_READY:
                this.onReady();
                break;

            case UserStatus.ATTACK_SUCCESS:
                this.onAttackSucceed();
                break;

            case UserStatus.FALSE_START:
                this.onFalseStarted();
                break;

            case UserStatus.DRAW:
                this.onDrew();
                break;

            case UserStatus.GAME_RESULT_FIXED:
                this.onFixedResult();
                break;
        }
    };

    /**
     *
     * @private
     */
    private onReady = () => {
        // this._to<ActionStateEnterParams>(InnerStates.ACTION, {
        //     signalTime: 0,
        //     battleLeft: this.game.roundSize - this.game.currentRound + 1,
        //     wins: {
        //         onePlayer: this.game.getWins(Actor.PLAYER),
        //         twoPlayer: this.game.getWins(Actor.OPPONENT),
        //     },
        //     isFalseStarted: {
        //         player: this.game.currentBattle.isFalseStarted(Actor.PLAYER),
        //         opponent: this.game.currentBattle.isFalseStarted(Actor.OPPONENT),
        //     },
        // });
    };

    /**
     *
     * @private
     */
    private onAttackSucceed = () => {
        // const {actor, attackTime} = e.detail;
        // this.game.currentBattle.win(actor, attackTime);
        // this._to<ResultStateEnterParams>(InnerStates.RESULT, {winner: actor});
    };

    /**
     *
     * @private
     */
    private onFalseStarted = () => {
        // const {actor} = e.detail;
        // this.game.currentBattle.falseStart(actor);
        // this._to<ResultStateEnterParams>(InnerStates.RESULT, {
        //     winner: this.game.currentBattle.winner,
        //     falseStarter: actor
        // });
    };

    /**
     *
     * @private
     */
    private onDrew = () => {
        // this.game.currentBattle.draw();
        // this._to<ResultStateEnterParams>(InnerStates.RESULT);
    };

    /**
     *
     * @private
     */
    private onFixedResult = () => {
        // console.log(`Fixed the game! player win: ${this.game.getWins(Actor.PLAYER)}, opponent wins: ${this.game.getWins(Actor.OPPONENT)}.`)
        //
        // const bestTime = this.game.bestTime;
        // const winner = this.game.winner;
        // const mode = this.game.mode;
        //
        // this._to<MultiPlayOverStateEnterParams>(InnerStates.OVER, {
        //     winner,
        //     bestTime,
        //     mode,
        //     onePlayerWins: this.game.getWins(Actor.PLAYER),
        //     twoPlayerWins: this.game.getWins(Actor.OPPONENT),
        // });
    };
}

export default OnlineGameView;
