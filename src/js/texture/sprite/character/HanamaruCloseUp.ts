import PlayerCloseUp from "./PlayerCloseUp";

import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';

/**
 * @class
 */
class HanamaruCloseUp extends PlayerCloseUp {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_HANAMARU_CLOSEUP));
    }
}

export default HanamaruCloseUp;
