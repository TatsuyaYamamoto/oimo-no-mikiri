import {loadTexture, loadFrames} from "../../../../framework/AssetLoader";

import {FrameStructureIndexes} from "./Character";
import Opponent from "./Opponent";
import OpponentCloseUp from "./OpponentCloseUp";

import {Ids} from '../../../resources/image';

const FRAMES: FrameStructureIndexes = {
    WAIT: [0, 1],
    ATTACK: [2, 3],
    LOSE: [4, 5],
    WIN: [6, 7]
};

/**
 * @class
 */
class ShitakeCloseUp extends OpponentCloseUp {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_SHITAKE_CLOSEUP));
    }
}

/**
 * @class
 */
class Shitake extends Opponent {
    public constructor() {
        super(
            loadFrames(Ids.CHARACTER_SHITAKE),
            FRAMES,
            new ShitakeCloseUp());
    }
}

export default Shitake;
