import { database, auth } from "firebase";

import Deliverable from "../../../framework/Deliverable";
import StateMachine from "../../../framework/StateMachine";

import GameView, { Events, InnerStates } from "./GameView";

import MultiPlayOverState from "./internal/OverState/MultiPlayOverState";
import ResultState, { EnterParams as ResultEnterParams } from "./internal/ResultState";
import ReadyState from "./internal/ReadyState";
import OnlineActionState, { EnterParams as ActionEnterParams } from "./internal/ActionState/OnlineActionState";

import { trackPageView, VirtualPageViews } from "../../helper/tracker";
import {
    offStatusUpdated, onStatusUpdated, requestBattleResult, requestCurrentBattle,
    requestStartGame
} from "../../helper/firebase";

import UserStatus from "../../server/service/UserStatus";
import { addEvents, removeEvents } from "../../../framework/EventUtils";


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


        requestStartGame();

        // on battle started
        database().ref(`/users/${auth().currentUser.uid}/battleId`).on("value", (snapshot) => {
            const battleId = snapshot.val();
            if (battleId) {
                this.onBattleStarted(battleId);
            }
        });

        this._to(InnerStates.READY);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        removeEvents([
            Events.IS_READY,
        ]);

        offStatusUpdated();
    }

    private onStatusUpdated = (status: UserStatus) => {
        switch (status) {

            case UserStatus.BATTLE_READY:
                break;

            case UserStatus.GAME_RESULT_FIX:
                this.onGameResultFixed();
                break;
        }
    };

    protected onBattleStarted = (battleId: string) => {
        console.log("On battle started. ID:", battleId);
        let playerId = auth().currentUser.uid;
        let opponentId;

        Promise
            .all([
                database().ref(`/battles/${battleId}`).once("value"),
                async () => {
                    const roomId = (await database().ref(`/users/${playerId}/roomId`).once("value")).val();
                    const members = (await database().ref(`/users/${roomId}/members`).once("value")).val();

                    opponentId = Object.keys(members).find((userId) => userId !== playerId);
                },
                new Promise(resolve => {
                    // TODO: replace logic of detected ready animation end.
                    addEvents({
                        [Events.IS_READY]: () => resolve(),
                    });
                })
            ])
            .then(([snapshot]) => {
                const battle = snapshot.val();
                console.log("on fulfilled to start battle.", battle);

                const {
                    signalTime,
                    remainingRoundSize,
                    wins,
                    falseStarted
                } = battle;


                this._to<ActionEnterParams>(InnerStates.ACTION, {
                    signalTime: signalTime,
                    // TODO: Load round size
                    battleLeft: remainingRoundSize,
                    wins: {
                        player: wins && wins[playerId] || 0,
                        opponent: wins && wins[opponentId] || 0,
                    },
                    isFalseStarted: {
                        player: falseStarted && falseStarted[playerId] || false,
                        opponent: falseStarted && falseStarted[opponentId] || false,
                    },
                });
            });
    };

    private onBattleResultFixed = async () => {
        const result = await requestBattleResult();

        this._to<ResultEnterParams>(InnerStates.RESULT, {
            winner: null,
            falseStarter: null,
        });
    };

    /**
     *
     * @private
     */
    private onGameResultFixed = () => {
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
