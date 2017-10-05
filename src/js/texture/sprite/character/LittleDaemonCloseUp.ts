import OpponentCloseUp from "./OpponentCloseUp";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class LittleDaemonCloseUp extends OpponentCloseUp {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_LITTLE_DAEMON_CLOSEUP));
    }
}

export default LittleDaemonCloseUp;
