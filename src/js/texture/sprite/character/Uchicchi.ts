import {loadFrames, loadTexture} from "../../../../framework/AssetLoader";

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
class UchicchiCloseUp extends OpponentCloseUp {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_UCHICCHI_CLOSEUP));
    }
}

/**
 * @class
 */
class Uchicchi extends Opponent {
    public constructor() {
        super(
            loadFrames(Ids.CHARACTER_UCHICCHI),
            FRAMES,
            new UchicchiCloseUp());
    }
}

export default Uchicchi;
