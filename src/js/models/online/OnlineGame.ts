import { database, auth } from "firebase";

import Mode from "../Mode";
import OnlineBattle from "./OnlineBattle";
import EventEmitter from "./EventEmitter";
import {
    isMultiMode,
    isOnlineMode,
    isSingleMode
} from "../Game";

export enum GameEvents {
    CREATED = "game_created",
    MEMBER_JOINED = "member_joined",
    FULFILLED_MEMBERS = "fulfilled_members",
}

class OnlineGame extends EventEmitter /*implements Game TODO: implements */ {
    private _mode: Mode;
    private _roundSize: number = 5;
    private _currentRound: number;
    private _battles: Map<number, OnlineBattle>;
    private _id: string;
    private _memberIds: string[];

    constructor(id: string) {
        super();

        this._mode = Mode.MULTI_ONLINE;
        this._id = id;
        this._memberIds = [];

        database().ref(`/games/${this._id}`).on("value", (snapshot) => {
            if (snapshot.exists()) {
                this.dispatch(GameEvents.CREATED, {
                    roomId: snapshot.key
                });
            }
        });

        database().ref(`/games/${this._id}/members`).on("value", (snaphot) => {
            snaphot.forEach((member) => {
                this._memberIds.push(member.key);
                return false; // not cancel enumeration.
            });

            console.log(`Game members are updated.`, this._memberIds);

            if (snaphot.numChildren() === 2) {
                this.dispatch(GameEvents.FULFILLED_MEMBERS);
                console.log(`Game members are fulfilled.`);
            }
    public static async create() {
        const gameId = database().ref().child("games").push().key;
        const {uid} = auth().currentUser;
        const updates = {};
        updates[`/games/${gameId}/members/${uid}`] = true;
        await database().ref().update(updates);

        });
        database().ref(`/games/${this._id}/members`).on("child_removed", this.onMemberLeft);
        return new OnlineGame(gameId);
    }

    public get id(): string {
        return this._id;
    }

    public get mode(): Mode {
        return this._mode;
    }


    public async join() {
        const {uid} = auth().currentUser;
        const updates = {};
        updates[`/games/${this._id}/members/${uid}`] = true;
        await database().ref().update(updates);
    }

        return database().ref().update(updates);
    }

    /**
     *
     * @param {firebase.database.DataSnapshot} snapshot
     */
    protected onMemberJoined = (snapshot: database.DataSnapshot) => {
        if (this._memberIds.length >= 2) {
            console.error(`Fired join member event, but the game already has ${this._memberIds.length} members.`);
            return;
        }

        const uid = snapshot.key;
        this._memberIds.push(uid);
        console.log(`Member, ${uid}, is entered.`);

        if (this._memberIds.length == 2) {
            this.dispatch(GameEvents.FULFILLED_MEMBERS);
            console.log(`Game members are fulfilled.`);
        }
    };

    /**
     *
     * @param {firebase.database.DataSnapshot} snapshot
     */
    protected onMemberLeft = (snapshot: database.DataSnapshot) => {
        const uid = snapshot.key;
        const leaverIndex = this._memberIds.findIndex((id) => id === uid);
        this._memberIds.splice(leaverIndex, 1);

        console.log(`Member, ${uid}, is left.`);
    };

    /**
     *
     */
    protected onGameStarted = () => {
        // this._battles = new Map();
        // new Array(this.roundSize).forEach((ignore, round) => {
        //     this._battles.set(round, new Battle());
        // });
        //
        // this._currentRound = 1;
        // this._battles.set(this._currentRound, new Battle());
    };

    public static create(ownerId): Promise<OnlineGame> {

        const newGameId = database().ref().child("games").push().key;
        // TODO: get human readable id.
        const roomId = Date.now().toString(10);

        const updates = {};
        updates[`/games/${newGameId}`] = {
            members: {[ownerId]: true},
            roomId: Date.now(),
        };

        return database().ref()
            .update(updates)
            .then(() => new OnlineGame(newGameId));
    }

    // public join(gameId: string, memberId: string): Promise<Response> {
    //     // return requestJoinGame(gameId, memberId);
    // }

    public isSingleMode(): boolean {
        return isSingleMode(this.mode);
    }

    public isMultiMode(): boolean {
        return isMultiMode(this.mode);
    }

    public isOnlineMode(): boolean {
        return isOnlineMode(this.mode);
    }
}

export default OnlineGame;
