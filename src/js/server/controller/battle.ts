import { Router, Request, Response } from "express";
import { database } from "firebase-admin";
import { OK, NOT_FOUND, BAD_REQUEST, ACCEPTED } from "http-status-codes";

import { getCurrentRoomId, getOpponentId } from "../service/room";
import { judge } from "../service/battle";


const router = Router();

/**
 * Get current battle information.
 */
router.get("/", async (req: Request, res: Response) => {
    const {uid} = res.locals.token;
    const currentRoomId = await getCurrentRoomId(uid);

    const currentBattle = (await database().ref(`/rooms/${currentRoomId}/currentBattle`).once("value")).val();

    if (currentBattle) {
        res.json(currentBattle);
    } else {
        res.sendStatus(NOT_FOUND);
    }
});

/**
 * Get battle result.
 */
router.get("/result", async (req: Request, res: Response) => {
    const {uid} = res.locals.token;
    const currentRoomId = await getCurrentRoomId(uid);

    const currentBattle = (await database().ref(`/rooms/${currentRoomId}/currentBattle`).once("value")).val();

    if (currentBattle) {
        res.json(currentBattle);
    } else {
        res.sendStatus(BAD_REQUEST);
    }
});


/**
 * Request attack
 *
 */
router.post("/attack", async (req: Request, res: Response) => {
    const {uid} = res.locals.token;
    const {
        attackTime,
    } = req.body;



    res.sendStatus(ACCEPTED);

    return judge(uid, attackTime);

});

export default router;
