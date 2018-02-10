import { database } from "firebase-admin";

import * as express from "express";
import * as morgan from "morgan";
import { OK } from "http-status-codes";

import authorization from "./authorization";

const app = express();
app.use(require("cors")({origin: true}));
app.use(morgan("dev"));
app.use(authorization);

app.post("/createGame", async (req: express.Request, res: express.Response) => {
    const {uid} = res.locals.token;
    const gameId = database().ref().child("games").push().key;


    const updates = {};
    updates[`/games/${gameId}`] = {
        memberIds: {
            [uid]: true
        }
    };

    await database().ref().update(updates);
    res.status(OK).json({gameId})
});

export default app;
