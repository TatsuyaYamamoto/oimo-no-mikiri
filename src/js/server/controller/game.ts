import { Router, Request, Response } from "express";
import { database } from "firebase-admin";
import { OK } from "http-status-codes";

import { getCurrentRoomId, getOpponentId } from "../service/room";
import UserStatus from "../service/UserStatus";
import { createSignalTime, wait } from "../../helper/util";
import { startBattle } from "../service/battle";

const router = Router();

const BATTLE_CREATE_INTERVAL_AFTER_GAME_READY = 3000;

/**
 * Request start game.
 */
router.post("/start", async (req: Request, res: Response) => {
    const {uid} = res.locals.token;
    const roomId = await getCurrentRoomId(uid);
    const opponentId = await getOpponentId(roomId, uid);

    const {snapshot} = await database().ref(`/users`).transaction((current) => {
        if (current && current[uid] && current[opponentId]) {
            // Is the opponent already waiting?
            if (current[opponentId]["status"] === UserStatus.WAITING_GAME_READY) {
                // Game is ready.
                current[uid]["status"] = UserStatus.GAME_READY;
                current[opponentId]["status"] = UserStatus.GAME_READY;
            } else {
                // Player wait that opponent requests starting.
                current[uid]["status"] = UserStatus.WAITING_GAME_READY;
            }
        }

        return current;
    });

    res.sendStatus(OK);

    const users = snapshot.val();
    if (users[uid]["status"] === UserStatus.GAME_READY && users[opponentId]["status"] === UserStatus.GAME_READY) {
        const updates = {};
        updates[`/users/${uid}/status`] = UserStatus.BATTLE_READY;
        updates[`/users/${opponentId}/status`] = UserStatus.BATTLE_READY;
        updates[`/rooms/${roomId}/roundSize`] = 5;
        updates[`/rooms/${roomId}/currentRound`] = 1;
        updates[`/rooms/${roomId}/wins/${uid}`] = 0;
        updates[`/rooms/${roomId}/wins/${opponentId}`] = 0;

        return Promise
            .all([
                database().ref().update(updates),
                startBattle(roomId),
                wait(BATTLE_CREATE_INTERVAL_AFTER_GAME_READY)
            ])
    } else {
        return null;
    }
});

export default router;
