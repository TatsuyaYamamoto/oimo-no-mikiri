import Sprite from "../../internal/Sprite";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class Uchicchi extends Sprite {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_UCHICCHI));
    }
}

export default Uchicchi;
