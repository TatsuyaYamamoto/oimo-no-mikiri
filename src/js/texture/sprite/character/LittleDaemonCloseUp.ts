import Opponent from "./Opponent";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class LittleDaemonCloseUp extends Opponent {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_LITTLE_DAEMON_CLOSEUP));
    }
}

export default LittleDaemonCloseUp;
