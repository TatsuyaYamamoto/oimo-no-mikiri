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

    const opponentStatus = (await database().ref(`/users/${opponentId}/status`).once("value")).val();
    const updates = {};
    if (opponentStatus === UserStatus.WAITING_GAME_READY) {
        updates[`/users/${uid}/status`] = UserStatus.GAME_READY;
        updates[`/users/${opponentId}/status`] = UserStatus.GAME_READY;
    } else {
        updates[`/users/${uid}/status`] = UserStatus.WAITING_GAME_READY;
    }

    await database().ref().update(updates);
    res.sendStatus(OK);
});

export default router;
