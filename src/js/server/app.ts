import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";

import authorization from "./authorization";
import rooms from "./rooms";
import game from "./game";

const cors = require("cors")({origin: true});
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors);

app.use(authorization);
app.use("/rooms", rooms);
app.use("/game", game);

export default app;
