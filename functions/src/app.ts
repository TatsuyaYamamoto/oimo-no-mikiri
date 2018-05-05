import { database } from "firebase-admin";

import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import { OK } from "http-status-codes";

import authorization from "./authorization";

const app = express();
app.use(bodyParser.json());
app.use(require("cors")({origin: true}));
app.use(morgan("dev"));
app.use(authorization);

app.post("/createGame", async (req: express.Request, res: express.Response) => {
    const {uid} = res.locals.token;
    const gameId = database().ref().child("games").push().key;


    const updates = {};
    updates[`/games/${gameId}/members/${uid}`] = true;
    await database().ref().update(updates);
    res.status(OK).json({gameId})
});

app.post("/joinGame", async (req: express.Request, res: express.Response) => {
    const {uid} = res.locals.token;
    const {gameId} = req.body;

    const updates = {};
    updates[`/games/${gameId}/members/${uid}`] = true;
    await database().ref().update(updates);
    res.status(OK).send();
});

export default app;
