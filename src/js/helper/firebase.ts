import {
    initializeApp,
    auth,
    database
} from "firebase";

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

        if (snap.val() === true) {
            const ownRef = database().ref(`/users/${user.uid}/isConnecting`);
            ownRef.set(true);
            ownRef.onDisconnect().set(false);
        }
    });

    auth().signInAnonymously();
}

export function isConnected(): Promise<boolean> {
    return database().ref('.info/connected')
        .once('value')
        .then((snap) => snap.val());
}
