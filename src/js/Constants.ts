/**
 * Parameters for game tuning.
 */
export const GAME_PARAMETERS = {
    /**
     * NPC's reaction rate after turning action active.
     * These values' unit is in seconds.
     *
     * @see http://dic.nicovideo.jp/a/%E5%88%B9%E9%82%A3%E3%81%AE%E8%A6%8B%E6%96%AC%E3%82%8A
     */
    reaction_rate: {
        beginner: {
            1: 81 / 60,
            2: 49 / 60,
            3: 20 / 60,
            4: 15 / 60,
            5: 10 / 60
        },
        novice: {
            1: 62 / 60,
            2: 40 / 60,
            3: 16 / 60,
            4: 12 / 60,
            5: 9 / 60
        },
        expert: {
            1: 17 / 60,
            2: 13 / 60,
            3: 11 / 60,
            4: 9 / 60,
            5: 7 / 60
        }
    }
};

export enum NPC_LEVELS {
    BEGINNER = 'beginner',
    NOVICE = 'novice',
    EXPERT = 'expert',
}

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
 * Skip game count state on game view if true.
 *
 * @type {boolean}
 */
export const SKIP_COUNT_DOWN_FOR_GAME_START = false;

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
    OIMO_NO_MIKIRI: "http://games.sokontokoro-factory.net/oimo-no-mikiri/",
    SOKONTOKORO_HOME: 'http://sokontokoro-factory.net',
    TWITTER_HOME_T28: "https://twitter.com/t28_tatsuya",
    TWITTER_HOME_SANZASHI: "https://twitter.com/xxsanzashixx",
    TWITTER_TWEET_PAGE: "https://twitter.com/intent/tweet",
    ONJIN_TOP: 'https://on-jin.com/',
    LOVELIVE_TOP: 'http://www.lovelive-anime.jp/',
};
