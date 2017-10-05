/**
 * @fileOverview Image resource manifest.
 * It's used to load with {@link AssetLoader#setImageManifest}
 */
import {ImageManifest} from "../../framework/AssetLoader";

export const Ids = {
    BACKGROUND_TOP: 'BACKGROUND_TOP',
    BACKGROUND_GAME: 'BACKGROUND_GAME',

    BUTTON_GAMEOVER_BACK_TO_TOP: 'BUTTON_GAMEOVER_BACK_TO_TOP',
    BUTTON_GAMEOVER_RESTART: 'BUTTON_GAMEOVER_RESTART',

    CHARACTER_HANAMARU: 'CHARACTER_HANAMARU',
    CHARACTER_HANAMARU_CLOSEUP: 'CHARACTER_HANAMARU_CLOSEUP',

    CHARACTER_UCHICCHI: 'CHARACTER_UCHICCHI',
    CHARACTER_UCHICCHI_CLOSEUP: 'CHARACTER_UCHICCHI_CLOSEUP',
    CHARACTER_SHITAKE: 'CHARACTER_UCHICCHI',
    CHARACTER_SHITAKE_CLOSEUP: 'CHARACTER_UCHICCHI_CLOSEUP',
    CHARACTER_LITTLE_DAEMON: 'CHARACTER_LITTLE_DAEMON',
    CHARACTER_LITTLE_DAEMON_CLOSEUP: 'CHARACTER_LITTLE_DAEMON_CLOSEUP',

    LOGO_TITLE: 'LOGO_TITLE',
    LOGO_GAME_OVER: 'LOGO_GAME_OVER',
    SIGNAL: 'SIGNAL',
};

const manifest: ImageManifest = {
    en: {
        [Ids.BACKGROUND_TOP]: 'background_top.png',
        [Ids.BACKGROUND_GAME]: 'background_game.png',

        [Ids.BUTTON_GAMEOVER_BACK_TO_TOP]: 'button_gameover_back_to_top.png',
        [Ids.BUTTON_GAMEOVER_RESTART]: 'button_gameover_restart.png',

        [Ids.CHARACTER_HANAMARU]: 'character_hanamaru.png',
        [Ids.CHARACTER_HANAMARU_CLOSEUP]: 'character_hanamaru_closeup.png',

        [Ids.CHARACTER_UCHICCHI]: 'character_uchicchi.png',
        [Ids.CHARACTER_UCHICCHI_CLOSEUP]: 'character_uchicchi_closeup.png',
        [Ids.CHARACTER_SHITAKE]: 'character_shitake.png',
        [Ids.CHARACTER_SHITAKE_CLOSEUP]: 'character_shitake_closeup.png',
        [Ids.CHARACTER_LITTLE_DAEMON]: 'character_little_daemon.png',
        [Ids.CHARACTER_LITTLE_DAEMON_CLOSEUP]: 'character_little_daemon_closeup.png',

        [Ids.LOGO_TITLE]: 'image_logo_title.png',
        [Ids.LOGO_GAME_OVER]: 'image_logo_gameover.png',
        [Ids.SIGNAL]: 'image_signal.png',
    },
    ja: {}
};

export default manifest;
