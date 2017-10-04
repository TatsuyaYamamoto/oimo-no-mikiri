import Opponent from "./Opponent";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class LittleDaemon extends Opponent {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_LITTLE_DAEMON));
    }
}

export default LittleDaemon;
