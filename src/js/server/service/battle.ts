import { database } from "firebase-admin";
import { createSignalTime, wait } from "../../helper/util";
import UserStatus from "./UserStatus";
import { getCurrentRoomId } from "./room";

const ACCEPTABLE_OUT_SIDE_ATTACK_INTERVAL = 100;

export async function startBattle(roomId: string): Promise<void> {

    const updates = {};
    const signalTime = createSignalTime();
    const room = (await database().ref(`/rooms/${roomId}/`).once("value")).val();

    const previousBattleId = room.battleId;
    const remainingRoundSize = room.roundSize - room.currentRound + 1;
    const wins = {};
    const falseStarted = {};

    if (previousBattleId) {
        const previousBattle = (await database().ref(`/battles${previousBattleId}`).once("value")).val();

        previousBattle.falseStarted && Object.keys(previousBattle.falseStarted).forEach((userId) => {
            falseStarted[userId] = true;
        });
    }

    const nextBattleId = database().ref().child("battles").push().key;
    updates[`/battles/${nextBattleId}`] = {
        signalTime,
        falseStarted,
        wins,
        remainingRoundSize
    };
    updates[`/rooms/${roomId}/battleId`] = nextBattleId;
    Object.keys(room.members).forEach((userId) => {
        updates[`/users/${userId}/battleId`] = nextBattleId;
    });


    return database().ref().update(updates);
}

export async function judge(attackerId: string,
                            attackTime: number) {
    const roomId = await getCurrentRoomId(attackerId);
    const room = (await database().ref(`/rooms/${roomId}`).once("value")).val();
    const opponentId = Object.keys(room.members).find((userId) => userId !== attackerId);
    const battleId = room.battleId;
    const battle = (await database().ref(`/battles/${battleId}`).once("value")).val();

    if (battle.attackTime[attackerId]) {
        // Attacker already called judgement.
        return;
    }

    const {snapshot} = await database()
        .ref(`/battles/${battleId}`)
        .transaction((current) => {
            if (current) {
                current.attackTime[attackerId] = attackTime;

                if (attackTime < current.signalTime) {
                    if (current.falseStarted[attackerId]) {
                        current.winnerId = opponentId;
                    } else {
                        current.falseStarted[attackerId] = true;
                    }
                }
            }

            return current;
        });

    const battleResult = snapshot.val();

    // Did player lose by false-start?
    if (battleResult.winnerId) {
        const updates = {};
        updates[`/users/${attackerId}/status`] = UserStatus.LOSE;
        updates[`/users/${opponentId}/status`] = UserStatus.WIN;
        return Promise
            .all([
                startBattle(roomId),
                database().ref().update(updates)
            ]);
    }

    // Did player false-start?
    if (battleResult.falseStarted[attackerId]) {
        const updates = {};
        updates[`/users/${attackerId}/status`] = UserStatus.FALSE_START;
        updates[`/users/${opponentId}/status`] = UserStatus.FALSE_START;
        return database().ref().update(updates);
    }

    // Player succeed to attack.
    await wait(ACCEPTABLE_OUT_SIDE_ATTACK_INTERVAL);

    const updates = {};
    updates[`/users/${attackerId}/status`] = UserStatus.DRAW;
    updates[`/users/${opponentId}/status`] = UserStatus.DRAW;

    updates[`/battles/${battleId}`] = null;

    return database().ref().update(updates);
}
