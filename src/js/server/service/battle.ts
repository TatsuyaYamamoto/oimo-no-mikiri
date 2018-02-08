import { database } from "firebase-admin";
import { createSignalTime, wait } from "../../helper/util";
import UserStatus from "./UserStatus";
import { getCurrentRoomId } from "./room";

export async function startBattle(roomId: string): Promise<void> {
    console.log(`Start battle to room ID: ${roomId}`);

    const updates = {};
    const signalTime = createSignalTime();
    const room = (await database().ref(`/rooms/${roomId}/`).once("value")).val();

    const previousBattleId = room.battleId;
    const remainingRoundSize = room.roundSize - room.currentRound + 1;
    const wins = {};
    const falseStartedInPreviousBattle = {};

    if (previousBattleId) {
        const previousBattle = (await database().ref(`/battles/${previousBattleId}`).once("value")).val();
        previousBattle.falseStarterId && Object.keys(previousBattle.falseStarted).forEach((userId) => {
            falseStartedInPreviousBattle[userId] = true;
            
        });
    }

    const nextBattleId = database().ref().child("battles").push().key;
    updates[`/battles/${nextBattleId}`] = {
        signalTime,
        falseStartedInPreviousBattle,
        wins,
        remainingRoundSize
    };
    updates[`/rooms/${roomId}/battleId`] = nextBattleId;
    Object.keys(room.members).forEach((userId) => {
        updates[`/users/${userId}/battleId`] = nextBattleId;
        updates[`/users/${userId}/status`] = UserStatus.BATTLE_READY;
    });


    return database().ref().update(updates);
}

export async function judge(attackerId: string,
                            attackTime: number) {
    console.log(`Judge to attacker ID: ${attackerId}, attack time: ${attackTime}`);

    const roomId = await getCurrentRoomId(attackerId);
    const room = (await database().ref(`/rooms/${roomId}`).once("value")).val();
    const opponentId = Object.keys(room.members).find((userId) => userId !== attackerId);
    const battleId = room.battleId;
    const battle = (await database().ref(`/battles/${battleId}`).once("value")).val();

    if (battle.attackTime) {
        // It is already called judgement in the battle.
        return null;
    }

    const {snapshot} = await database()
        .ref(`/battles/${battleId}`)
        .transaction((current) => {
            if (current && !current.isFixed) {
                current.attackerId = attackerId;
                current.attackTime = attackTime;

                if (attackTime < 0) {
                    current.falseStarterId = attackerId;

                    if (current["falseStartedInPreviousBattle"] && current["falseStartedInPreviousBattle"][attackerId]) {
                        current.winnerId = opponentId;
                    }
                } else {
                    current.winnerId = attackerId;
                }
            }

            return current;
        });


    const updates = {};
    updates[`/users/${attackerId}/status`] = UserStatus.BATTLE_RESULT_FIX;
    updates[`/users/${opponentId}/status`] = UserStatus.BATTLE_RESULT_FIX;

    return Promise
        .all([
            database().ref().update(updates),
            wait(5000),
        ])
    .then(() => startBattle(roomId));
}
