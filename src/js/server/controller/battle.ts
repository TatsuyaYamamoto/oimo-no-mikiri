import { Router, Request, Response } from "express";
import { database } from "firebase-admin";
import { OK, NOT_FOUND, BAD_REQUEST, ACCEPTED } from "http-status-codes";

import { getCurrentRoomId, getOpponentId } from "../service/room";
import { judge, startBattle } from "../service/battle";


const router = Router();

/**
 * Get current battle information.
 */
router.get("/", async (req: Request, res: Response) => {
    const {uid} = res.locals.token;

    const battleId = (await database().ref(`/users/${uid}/battleId`).once("value")).val();
    const battle = (await database().ref(`/battles/${battleId}`).once("value")).val();

    if (battle) {
        res.json(battle);
    } else {
        res.sendStatus(NOT_FOUND);
    }
});

router.post("/start", async (req: Request, res: Response) => {
    const {uid} = res.locals.token;
    const roomId = await getCurrentRoomId(uid);

    startBattle(roomId);
});


/**
 * Get battle result.
 */
router.get("/result", async (req: Request, res: Response) => {
    const {uid} = res.locals.token;

    const roomId = await getCurrentRoomId(uid);

    const battleId = (await database().ref(`/rooms/${roomId}/battleId`).once("value")).val();
    const battle = (await database().ref(`/battles/${battleId}`).once("value")).val();

    console.log(`Get battle result ID: ${battleId}`, battle);

    const {
        winnerId,
        falseStarterId,
    } = battle;

    if (battle) {
        res.json({
            winnerId,
            falseStarterId
        });
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
