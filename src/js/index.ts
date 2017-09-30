/**
 * @fileOverview Entry point of the application.
 */
import ApplicationState from "./fsm/ApplicationState";

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
    // set application viewer.
    mainElement.appendChild(<HTMLElement>app.view);

    // start application.
    app.start();
}

// Fire init() on page loaded.
window.addEventListener('load', init);
