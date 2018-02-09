import {initializeApp} from "firebase-admin";
import {https, config} from "firebase-functions";

// For unhandled promise rejection.
process.on('unhandledRejection', console.dir);

initializeApp(config().firebase);

import serverApp from "./server/app";

export {onDisconnected} from "./server/db";

export const app = https.onRequest(serverApp);
