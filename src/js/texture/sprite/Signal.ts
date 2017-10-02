import Sprite from "../internal/Sprite";

import {loadTexture} from "../../../framework/AssetLoader";

import  {Ids} from '../../resources/image';

/**
 * @class
 */
class Signal extends Sprite {
    public constructor() {
        super(loadTexture(Ids.SIGNAL));
    }
}

export default Signal;
