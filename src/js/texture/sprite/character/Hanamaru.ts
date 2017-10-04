import Player from "./Player";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class Hanamaru extends Player {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_HANAMARU));
    }
}

export default Hanamaru;
