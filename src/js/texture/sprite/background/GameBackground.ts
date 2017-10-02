import {Sprite} from 'pixi.js';

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class GameBackground extends Sprite {
    public constructor() {
        super(loadTexture(Ids.BACKGROUND_GAME));
    }
}

export default GameBackground;
