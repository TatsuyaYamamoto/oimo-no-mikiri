import {loadTexture} from "../../../../framework/AssetLoader";

import {Ids} from '../../../resources/image';
import OpponentCloseUp from "./OpponentCloseUp";

/**
 * @class
 */
class UchicchiCloseUp extends OpponentCloseUp {
    public constructor() {
        super(loadTexture(Ids.CHARACTER_UCHICCHI_CLOSEUP));
    }
}

export default UchicchiCloseUp;
