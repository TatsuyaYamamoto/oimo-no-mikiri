import { database, auth } from "firebase";

import Mode from "../Mode";
import Game from "../Game";
import Battle from "../Battle";
import Actor from "../Actor";
import OnlineBattle from "./OnlineBattle";
import { isUndefined } from "util";

export enum GameEvents {
    REQUESTED_START = "requested_start",
    IS_READY = "is_ready",
    CREATED = "game_created",
    MEMBER_JOINED = "member_joined",
    FULFILLED_MEMBERS = "fulfilled_members",
    MEMBER_LEFT = "member_left",
    ROUND_PROCEED = "round_proceed",
}

class OnlineGame extends Game {
    private _id: string;
    private _members: Map<string, boolean>;
    private _gameRef: database.Reference;

    constructor(id: string) {
        super(Mode.MULTI_ONLINE);
        this._id = id;
        this._members = new Map<string, boolean>();

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
    public get members(): Map<string, boolean> {
        return this._members;
    }

    public get npcAttackIntervalMillis(): number {
        throw new Error("Not implemented");
    }

    public get ownId(): string {
        return auth().currentUser.uid;
    }

    public get opponentId(): string {
        if (this.members.size < 2) {
            throw new Error("Member isn't fulfilled.");
        }

        let opponentId = null;
        this.members.forEach((value, id) => {
            if (id !== auth().currentUser.uid) {
                opponentId = id;
            }
        });

        if (!opponentId) {
            console.error("Got null opponent id!");
        }

        return opponentId;
    }

    /************************************************************************************
     * Status change methods
     */

    public async join() {
        // TODO validate current member state

        const membersSnapshot: database.DataSnapshot = await this._gameRef.child("members").once("value");

        if (3 <= membersSnapshot.numChildren()) {
            throw new Error("Provided game is already fulfilled.");
        }

        const {uid} = auth().currentUser;
        await this._gameRef.child("members").update({
            [uid]: false,
        });
        await this._gameRef.child(`members/${uid}`).onDisconnect().set(null);
    }

    public async leave() {
        const {uid} = auth().currentUser;
        await this._gameRef.child("members").update({
            [uid]: null,
        });
        await this._gameRef.child(`members/${uid}`).onDisconnect().cancel();
    }

    public async requestReady() {
        const {uid} = auth().currentUser;
        await this._gameRef.child("members").update({
            [uid]: true,
        });
    }

    public async start(): Promise<void> {
        const now = database.ServerValue.TIMESTAMP;
        const members = (await this._gameRef.child("members").once("value")).val();
        await this.transaction((current) => {
            if (current && current.currentRound !== 1) {
                Object.assign(current, {
                    currentRound: 1,
                    battles: {},
                    members,
                    updatedAt: now,
                });
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
        const isFixed = this.getWins(Actor.PLAYER) >= requiredWins
            || this.getWins(Actor.OPPONENT) >= requiredWins;

        // TODO replace member status update logic.
        if (isFixed) {
            console.log("Update user state to false. wait to request game restart.");
            const {uid} = auth().currentUser;
            this._gameRef.child("members").update({[uid]: false});
            this._gameRef.child("currentRound").set(null);

        }

        return isFixed;
    }

    public async release() {
        this.off();

        this._gameRef.child("members").off();
        this._gameRef.child("currentRound").off();

        this._battles.forEach((battle: OnlineBattle) => {
            battle.release();
        });
        this._battles.clear();
        const members = (await this._gameRef.child("members").once("value")).val();

        await database().ref(`games/${this.id}`).set({
            members,
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
        console.log(`Received updated members. prev: ${this.members}, updated: ${snapshot.val()}`);
        
        // Leave from the game?
        if (this.members.size === 2 && snapshot.numChildren() !== 2) {
            console.log(`Member left. current: ${Array.from(this.members.keys())}`);
            this.dispatch(GameEvents.MEMBER_LEFT);
        }

        // Got fulfilled?
        if (this.members.size !== 2 && snapshot.numChildren() === 2) {
            console.log(`Game members are fulfilled.`);
            this.dispatch(GameEvents.FULFILLED_MEMBERS);
        }

        // Received to request game start?
        snapshot.forEach((currentMemberSnapshot) => {
            const uid = currentMemberSnapshot.key;

            const isPrevMemberReady = this.members.get(uid);
            if (isUndefined(isPrevMemberReady)) {
                return false; // Go next enumeration element.
            }

            const isReady = currentMemberSnapshot.val();
            if (!isPrevMemberReady && isReady) {
                this.dispatch(GameEvents.REQUESTED_START, uid);
            }
            return false; // Keep enumeration
        });

        // Is every member ready?
        const currentMembers = snapshot.val();
        if (snapshot.numChildren() === 2 &&
            Object.keys(currentMembers).every((uid) => currentMembers[uid] === true)) {
            this.dispatch(GameEvents.IS_READY);
        }

        // Update local members status.
        this.members.clear();
        snapshot.forEach((child) => {
            this.members.set(child.key, child.val());
            return false; // Keep enumeration
        });
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
            playerId: this.ownId,
            opponentId: this.opponentId,
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
