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

    LOGO_TITLE: 'LOGO_TITLE',
    SIGNAL: 'SIGNAL',
};

const manifest: ImageManifest = {
    en: {
        [Ids.BACKGROUND_TOP]: 'background_top.png',
        [Ids.BACKGROUND_GAME]: 'background_game.png',

        [Ids.BUTTON_GAMEOVER_BACK_TO_TOP]: 'button_gameover_back_to_top.png',
        [Ids.BUTTON_GAMEOVER_RESTART]: 'button_gameover_restart.png',

        [Ids.LOGO_TITLE]: 'image_logo_title.png',
        [Ids.SIGNAL]: 'image_signal.png',
    },
    ja: {}
};

export default manifest;
