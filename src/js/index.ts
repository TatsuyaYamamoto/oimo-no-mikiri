/**
 * @fileOverview Entry point of the application.
 */
import config from '../framework/config';
import {initI18n} from "../framework/i18n";

import ApplicationState from "./fsm/ApplicationState";
import resources from './resources/string';
import {init as initTracker, trackError} from './helper/tracker';
import {
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    BASIC_IMAGE_WIDTH,
    BASIC_IMAGE_HEIGHT,
    GOOGLE_ANALYTICS_ACCOUNT_ID
} from "./Constants";

// Network fetch module
import 'whatwg-fetch';

// Brand logo text font
require('../fonts/PixelMplus10-Regular.css');
require('../fonts/g_brushtappitsu_freeH.css');

// initialize tracker
initTracker(GOOGLE_ANALYTICS_ACCOUNT_ID);

/**
 * Rendering target on html.
 *
 * @type {HTMLElement}
 */
const mainElement: HTMLElement = document.getElementById('main');

/**
 * Application root instance.
 *
 * @type {ApplicationState}
 */
const app = new ApplicationState();

/**
 * Initialize the application.
 */
function init() {
    // set framework configuration
    config.supportedLanguages = Object.keys(SUPPORTED_LANGUAGES).map((key) => SUPPORTED_LANGUAGES[key]);
    config.defaultLanguage = DEFAULT_LANGUAGE;
    config.basicImageWidth = BASIC_IMAGE_WIDTH;
    config.basicImageHeight = BASIC_IMAGE_HEIGHT;

    // Initialize internationalization.
    initI18n({resources});

    // set application viewer.
    mainElement.appendChild(<HTMLElement>app.view);

    // start application.
    app.start();
}

// Fire init() on page loaded.
window.addEventListener('load', init);

window.onerror = function (msg, file, line, column, err) {
    trackError(err);
};
