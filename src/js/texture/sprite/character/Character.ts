import {Texture} from 'pixi.js';

import AnimatedSprite from "../../internal/AnimatedSprite";

const ANIMATION_SPEED = 0.04;

export interface FrameStructureIndexes {
    WAIT: number[],
    ATTACK: number[],
    LOSE: number[],
    WIN: number[],
}

abstract class Character extends AnimatedSprite {
    protected waitTextures: Texture[];
    protected attackTextures: Texture[];
    protected winTextures: Texture[];
    protected loseTextures: Texture[];

    constructor(frameTextures: Texture[],
                indexed: FrameStructureIndexes) {

        const wait = indexed.WAIT.map((waitFrameIndex) => frameTextures[waitFrameIndex]);
        const attack = indexed.ATTACK.map((attackFrameIndex) => frameTextures[attackFrameIndex]);
        const win = indexed.WIN.map((winFrameIndex) => frameTextures[winFrameIndex]);
        const lose = indexed.LOSE.map((loseFrameIndex) => frameTextures[loseFrameIndex]);

        super(wait);

        this.waitTextures = wait;
        this.attackTextures = attack;
        this.winTextures = win;
        this.loseTextures = lose;

        this.animationSpeed = ANIMATION_SPEED;
    }

    public playWait(): void {
        this.textures = this.waitTextures;
        if (!this.playing) {
            this.play();
        }
    }

    public playAttack(): void {
        this.textures = this.attackTextures;
        if (!this.playing) {
            this.play();
        }
    }

    public playWin(): void {
        this.textures = this.winTextures;
        if (!this.playing) {
            this.play();
        }
    }

    public playLose(): void {
        console.log("lose?", this);
        this.textures = this.loseTextures;
        if (!this.playing) {
            this.play();
        }
    }
}

export default Character;
