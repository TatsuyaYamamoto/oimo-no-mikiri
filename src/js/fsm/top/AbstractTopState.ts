import Sound from "pixi-sound/lib/Sound";

import ViewContainer from "../../../framework/ViewContainer";
import {loadSound} from "../../../framework/AssetLoader";

import BackGround from "../../texture/containers/BackGround";

import {Ids as SoundIds} from '../../resources/sound';


abstract class AbstractTopState extends ViewContainer {
    private _background: BackGround;

    constructor() {

        super();

        this._background = new BackGround();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
    }

    protected get background(): BackGround {
        return this._background;
    }
}

export default AbstractTopState;
