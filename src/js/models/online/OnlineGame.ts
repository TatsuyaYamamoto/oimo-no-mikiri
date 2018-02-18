import { database, auth } from "firebase";

import Mode from "../Mode";
import Game from "../Game";
import Battle from "../Battle";
import Actor from "../Actor";
import OnlineBattle from "./OnlineBattle";

export enum GameEvents {
    CREATED = "game_created",
    MEMBER_JOINED = "member_joined",
    FULFILLED_MEMBERS = "fulfilled_members",
    ROUND_PROCEED = "round_proceed",
}

class OnlineGame extends Game {
    private _id: string;
    private _memberIds: string[];
    private _gameRef: database.Reference;

    constructor(id: string) {
        super(Mode.MULTI_ONLINE);
        this._id = id;
        this._memberIds = [];
        this._battles = new Map();

        this._gameRef = database().ref(`/games/${this._id}`);
        this._gameRef.child("members").on("child_added", this.onMemberJoined);
        this._gameRef.child("currentRound").on("value", this.onRoundProceed);
    }

    /************************************************************************************
     * Static methods
     */
    public static async create() {
        const gameId = database().ref().child("games").push().key;
        const {uid} = auth().currentUser;
        const updates = {};
        updates[`/games/${gameId}/members/${uid}`] = true;
        await database().ref().update(updates);

        return new OnlineGame(gameId);
    }

    /************************************************************************************
     * Accessor
     */

    /**
     *
     * @return {string}
     */
    public get id(): string {
        return this._id;
    }

    /**
     *
     * @return {string[]}
     */
    public get memberIds(): string[] {
        return this._memberIds;
    }

    public get npcAttackIntervalMillis(): number {
        throw new Error("Not implemented");
    }

    /************************************************************************************
     * Status change methods
     */

    public async join() {
        const {uid} = auth().currentUser;
        const updates = {};
        updates[`/games/${this._id}/members/${uid}`] = true;
        await database().ref().update(updates);
    }


    start(): void {
        const now = database.ServerValue.TIMESTAMP;

        this.transaction((current) => {
            if (current && current.currentRound !== 1) {
                current.currentRound = 1;
                current.createdAt = now;
                current.battles = {
                    1: {
                        createdAt: now
                    }
                }
            }
            return current;
        })
    }

    next(): void {
        if (this.currentRound >= this.roundSize) {
            console.error('Round of the game is already fulfilled.');
            return;
        }

        const now = database.ServerValue.TIMESTAMP;
        const nextRound = this.currentRound + 1;

        this.transaction((current) => {
            if (current && current.currentRound !== nextRound) {
                current.currentRound = nextRound;
                current.updatedAt = now;
                current.battles[nextRound] = {
                    createdAt: now
                }
            }
            return current;
        });
    }

    isFixed(): boolean {
        const requiredWins = Math.ceil(this.roundSize / 2);
        return this.getWins(Actor.PLAYER) >= requiredWins
            || this.getWins(Actor.OPPONENT) >= requiredWins;
    }


    /************************************************************************************
     * Callback methods
     */

    /**
     *
     * @param {firebase.database.DataSnapshot} snapshot
     */
    protected onMemberJoined = (snapshot: database.DataSnapshot) => {
        if (!snapshot.exists()) {
            return;
        }

        const addedMemberId = snapshot.key;

        const isExisting = this._memberIds.find((id) => id === addedMemberId);
        if (isExisting) {
            console.log("Existing member was added. then ignore this event.");
            return;
        }

        if (this._memberIds.length >= 2) {
            // Ignore non-updated members length case.
            // TODO: Consider non-updated length but updated member ids case.
            console.error("Fire updated member event, but non-updated length. ignore.", this._memberIds, snapshot.key);
            return;
        }

        console.log(`New member joined. Id: ${addedMemberId}`);
        this._memberIds.push(addedMemberId);

        if (this._memberIds.length == 2) {
            console.log(`Game members are fulfilled.`);
            this.dispatch(GameEvents.FULFILLED_MEMBERS);
        }
    };

    /**
     *
     * @param {firebase.database.DataSnapshot} snapshot
     */
    protected onRoundProceed = (snapshot: database.DataSnapshot) => {
        const nextRound = snapshot.val();

        if (!nextRound || nextRound <= this._currentRound) {
            return;
        }

        const prevRound = this._currentRound;

        this._currentRound = nextRound;
        this._battles.set(nextRound, new OnlineBattle({
            gameId: this._id,
            round: nextRound,
            playerId: auth().currentUser.uid,
            opponentId: this._memberIds.find((id) => id !== auth().currentUser.uid)
        }));

        console.log(`Proceed to next round. Round${prevRound} -> Round${nextRound}`);
        this.dispatch(GameEvents.ROUND_PROCEED, {nextRound});
    };

    /**
     *
     * @param {(current: any) => any} transactionUpdate
     * @return {Promise<void>}
     */
    private async transaction(transactionUpdate: (current: any) => any) {
        console.log("Start transaction.");
        const {committed, snapshot} = await this._gameRef.transaction(transactionUpdate);
        console.log(`End transaction. committed: ${committed}`, snapshot.val());
    }
}

export default OnlineGame;
