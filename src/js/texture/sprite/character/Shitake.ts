import Opponent from "./Opponent";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class Shitake extends Opponent {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_UCHICCHI));
    }
}

export default Shitake;
