import {loadTexture, loadFrames} from "../../../../framework/AssetLoader";

import Opponent from "./Opponent";
import OpponentCloseUp from "./OpponentCloseUp";

import {Ids} from '../../../resources/image';

const FRAMES = {
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
        const frames = loadFrames(Ids.CHARACTER_SHITAKE);
        const wait = FRAMES.WAIT.map((waitFrameIndex) => frames[waitFrameIndex]);
        const attack = FRAMES.ATTACK.map((attackFrameIndex) => frames[attackFrameIndex]);
        const win = FRAMES.WIN.map((winFrameIndex) => frames[winFrameIndex]);
        const lose = FRAMES.LOSE.map((loseFrameIndex) => frames[loseFrameIndex]);

        super(wait, attack, win, lose, new ShitakeCloseUp());
    }
}

export default Shitake;
