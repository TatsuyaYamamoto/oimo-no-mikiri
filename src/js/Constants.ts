import {Level} from './models/Mode'

/**
 * Parameters for game tuning.
 */
export const GAME_PARAMETERS = {
    /**
     * for tuning NPC's reaction rate.
     * {@link GAME_PARAMETERS.reaction_rate} according to original is too short for test player.
     */
    reaction_rate_tuning: 2.0,

    /**
     * NPC's reaction rate after turning action active.
     * These values' unit is in seconds.
     *
     * @see http://dic.nicovideo.jp/a/%E5%88%B9%E9%82%A3%E3%81%AE%E8%A6%8B%E6%96%AC%E3%82%8A
     */
    reaction_rate: {
        [Level.BEGINNER]: {
            1: 81 / 60,
            2: 49 / 60,
            3: 20 / 60,
            4: 15 / 60,
            5: 10 / 60
        },
        [Level.NOVICE]: {
            1: 62 / 60,
            2: 40 / 60,
            3: 16 / 60,
            4: 12 / 60,
            5: 9 / 60
        },
        [Level.EXPERT]: {
            1: 17 / 60,
            2: 13 / 60,
            3: 11 / 60,
            4: 9 / 60,
            5: 7 / 60
        }
    },

    /**
     * Attack time distance time[ms] of player and opponent as draw.
     */
    acceptable_attack_time_distance: 17
};

/**
 * aspect ratio of the application container.
 *
 * @type {number}
 */
export const ASPECT_RATIO = 16 / 9;

/**
 * Basic width of the application view.
 * This app's assets is draw as premise of this.
 *
 * @type {number}
 */
export const BASIC_IMAGE_WIDTH = 800;

/**
 * Basic height of the application view.
 * This app's assets is draw as premise of this.
 * An alias to {@code BASIC_IMAGE_WIDTH / ASPECT_RATIO}.
 *
 * @type {number}
 */
export const BASIC_IMAGE_HEIGHT = BASIC_IMAGE_WIDTH / ASPECT_RATIO;

/**
 * Skip ready state animation before game action if true.
 *
 * @type {boolean}
 */
export const SKIP_READY_ANIMATION = false;

/**
 * Skip brant logo animation on load view if true.
 *
 * @type {boolean}
 */
export const SKIP_BRAND_LOGO_ANIMATION = false;

/**
 * Supported languages.
 */
export const SUPPORTED_LANGUAGES = {
    EN: "en",
    JA: "ja"
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN;

/**
 * Application server base URL
 * @type {string}
 */
export const APP_SERVER_BASE_URL = process.env.NODE_ENV === 'production' ?
    "http://api.sokontokoro-factory.net/lovelive/" :
    "http://api.sokontokoro-factory.net/lovelive-test/";

/**
 * External URLs.
 */
export const URL = {
    OIMO_NO_MIKIRI: "http://games.sokontokoro-factory.net/oimo/",
    SOKONTOKORO_HOME: 'http://sokontokoro-factory.net',
    TWITTER_HOME_T28: "https://twitter.com/t28_tatsuya",
    TWITTER_HOME_SANZASHI: "https://twitter.com/xxsanzashixx",
    TWITTER_TWEET_PAGE: "https://twitter.com/intent/tweet",
    ONJIN_TOP: 'https://on-jin.com/',
    LOVELIVE_TOP: 'http://www.lovelive-anime.jp/',
    KIRBY_HOME: 'https://www.nintendo.co.jp/n02/shvc/p_akfj/',
};

export const GOOGLE_ANALYTICS_ACCOUNT_ID = process.env.NODE_ENV === 'production' ?
    "UA-64858827-7" :   // For oimo production tracking.
    "UA-64858827-8";    // For test tracking.
