import { database } from "firebase-admin";

/**
 *
 * @param {string} userId
 * @return {Promise<string | null>}
 */
export async function getCurrentRoomId(userId: string): Promise<string | null> {
    return (await database().ref(`/users/${userId}/roomId`).once("value")).val()
}

/**
 *
 * @param {string} roomId
 * @param {string} userId
 * @return {Promise<string | null>}
 */
export async function getOpponentId(roomId: string, userId: string): Promise<string | null> {
    const members = (await database().ref(`/rooms/${roomId}/members`).once("value")).val();

    return Object.keys(members).find(id => id !== userId);
}
