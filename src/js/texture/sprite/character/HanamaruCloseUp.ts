import Sprite from "../../internal/Sprite";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class HanamaruCloseUp extends Sprite {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_HANAMARU_CLOSEUP));
    }
}

export default HanamaruCloseUp;
