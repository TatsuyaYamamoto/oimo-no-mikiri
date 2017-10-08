import {Sprite, extras, Container} from 'pixi.js';

import {loadTexture} from "../../../framework/AssetLoader";

import {Ids} from "../../resources/image";

const CLOUD_SPEED = 0.01;

class CloudLayer extends extras.TilingSprite {
    public constructor() {
        super(loadTexture(Ids.BACKGROUND_CLOUD), 1400, 129);
        this.anchor.set(0.5, 0);
    }
}

class SkyLayer extends Sprite {
    public constructor() {
        super(loadTexture(Ids.BACKGROUND_SKY));
        this.anchor.set(0.5);
    }
}

class BeachLayer extends Sprite {
    public constructor() {
        super(loadTexture(Ids.BACKGROUND_BEACH));
        this.anchor.set(0.5);
    }
}

/**
 * @class
 */
class BackGround extends Container {
    private _skyLayer: SkyLayer;
    private _cloudLayer: CloudLayer;
    private _beachLayer: BeachLayer;

    public constructor() {
        super();

        this._skyLayer = new SkyLayer();
        this._cloudLayer = new CloudLayer();
        this._cloudLayer.position.set(0, -100);

        this._beachLayer = new BeachLayer();

        this.addChild(
            this._skyLayer,
            this._cloudLayer,
            this._beachLayer,
        );

        this._cloudLayer.position.y = -1 * this.height * 0.5;
    }

    progress(elapsedMS: number): void {
        this._cloudLayer.tilePosition.x += elapsedMS * CLOUD_SPEED;
    }
}

export default BackGround;
