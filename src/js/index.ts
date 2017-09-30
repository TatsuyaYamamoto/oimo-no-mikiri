/**
 * @fileOverview Entry point of the application.
 */

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
 * Initialize the application.
 */
function init() {
}

// Fire init() on page loaded.
window.addEventListener('load', init);
