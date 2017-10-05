import {Texture} from 'pixi.js';

import AnimatedSprite from "../../internal/AnimatedSprite";

abstract class Character extends AnimatedSprite {
    protected waitTextures: Texture[];
    protected attackTextures: Texture[];
    protected winTextures: Texture[];
    protected loseTextures: Texture[];

    constructor(waitTextures: Texture[],
                attackTextures: Texture[],
                winTextures: Texture[],
                loseTextures: Texture[]) {

        super(waitTextures);

        this.waitTextures = waitTextures;
        this.attackTextures = attackTextures;
        this.winTextures = winTextures;
        this.loseTextures = loseTextures;

        this.animationSpeed = 0.04;
    }

    public playWait(): void {
        this.textures = this.waitTextures;
        if (!this.playing) {
            this.play();
        }
    }
}

export default Character;
