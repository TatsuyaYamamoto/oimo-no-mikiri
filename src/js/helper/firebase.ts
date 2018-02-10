import {
    initializeApp,
    auth,
    database
} from "firebase";

import { FIREBASE_OPTIONS } from "../Constants";

export function init() {
    initializeApp(FIREBASE_OPTIONS);

    database().ref('.info/connected').on('value', function (snapshot) {
        const user = auth().currentUser;
        if (!user) {
            return;
        }

        if (snapshot.exists()) {
            const ownRef = database().ref(`/users/${user.uid}/isConnecting`);
            ownRef.set(true);
            ownRef.onDisconnect().set(false);
        }
    });

    auth().signInAnonymously();
}

export async function requestCreateGame() {
    return post(`http://localhost:5000/oimo-no-mikiri-development/us-central1/app/createGame`)
        .then(res => res.json())
        .then(json => json.gameId);
}

export async function requestJoinGame(gameId: string) {
    return post(`http://localhost:5000/oimo-no-mikiri-development/us-central1/app/joinGame`, {
        gameId
    });
}

async function post(input: string, json?: any) {
    const fetchInit = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${await getToken()}`
        },
        body: JSON.stringify(json)
    };
    if (json) {
        fetchInit.headers["Content-Type"] = "application/json";
    }

    return fetch(input, fetchInit);
}

async function getToken(forceRefresh?: boolean) {
    const token = await auth().currentUser.getIdToken(forceRefresh);
    console.log(`Got Firebase Token! ${token.slice(0, 10)}...`);

    return token;
}
