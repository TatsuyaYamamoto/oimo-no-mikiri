import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";

import authorization from "./middleware/authorization";
import room from "./controller/room";
import game from "./controller/game";
import battle from "./controller/battle";

const cors = require("cors")({origin: true});
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors);

app.use(authorization);
app.use("/room", room);
app.use("/game", game);
app.use("/battle", battle);

export default app;
