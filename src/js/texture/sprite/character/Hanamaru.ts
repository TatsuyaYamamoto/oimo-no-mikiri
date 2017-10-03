import Sprite from "../../internal/Sprite";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class Hanamaru extends Sprite {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_HANAMARU));
    }
}

export default Hanamaru;
