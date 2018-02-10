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
    return post(`http://localhost:5000/oimo-no-mikiri-development/us-central1/createGame`)
        .then(res => res.json())
        .then(json => json.gameId);
}

async function post(input: string, json?: any) {
    return getToken()
        .then((token) =>
            fetch(input, {
                method: "POST",
                headers: {"Authorization": `Bearer ${token}`},
                body: JSON.stringify(json)
            })
        )
}

async function getToken(forceRefresh?: boolean) {
    const token = await auth().currentUser.getIdToken(forceRefresh);
    console.log(`Got Firebase Token! ${token.slice(0, 10)}...`);

    return token;
}
