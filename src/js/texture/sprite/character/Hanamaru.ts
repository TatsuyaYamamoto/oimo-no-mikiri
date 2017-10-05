import Player from "./Player";

import {loadFrames} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

const FRAMES = {
    WAIT: [0, 1],
    ATTACK: [0, 1],
    LOSE: [0, 1],
    WIN: [0, 1]
};

/**
 * @class
 */
class Hanamaru extends Player {
    public constructor() {
        const frames = loadFrames(Ids.CHARACTER_HANAMARU);

        const wait = [frames[0], frames[1]];
        const attack = [frames[0], frames[1]];
        const win = [frames[0], frames[1]];
        const lose = [frames[0], frames[1]];

        super(wait, attack, win, lose);
    }
}

export default Hanamaru;
