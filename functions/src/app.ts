import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";

import { auth, database } from "firebase-admin";

import { UNAUTHORIZED, NOT_FOUND, CREATED, OK } from "http-status-codes"

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

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
    res.sendStatus(CREATED);
});

app.post("/joinRoom", async (req: express.Request, res: express.Response) => {
    // TODO: check current user status. ex: the user is already any room owner.
    const {roomId} = req.body;
    const {uid} = res.locals.token;
    
    const snapshot = await database().ref(`/rooms/${roomId}`).once("value");
    if (!snapshot.val()) {
        res.sendStatus(NOT_FOUND);
        return;
    }

    const updates = {};
    updates[`/rooms/${roomId}/members/${uid}`] = true;
    updates[`/users/${uid}/roomId`] = roomId;

    await database().ref().update(updates);

    res.sendStatus(OK);
});


export default app;
