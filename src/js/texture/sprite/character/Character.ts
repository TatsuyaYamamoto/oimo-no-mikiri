import {Texture} from 'pixi.js';

import AnimatedSprite from "../../internal/AnimatedSprite";

const ANIMATION_SPEED = 0.04;

export interface FrameStructureIndexes {
    WAIT: number[],
    TRY_ATTACK: number[],
    SUCCESS_ATTACK: number[],
    LOSE: number[],
    WIN: number[],
}

abstract class Character extends AnimatedSprite {
    protected waitTextures: Texture[];
    protected tryAttackTextures: Texture[];
    protected successAttackTextures: Texture[];
    protected winTextures: Texture[];
    protected loseTextures: Texture[];

    constructor(frameTextures: Texture[],
                indexed: FrameStructureIndexes) {

        const wait = indexed.WAIT.map((waitFrameIndex) => frameTextures[waitFrameIndex]);
        const tryAttackTextures = indexed.TRY_ATTACK.map((frameIndex) => frameTextures[frameIndex]);
        const successAttackTextures = indexed.SUCCESS_ATTACK.map((frameIndex) => frameTextures[frameIndex]);
        const win = indexed.WIN.map((winFrameIndex) => frameTextures[winFrameIndex]);
        const lose = indexed.LOSE.map((loseFrameIndex) => frameTextures[loseFrameIndex]);

        super(wait);

        this.waitTextures = wait;
        this.tryAttackTextures = tryAttackTextures;
        this.successAttackTextures = successAttackTextures;
        this.winTextures = win;
        this.loseTextures = lose;

        this.animationSpeed = ANIMATION_SPEED;
    }

    abstract get name(): string;

    public playWait(): void {
        this.textures = this.waitTextures;
        if (!this.playing) {
            this.play();
        }
    }

    public playTryAttack(): void {
        this.textures = this.tryAttackTextures;
        if (!this.playing) {
            this.play();
        }
    }

    public playSuccessAttack(): void {
        this.textures = this.successAttackTextures;
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
        this.textures = this.loseTextures;
        if (!this.playing) {
            this.play();
        }
    }
}

export default Character;
