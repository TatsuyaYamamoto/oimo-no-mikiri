import Sprite from "../../internal/Sprite";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class UchicchiCloseUp extends Sprite {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_UCHICCHI_CLOSEUP));
    }
}

export default UchicchiCloseUp;
