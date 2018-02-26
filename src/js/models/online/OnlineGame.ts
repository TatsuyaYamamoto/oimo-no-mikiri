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
    MEMBER_LEFT = "member_left",
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
        this._gameRef.child("members").on("value", this.onMemberUpdated);
        this._gameRef.child("currentRound").on("value", this.onCurrentRoundUpdated);
    }

    /************************************************************************************
     * Static methods
     */
    public static async create() {
        const gameId = database().ref().child("games").push().key;
        const ref = database().ref(`games/${gameId}`);

        await ref.set({
            createdAt: database.ServerValue.TIMESTAMP,
        });
        ref.onDisconnect().set(null);

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

    public get ownId(): string {
        return auth().currentUser.uid;
    }

    public get opponentId(): string {
        if (this._memberIds.length < 2) {
            throw new Error("Member isn't fulfilled.");
        }

        return this._memberIds.find((id) => id !== auth().currentUser.uid);
    }

    /************************************************************************************
     * Status change methods
     */

    public async join() {
        const {uid} = auth().currentUser;

        const {snapshot} = await this.transaction((current) => {
            if (!current) {
                return current;
            }

            if (!current.members || Object.keys(current.members).length < 2) {
                current.members = Object.assign({}, current.members, {
                    [uid]: true
                });
            }
            return current;
        }, "join_game");

        const currentGame = snapshot.val();

        if (!currentGame) {
            throw new Error("Provided game is not exist.");
        }

        const currentMemberIds = Object.keys(currentGame.members);
        const isJoinSucceed = currentMemberIds.some(id => id === uid);

        if (isJoinSucceed) {
            await this._gameRef.child(`members/${uid}`).onDisconnect().set(null);
        } else {
            throw new Error("Provided game's members are already fulfilled.");
        }
    }


    public async start(): Promise<void> {
        this._battles = new Map();

        const now = database.ServerValue.TIMESTAMP;

        await this.transaction((current) => {
            console.error("start game", current);
            if (current && current.currentRound !== 1) {
                current.currentRound = 1;
                current.updatedAt = now;
                current.battles = {};
            }
            return current;
        }, "start_game");
    }

    public async next(): Promise<void> {
        if (this.currentRound >= this.roundSize) {
            console.error('Round of the game is already fulfilled.');
            return;
        }

        const nextRound = this.currentRound + 1;
        const now = database.ServerValue.TIMESTAMP;

        await this.transaction((current) => {
            if (current && current.currentRound !== nextRound) {
                current.currentRound = nextRound;
                current.updatedAt = now;
            }
            return current;
        }, "process_game_round");
    }

    isFixed(): boolean {
        const requiredWins = Math.ceil(this.roundSize / 2);
        return this.getWins(Actor.PLAYER) >= requiredWins
            || this.getWins(Actor.OPPONENT) >= requiredWins;
    }

    public async release() {
        this.off();

        this._gameRef.child("members").off();
        this._gameRef.child("currentRound").off();

        this._battles.forEach((battle: OnlineBattle) => {
            battle.release();
        });
        this._battles.clear();

        await database().ref(`games/${this.id}`).set({
            createdAt: database.ServerValue.TIMESTAMP,
        });
    }

    /************************************************************************************
     * Callback methods
     */

    /**
     *
     * @param {firebase.database.DataSnapshot} snapshot
     */
    protected onMemberUpdated = (snapshot: database.DataSnapshot) => {
        if (!snapshot.exists()) {
            return;
        }

        const {uid} = auth().currentUser;
        if (!snapshot.hasChild(uid)) {
            console.error("Updated member list dose not have own ID.");
            return;
        }

        if (3 <= snapshot.numChildren()) {
            console.error("invalid member length!");
            return;
        }

        if (this.memberIds.length === 2 && snapshot.numChildren() === 2) {
            console.log("No member was updated.");
            return;
        }

        this._memberIds = Object.keys(snapshot.val());

        if (this._memberIds.length === 2) {
            console.log(`Game members are fulfilled.`);

            const opponentConnectingRef = database().ref(`users/${this.opponentId}/isConnecting`);
            opponentConnectingRef.on("value", (snapshot: database.DataSnapshot) => {
                if (snapshot.exists() && !snapshot.val()) {
                    this.dispatch(GameEvents.MEMBER_LEFT);
                }
            });


            this.dispatch(GameEvents.FULFILLED_MEMBERS);
        }
    };

    protected onCurrentRoundUpdated = async (snapshot: database.DataSnapshot) => {
        if (!snapshot.exists()) {
            return;
        }

        const prevRound = this._currentRound;
        const nextRound = snapshot.val();
        const nextBattle = new OnlineBattle({
            gameId: this._id,
            round: nextRound,
            playerId: auth().currentUser.uid,
            opponentId: this._memberIds.find((id) => id !== auth().currentUser.uid)
        });

        if (nextRound === 1) {
            this._battles.clear();
        }

        this._battles.set(nextRound, nextBattle);
        this._currentRound = nextRound;

        await nextBattle.start();

        console.log(`Proceed to next round. Round${prevRound} -> Round${nextRound}`);
        this.dispatch(GameEvents.ROUND_PROCEED, {nextRound});
    };

    /************************************************************************************
     * Private methods
     */

    /**
     *
     *
     * @param {(current: any) => any} transactionUpdate
     * @param {string} tag
     * @return {Promise<{committed: boolean; snapshot: firebase.database.DataSnapshot}>}
     */
    private async transaction(transactionUpdate: (current: any) => any, tag?: string): Promise<{ committed: boolean, snapshot: database.DataSnapshot }> {
        console.log(`Start transaction. TAG: ${tag}`);
        const {committed, snapshot} = await this._gameRef.transaction(transactionUpdate);
        console.log(`End transaction. TAG: ${tag}, committed: ${committed}`, snapshot.val());

        return {committed, snapshot}
    }
}

export default OnlineGame;
