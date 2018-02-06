// import { database } from "firebase-admin";
// import { getCurrentRoomId, getOpponentId } from "./room";
//
// export async function create(roomId: string): Promise<void> {
//     const runningTimeoutId = (await database().ref(`/battles/${battleId}/timeoutId`).once("value")).val();
//
//     const newBattleId = database().ref().child("battles").push().key;
//
//     const updates = {};
//
//     return database().ref(`/battles/${newBattleId}`).update(updates);
// }
//
// export async function attackBy(attackerId: string, attackTime: number, battleId: string) {
//     const roomId = await getCurrentRoomId(attackerId);
//     const opponentId = await getOpponentId(roomId, attackerId);
//     const signalTime = await getSignalTime(battleId);
//
//
//     const opponentAttackTime = await getAttackTime(battleId, opponentId);
//
//
// }
//
// async function getAttackTime(battleId: string, userId: string) {
//     return (await database().ref(`/battles/${battleId}/attackTime/${userId}`).once("value")).val();
// }
//
// async function getSignalTime(battleId: string) {
//     return (await database().ref(`/battles/${battleId}/signalTime`).once("value")).val();
// }
//
