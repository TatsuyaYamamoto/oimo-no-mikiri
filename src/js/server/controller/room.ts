import { Router, Request, Response } from "express";
import { database } from "firebase-admin";
import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK } from "http-status-codes";

const router = Router();

/**
 * Create new room.
 */
router.post("/create", async (req: Request, res: Response) => {
    // TODO: check current user status. ex: the user is already any room owner.
    const {uid} = res.locals.token;
    const newRoomId = database().ref().child("rooms").push().key;

    const updates = {};
    updates[`/rooms/${newRoomId}/members/${uid}`] = true;
    updates[`/users/${uid}/roomId`] = newRoomId;


    await database().ref().update(updates);
    res.status(CREATED).json({roomId: newRoomId});
});

/**
 * Join room.
 */
router.post("/join", async (req: Request, res: Response) => {
    // TODO: check current user status. ex: the user is already any room owner.
    const {roomId} = req.body;
    const {uid} = res.locals.token;

    const roomSnapshot = await database().ref(`/rooms/${roomId}`).once("value");
    if (!roomSnapshot.val()) {
        res.sendStatus(NOT_FOUND);
        return;
    }

    const membersRef = database().ref(`/rooms/${roomId}/members`);
    const {committed, snapshot} = await membersRef.transaction((current) => {
        if (!current) {
            return current;
        }

        if (Object.keys(current).length >= 2) {
            return;
        }

        current[uid] = true;
        return current;
    });

    if (!committed) {
        res.status(CONFLICT).send(`Provided room, ${roomId} is not acceptable.`);
        return;
    }

    const updates = {};
    updates[`/users/${uid}/roomId`] = roomId;

    await database().ref().update(updates);

    res.sendStatus(OK);
});

/**
 * Leave room.
 *
 */
router.post("/leave",  async (req: Request, res: Response) => {
    const {uid} = res.locals.token;

    const userSnapshot = await database().ref(`/users/${uid}`).once("value");
    const user = userSnapshot.val();

    if (!(user && user.roomId)) {
        res.status(BAD_REQUEST).send("Provided user or current room isn't exist.");
        return;
    }

    const {roomId} = user;

    const updates = {};
    updates[`/rooms/${roomId}/members/${uid}`] = null;
    updates[`/users/${uid}/roomId`] = null;

    await database().ref().update(updates);

    res.sendStatus(OK);
});

export default router;