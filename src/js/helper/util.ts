import { getRandomInteger } from "../../framework/utils";

/**
 * Create battle signal time, attack is available.
 * 3000 - 5000 ms.
 *
 * @return {number}
 *
 * TODO: Reconsider "Game Logic Function"'s place.
 */
export function createSignalTime(){
    return getRandomInteger(3000, 5000);
}

/**
 * Return promise that will resolve after provided time.
 *
 * @param time
 * @return {Promise<any>}
 */
export const wait = (time) => new Promise(resolve => setTimeout(resolve, time));