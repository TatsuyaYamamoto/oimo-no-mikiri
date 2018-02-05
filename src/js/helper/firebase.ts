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

    database().ref('.info/connected').on('value', function (snap) {
        const user = auth().currentUser;
        if (!user) {
            return;
        }

        user.getIdToken().then((idToken) => {
            console.log(`Got Firebase Token! ${idToken.slice(0, 5)}...`);
        });

        if (snap.val() === true) {
            const ownRef = database().ref(`/users/${user.uid}/isConnecting`);
            ownRef.set(true);
            ownRef.onDisconnect().set(false);
        }
    });

    auth().signInAnonymously();
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
            membersRef.off("value", this);
            callback();
        }
    });
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

export function getRoomIdFromUrl(){
    const parsed = parse(window.location.search);
    return parsed.roomId;
}
