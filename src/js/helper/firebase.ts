import {
    initializeApp,
    auth,
    database
} from "firebase";

import { parse } from "query-string";

export function init() {
    initializeApp({
        "apiKey": "AIzaSyB16fI2MRL411jYOCjW1eL7hTuwOvlq3w8",
        "databaseURL": "https://oimo-no-mikiri-development.firebaseio.com",
        "storageBucket": "oimo-no-mikiri-development.appspot.com",
        "authDomain": "oimo-no-mikiri-development.firebaseapp.com",
        "messagingSenderId": "888607734391",
        "projectId": "oimo-no-mikiri-development"
    });

    return auth().signInAnonymously().then(user => {
        const ownRef = database().ref(`/users/${user.uid}`);
        const connectUpdates = {};
        connectUpdates["isConnecting"] = true;
        ownRef.update(connectUpdates);
        ownRef.onDisconnect().set({isConnecting: false});
    });
}

export async function requestCreateRoom() {
    return getToken()
        .then((token) =>
            fetch(`http://localhost:5000/oimo-no-mikiri-development/us-central1/app/rooms/`, {
                method: "POST",
                headers: {"Authorization": `Bearer ${token}`}
            })
        )
        .then(res => res.json())
        .then(json => json.roomId);
}

export async function requestJoinRoom(roomId) {
    return getToken()
        .then((token) =>
            fetch(`http://localhost:5000/oimo-no-mikiri-development/us-central1/app/rooms/join`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({roomId})
            })
        );
}

export async function requestLeaveRoom() {
    return getToken()
        .then((token) =>
            fetch(`http://localhost:5000/oimo-no-mikiri-development/us-central1/app/rooms/leave`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
        );
}

export function onJoinedRoom(roomId, callback) {
    const membersRef = database().ref(`/rooms/${roomId}/members`);

    membersRef.on("value", function (snapshot) {
        const member = snapshot.val();

        if (member && Object.keys(member).length >= 2) {
            callback();
            offJoinedRoom(roomId);
        }
    });
}

export function offJoinedRoom(roomId) {
    const membersRef = database().ref(`/rooms/${roomId}/members`);

    membersRef.off("value");
}

export async function requestStartGame() {
    const token = await getToken();

    return fetch(`http://localhost:5000/oimo-no-mikiri-development/us-central1/app/game/start`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });
}

export function onStatusUpdated(callback) {
    const {uid} = auth().currentUser;

    const ownStatusRef = database().ref(`/users/${uid}/status`);

    ownStatusRef.on("value", function (snapshot) {
        callback(snapshot.val());
    });
}

export function offStatusUpdated() {
    const {uid} = auth().currentUser;

    const ownStatusRef = database().ref(`/users/${uid}/status`);

    ownStatusRef.off("value");
}

export async function requestAttack(attackTime) {
    const token = await getToken();

    return fetch(`http://localhost:5000/oimo-no-mikiri-development/us-central1/app/battles/attack`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({attackTime})
    });
}

export async function requestFalseStart(attackTime) {
    const token = await getToken();

    return fetch(`http://localhost:5000/oimo-no-mikiri-development/us-central1/app/battles/falseStart`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({attackTime})
    });
}

export function onResultFixed() {

}

export function isConnected(): Promise<boolean> {
    return database().ref('.info/connected')
        .once('value')
        .then((snap) => snap.val());
}

async function getToken() {
    const token = await auth().currentUser.getIdToken(true);
    console.log(`Got Firebase Token! ${token.slice(0, 10)}...`);

    return token;
}

export function getRoomIdFromUrl() {
    const parsed = parse(window.location.search);
    return parsed.roomId;
}
