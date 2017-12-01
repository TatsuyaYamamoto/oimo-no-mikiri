/**
 * @fileOverview convenience functions related to network, WebAPI and browser location.
 */
import {t} from '../../framework/i18n';
import {getRandomInteger} from "../../framework/utils";

import {Ids as StringIds} from '../resources/string';
import {APP_SERVER_BASE_URL, URL} from '../Constants';

/**
 * Convenience function to change browser location.
 *
 * @param {string} href
 */
export function goTo(href: string): void {
    window.location.href = href;
}

/**
 * Change browser location to ResultState tweet view in Twitter.
 *
 * @param {number} bestTime
 * @param {number} wins
 */
export function tweetGameResult(bestTime: number, wins: number): void {
    let tweetText = getRandomInteger(0, 1) === 0 ?
        t(StringIds.GAME_RESULT_TWEET1, {bestTime, wins}) :
        t(StringIds.GAME_RESULT_TWEET2, {bestTime, wins});

    if (wins === 0) {
        tweetText = t(StringIds.GAME_RESULT_TWEET_ZERO_POINT, {wins});
    }

    if (wins === 5) {
        tweetText = t(StringIds.GAME_RESULT_TWEET_COMPLETE, {bestTime, wins});
    }

    goTo(`${URL.TWITTER_TWEET_PAGE}?hashtags=おいものみきり+%23そこんところ工房&text=${tweetText}&url=${URL.OIMO_NO_MIKIRI}`);
}

/**
 * Post play log to Sokontokoro app server
 * Before connecting, format bestTime, mode and straightWins to supporting Integer.
 *
 *
 * @param {number} bestTime
 * @param {"beginner" | "novice" | "expert" | "two-players"} mode
 * @param {number} straightWins
 * @return {Promise<Response>}
 * @see https://github.com/TatsuyaYamamoto/lovelive-ranking/blob/master-javaee/src/main/java/net/sokontokoro_factory/lovelive/persistence/entity/ScoreEntity.java
 */
export function postPlayLog(bestTime: number, mode: 'beginner' | 'novice' | 'expert' | 'two-players', straightWins: number): Promise<Response> {
    const numberLevel = mode === 'beginner' ? 1
        : mode === "novice" ? 2
            : mode === "expert" ? 3
                : 4;
    const point = `${bestTime}${numberLevel}${straightWins}`;

    return fetch(`${APP_SERVER_BASE_URL}scores/oimo/playlog/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({point})
    })
}
