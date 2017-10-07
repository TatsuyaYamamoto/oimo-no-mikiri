import {loadFrames, loadTexture} from "../../../../framework/AssetLoader";

import {FrameStructureIndexes} from "./Character";
import Opponent from "./Opponent";
import OpponentCloseUp from "./OpponentCloseUp";

import {Ids} from '../../../resources/image';

const FRAMES: FrameStructureIndexes = {
    WAIT: [0, 1, 2, 3],
    ATTACK: [4, 5],
    LOSE: [6, 7],
    WIN: [8, 9, 10]
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
