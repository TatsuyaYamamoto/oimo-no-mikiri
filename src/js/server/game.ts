import { Router, Request, Response } from "express";
import { database } from "firebase-admin";
import { OK } from "http-status-codes";

import { getCurrentRoomId, getOpponentId } from "./service/room";
import UserStatus from "./service/UserStatus";

const router = Router();

router.post("/start", async (req: Request, res: Response) => {
    const {uid} = res.locals.token;
    const currentRoomId = await getCurrentRoomId(uid);
    const opponentId = await getOpponentId(currentRoomId, uid);

    const isOpponentWaiting = (current) => current[opponentId].status === UserStatus.WAITING_GAME_READY;
    await database().ref(`/users`).transaction((current) => {
        if (current && current[uid] && current[opponentId]) {
            // Is the opponent already waiting?
            if (current[opponentId].status === UserStatus.WAITING_GAME_READY) {
                // Game is ready.
                current[`${uid}/status`] = UserStatus.GAME_READY;
                current[`${opponentId}/status`] = UserStatus.GAME_READY;
            } else {
                // Player wait that opponent requests starting.
                current[`${uid}/status`] = UserStatus.WAITING_GAME_READY;
            }
        }

        return current;
    });

    res.sendStatus(OK);
});

export default router;
