import {Texture} from 'pixi.js';

import Character from "./Character";
import PlayerCloseUp from "./PlayerCloseUp";

abstract class Player extends Character {
    protected _closeUpTexture: PlayerCloseUp;

    constructor(waitTextures: Texture[],
                attackTextures: Texture[],
                winTextures: Texture[],
                loseTextures: Texture[],
                closeUpTexture: PlayerCloseUp) {
        super(waitTextures, attackTextures, winTextures, loseTextures);

        this._closeUpTexture = closeUpTexture;
    }

    public get closeUpTexture(): PlayerCloseUp {
        return this._closeUpTexture;
    }
}

export default Player;
