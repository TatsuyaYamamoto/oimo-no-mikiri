import {loadTexture, loadFrames} from "../../../../framework/AssetLoader";

import {FrameStructureIndexes} from "./Character";
import Player from "./Player";
import PlayerCloseUp from "./PlayerCloseUp";

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
class HanamaruCloseUp extends PlayerCloseUp {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_HANAMARU_CLOSEUP));
    }
}

/**
 * @class
 */
class Hanamaru extends Player {
    public constructor() {
        super(
            loadFrames(Ids.CHARACTER_HANAMARU),
            FRAMES,
            new HanamaruCloseUp());
    }
}

export default Hanamaru;
