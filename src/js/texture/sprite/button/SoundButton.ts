import {Texture} from 'pixi.js';

import Button from "../../internal/Button";
import {Ids} from '../../../resources/image';
import {loadFrames} from "../../../../framework/AssetLoader";

class SoundButton extends Button {
    private _onTexture: Texture;
    private _offTexture: Texture;

    constructor() {
        const frames = loadFrames(Ids.BUTTON_SOUND);

        const onTexture = frames[0];
        const offTexture = frames[1];

        super(onTexture);

        this._onTexture = onTexture;
        this._offTexture = offTexture;
    }
}

export default SoundButton;
