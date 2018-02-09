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
    offStatusUpdated, onStatusUpdated, requestBattleResult, requestStartBattle,
    requestStartGame
} from "../../helper/firebase";

import UserStatus from "../../server/service/UserStatus";
import { addEvents, dispatchEvent, removeEvents } from "../../../framework/EventUtils";
import Actor from "../../models/Actor";


class OnlineGameView extends GameView {
    private _roomId: string;
    private _battleId: string;
    private _playerId: string;
    private _opponentId: string;

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


        this._playerId = auth().currentUser.uid;

        const loadGameDataPromise = Promise.resolve()
            .then(() => database().ref(`/users/${this._playerId}/roomId`).once("value"))
            .then((snapshot) => snapshot.val())
            .then((roomId) => {
                this._roomId = roomId;
                return database().ref(`/rooms/${this._roomId}/members`).once("value")
            })
            .then((snapshot) => snapshot.val())
            .then((members) => {
                this._opponentId = Object.keys(members).find((userId) => userId !== this._playerId);
            });

        this.waitRequestingBattleStart(loadGameDataPromise);
        onStatusUpdated(this.onStatusUpdated);

        dispatchEvent(Events.REQUEST_READY);

        // Startup game on server.
        requestStartGame();
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

            case UserStatus.BATTLE_RESULT_FIX:
                this.onBattleResultFixed();
                break;

            case UserStatus.GAME_RESULT_FIX:
                this.onGameResultFixed();
                break;
        }
    };

    protected waitRequestingBattleStart = (...additionals: Promise<any>[]) => {
        const requiredPromiseList = [
            new Promise((resolve => {
                database().ref(`/users/${auth().currentUser.uid}/battleId`).on("value", (snapshot) => {
                    const battleId = snapshot.val();
                    if (battleId) {
                        resolve(battleId);
                    }
                });
            })),
            new Promise(resolve => {
                addEvents({[Events.REQUEST_READY]: () => resolve()});
            })
        ];
        requiredPromiseList.push(...additionals);

        return Promise
            .all(requiredPromiseList)
            .then(([battleId]) => {
                this.onBattleStarted(<string>battleId);

                database().ref(`/users/${auth().currentUser.uid}/battleId`).off("value");
                removeEvents([Events.REQUEST_READY]);
            });
    };

    protected onBattleStarted = (battleId: string) => {
        console.log("On battle started. ID:", battleId);

        this.player.playWait();
        this.opponent.playWait();

        this._to(InnerStates.READY);


        Promise
            .all([
                database().ref(`/battles/${battleId}`).once("value"),
                new Promise(resolve => {
                    // TODO: replace logic of detected ready animation end.
                    addEvents({[Events.IS_READY]: () => resolve()});
                })
            ])
            .then(([snapshot]) => {
                const battle = snapshot.val();
                console.log("on fulfilled to start battle.", battle);

                const {
                    signalTime,
                    remainingRoundSize,
                    wins,
                    falseStartedInPreviousBattle
                } = battle;


                this._to<ActionEnterParams>(InnerStates.ACTION, {
                    signalTime: signalTime,
                    // TODO: Load round size
                    battleLeft: remainingRoundSize,
                    wins: {
                        player: wins && wins[this._playerId] || 0,
                        opponent: wins && wins[this._opponentId] || 0,
                    },
                    isFalseStarted: {
                        player: falseStartedInPreviousBattle && falseStartedInPreviousBattle[this._playerId] || false,
                        opponent: falseStartedInPreviousBattle && falseStartedInPreviousBattle[this._opponentId] || false,
                    },
                });

                removeEvents([Events.IS_READY]);
            });
    };

    private onBattleResultFixed = async () => {
        this.waitRequestingBattleStart();

        const {
            winnerId,
            falseStarterId
        } = await requestBattleResult();

        const winner = !winnerId ? null :
            winnerId === this._playerId ? Actor.PLAYER : Actor.OPPONENT;

        const falseStarter = !falseStarterId ? null :
            falseStarterId === this._playerId ? Actor.PLAYER : Actor.OPPONENT;

        this._to<ResultEnterParams>(InnerStates.RESULT, {
            winner,
            falseStarter,
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
