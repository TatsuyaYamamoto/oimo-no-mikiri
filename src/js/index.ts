/**
 * @fileOverview Entry point of the application.
 */
import config from '../framework/config';

import ApplicationState from "./fsm/ApplicationState";
import {
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    BASIC_IMAGE_WIDTH,
    BASIC_IMAGE_HEIGHT,
} from "./Constants";

// Network fetch module
import 'whatwg-fetch';

// Brand logo text font
require('../fonts/PixelMplus10-Regular.css');

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

    // set application viewer.
    mainElement.appendChild(<HTMLElement>app.view);

    // start application.
    app.start();
}

// Fire init() on page loaded.
window.addEventListener('load', init);
