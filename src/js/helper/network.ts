/**
 * @fileOverview convenience functions related to network, WebAPI and browser location.
 */
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
 * @param {string} text
 */
export function tweetGameResult(text: string): void {
    goTo(`${URL.TWITTER_TWEET_PAGE}?hashtags=おいものみきり+%23そこんところ工房&text=${text}&url=${URL.OIMO_NO_MIKIRI}`);
}

/**
 * Post play log to Sokontokoro app server
 * TODO: change this app support in app server.
 *
 * @param {number} point
 * @returns {Promise<Response>}
 */
export function postPlayLog(point: number): Promise<Response> {
    return fetch(`${APP_SERVER_BASE_URL}scores/oimo/playlog/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({point})
    })
}
