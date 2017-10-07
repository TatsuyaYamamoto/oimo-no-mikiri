import {Texture} from 'pixi.js';

import Character from "./Character";
import OpponentCloseUp from "./OpponentCloseUp";

abstract class Opponent extends Character {
    private _closeUpTexture: OpponentCloseUp;

    constructor(waitTextures: Texture[],
                attackTextures: Texture[],
                winTextures: Texture[],
                loseTextures: Texture[],
                closeUpTexture: OpponentCloseUp) {
        super(waitTextures, attackTextures, winTextures, loseTextures);

        this._closeUpTexture = closeUpTexture;
    }

    public get closeUpTexture(): OpponentCloseUp {
        return this._closeUpTexture;
    }
}

export default Opponent;
