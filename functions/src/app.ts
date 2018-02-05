import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";

import { auth, database } from "firebase-admin";

import { UNAUTHORIZED, NOT_FOUND, CREATED, OK, BAD_REQUEST, CONFLICT } from "http-status-codes"

const cors = require("cors")({origin: true});
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors);

app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // get token with header or cookies.
    const authorization = req.header("Authorization");
    let token = "";
    if (authorization && authorization.startsWith("Bearer ")) {
        token = authorization.split("Bearer ")[1];
    } else if (req.cookies) {
        token = req.cookies.__session;
    }

    try {
        res.locals.token = await auth().verifyIdToken(token);
        next();
    } catch (e) {
        res.status(UNAUTHORIZED).send(e.message);
    }
});

app.post("/createRoom", async (req: express.Request, res: express.Response) => {


    // TODO: check current user status. ex: the user is already any room owner.
    const {uid} = res.locals.token;
    const newRoomId = database().ref().child("rooms").push().key;

    const updates = {};
    updates[`/rooms/${newRoomId}/members/${uid}`] = true;
    updates[`/users/${uid}/roomId`] = newRoomId;


    await database().ref().update(updates);
    res.status(CREATED).json({roomId: newRoomId});
});

app.post("/joinRoom", async (req: express.Request, res: express.Response) => {
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

app.post("/leaveRoom", async (req: express.Request, res: express.Response) => {
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


export default app;
