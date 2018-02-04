import {initializeApp} from "firebase-admin";
import {https} from "firebase-functions";

initializeApp();

import serverApp from "./app";

export const app = https.onRequest(serverApp);
