/**
 * @fileOverview Image resource manifest.
 * It's used to load with {@link AssetLoader#setImageManifest}
 */
import {ImageManifest} from "../../framework/AssetLoader";

export const Ids = {
    BACKGROUND_TOP: 'BACKGROUND_TOP',
    BACKGROUND_GAME: 'BACKGROUND_GAME',
};

const manifest: ImageManifest = {
    en: {
        [Ids.BACKGROUND_TOP]: 'background_top.png',
        [Ids.BACKGROUND_GAME]: 'background_game.png',
    },
    ja: {}
};

export default manifest;
