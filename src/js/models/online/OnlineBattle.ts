import { database } from "firebase";

import Battle, { BattleEvents } from "../Battle";
import Actor from "../Actor";
import { getRandomInteger } from "../../../framework/utils";

export interface OnlineBattleParams {
    gameId: string;
    round: string;
    playerId: string;
    opponentId: string;
}

class OnlineBattle extends Battle {
    private _idActorMap: Map<string, Actor>;
    private _actorIdMap: Map<Actor, string>;
    private _attackTimeMap: Map<Actor, number>;
    private _battleRef: database.Reference;

    constructor(params: OnlineBattleParams) {
        super();

        const {
            gameId,
            round,
        } = params;

        this._idActorMap = new Map();
        this._idActorMap.set(params.playerId, Actor.PLAYER);
        this._idActorMap.set(params.opponentId, Actor.OPPONENT);

        this._actorIdMap = new Map();
        this._actorIdMap.set(Actor.PLAYER, params.playerId);
        this._actorIdMap.set(Actor.OPPONENT, params.opponentId);

        this._attackTimeMap = new Map();

        this._battleRef = database().ref(`/games/${gameId}/battles/${round}`);
        this._battleRef.child("winner").on("value", this.onWinnerUpdated);
        this._battleRef.child("signalTime").on("value", this.onSignalTimeUpdated);
        this._battleRef.child("attackTime").on("child_added", this.onAttackTimeAdded);
        this._battleRef.child("falseStart").on("child_added", this.onFalseStartAdded);

        this.transaction((current) => {
            if (current && !current.signalTime) {
                current.signalTime = this.createSignalTime();
            }

            return current;
        })
    }

    /************************************************************************************
     * Status change methods
     */
    public isFixed(): boolean {
        return !!this._winner;
    }

    public attack(attacker: Actor, attackTime: number): void {
        const uid = this.toId(attacker);
        const updates = {};
        updates[uid] = attackTime;

        this._battleRef.child("attackTime").update(updates);
    }

    /************************************************************************************
     * Callback methods
     */

    protected onWinnerUpdated = (snapshot: database.DataSnapshot) => {
        if (!snapshot.exists() || this._winner) {
            return;
        }

        const winner = snapshot.val();
        this._winner = this.toActor(winner.id);
        this._winnerAttackTime = winner.attackTime;
    };

    protected onSignalTimeUpdated = (snapshot: database.DataSnapshot) => {
        console.error("signl", snapshot.val());
        this._signalTime = snapshot.val();
    };

    protected onAttackTimeAdded = (snapshot: database.DataSnapshot) => {
        if (!snapshot.exists()) {
            return;
        }

        const uid = snapshot.key;
        const actor = this.toActor(uid);
        const attackTime = snapshot.val();

        if (this._attackTimeMap.has(actor)) {
            console.log(`Provided user's attackTime is existing. then ignore this event. uid: ${uid}`);
            return;
        }

        console.log(`Set attack time. Actor: ${actor}, Id: ${uid}, time: ${attackTime}`);
        this._attackTimeMap.set(actor, attackTime);

        if (this._attackTimeMap.size === 2) { // TODO: extract as constants
            const playerAttackTime = this._attackTimeMap.get(Actor.PLAYER);
            const opponentAttackTime = this._attackTimeMap.get(Actor.OPPONENT);

            if (0 <= playerAttackTime && 0 <= opponentAttackTime) {
                if (Math.abs(playerAttackTime - opponentAttackTime) < 100) {
                    this.reset();
                    this.dispatch(BattleEvents.DRAW, {});
                    console.log("This battle is drew. then it will be reset.");
                } else {
                    let winner;
                    let winnerAttackTime;

                    if (playerAttackTime < opponentAttackTime) {
                        winner = Actor.PLAYER;
                        winnerAttackTime = playerAttackTime;
                    } else {
                        winner = Actor.OPPONENT;
                        winnerAttackTime = opponentAttackTime;
                    }

                    this.fix(this.toId(winner), winnerAttackTime);
                    this.dispatch(BattleEvents.SUCCEED_ATTACK, winner);
                    console.log(`This battle is fixed. winner: ${winner}, time: ${winnerAttackTime}`);
                }
            } else {
                if (playerAttackTime === opponentAttackTime) {
                    console.log("This battle is drew. then it will be reset.");

                    this.reset();
                    this.dispatch(BattleEvents.DRAW, {});
                } else if (playerAttackTime < opponentAttackTime) {
                    console.log(`False-started by ${Actor.PLAYER}.`);

                    if (this._falseStartMap.has(Actor.PLAYER)) {
                        console.log(`This battle is fixed with false-start. winner: ${Actor.OPPONENT}.`);

                        this.fix(this.toId(Actor.OPPONENT));
                        this.dispatch(BattleEvents.FALSE_STARTED, Actor.OPPONENT);
                    } else {
                        this.falseStart(Actor.PLAYER);
                        this.dispatch(BattleEvents.FALSE_STARTED);
                    }
                } else {
                    console.log(`False-started by ${Actor.OPPONENT}.`);

                    if (this._falseStartMap.has(Actor.OPPONENT)) {
                        console.log(`This battle is fixed with false-start. winner: ${Actor.PLAYER}.`);

                        this.fix(this.toId(Actor.PLAYER));
                        this.dispatch(BattleEvents.FALSE_STARTED, Actor.PLAYER);
                    } else {
                        this.falseStart(Actor.OPPONENT);
                        this.dispatch(BattleEvents.FALSE_STARTED);
                    }
                }
            }
        }
    };

    protected onFalseStartAdded = (snapshot: database.DataSnapshot) => {
        if (!snapshot.exists()) {
            return;
        }

        const uid = snapshot.key;
        const actor = this.toActor(uid);

        if (this._falseStartMap.has(actor)) {
            return;
        }

        this._falseStartMap.set(actor, true);
    };

    protected falseStart(actor: Actor): void {
        const uid = this.toId(actor);
        const updates = {};
        updates[`falseStart/${uid}`] = true;

        this._battleRef.update(updates);

        this.reset();
    }

    protected fix(winnerId: string, attackTime?: number): void {
        const updates = {};
        updates[`winner/id`] = winnerId;
        updates[`winner/attackTime`] = attackTime || null;

        this._battleRef.update(updates);
    }

    protected reset(): void {
        this._attackTimeMap.clear();

        console.log("Start transaction.");
        this._battleRef
            .transaction((current) => {
                const time = this.createSignalTime();
                if (current && current.attackTime) {
                    current.attackTime = null;
                    current.signalTime = time;
                }

                return current;
            })
            .then(({committed, snapshot}) => {
                console.log(`End transaction. committed: ${committed}`, snapshot.val());
            });
    }

    protected createSignalTime(): number {
        return getRandomInteger(3000, 5000);
    }

    /**
     *
     * @param {(current: any) => any} transactionUpdate
     * @return {Promise<void>}
     */
    private async transaction(transactionUpdate: (current: any) => any) {
        console.log("Start transaction.");
        const {committed, snapshot} = await this._battleRef.transaction(transactionUpdate);
        console.log(`End transaction. committed: ${committed}`, snapshot.val());
    }

    private toId(actor: Actor): string {
        return this._actorIdMap.get(actor);
    }

    private toActor(id: string): Actor {
        return this._idActorMap.get(id);
    }
}

export default OnlineBattle;
