import * as express from "express";
import * as morgan from "morgan";
import { auth, database } from "firebase-admin";

import { UNAUTHORIZED, ACCEPTED } from "http-status-codes"

const app = express();

app.use(morgan("dev"));

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

app.post("/createRoom", (req: express.Request, res: express.Response) => {
    res.sendStatus(ACCEPTED);

    // TODO: check current user status. ex: the user is already any room owner.
    const {uid} = res.locals.token;
    const newRoomId = database().ref().child("rooms").push().key;

    const updates = {};
    updates[`/rooms/${newRoomId}/members/${uid}`] = true;
    updates[`/users/${uid}/roomId`] = newRoomId;

    return database().ref().update(updates);
});

app.post("/joinRoom", (req: express.Request, res: express.Response) => {
    // const {uid} = res.locals.token;

    res.sendStatus(ACCEPTED);
});


export default app;
