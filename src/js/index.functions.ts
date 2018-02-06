import {initializeApp} from "firebase-admin";
import {https, config} from "firebase-functions";

initializeApp(config().firebase);

import serverApp from "./server/app";

export const app = https.onRequest(serverApp);
