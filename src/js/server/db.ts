import * as functions from "firebase-functions"
import { database } from "firebase-admin"

import UserStatus from "./service/UserStatus";

export const onDisconnected = functions.database.ref("/users/{uid}/isConnecting")
    .onUpdate(async (event) => {
        const isConnecting = event.data.val();
        if (isConnecting) {
            return null;
        }

        const {uid} = event.params;

        const roomId = (await database().ref(`/users/${uid}/roomId`).once("value")).val();
        const roomMembers = (await database().ref(`/rooms/${roomId}/members`).once("value")).val();

        if (!roomMembers) {
            return null;
        }

        const opponentId = Object.keys(roomMembers).find((userId) => userId !== uid);
        if (!opponentId) {
            return null;
        }

        const updates = {};
        updates[`/users/${opponentId}/status`] = UserStatus.OPPONENT_DISCONNECTED;

        return database().ref().update(updates);
    });
