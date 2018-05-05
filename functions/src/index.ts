import { https, config } from 'firebase-functions';
import { initializeApp } from 'firebase-admin';

initializeApp(config().firebase);

import serverApp from "./app";

export const app = https.onRequest(serverApp);

