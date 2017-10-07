import ViewContainer from "../../../framework/ViewContainer";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";
import PlayerCloseUp from "../../texture/sprite/character/PlayerCloseUp";
import OpponentCloseUp from "../../texture/sprite/character/OpponentCloseUp";
import Oimo from "../../texture/sprite/character/Oimo";

abstract class AbstractGameState extends ViewContainer {
    private _player: Player;
    private _opponent: Opponent;
    private _oimo: Oimo;

    constructor(player: Player, opponent: Opponent) {
        super();

        this._player = player;
        this._opponent = opponent;

        this._oimo = new Oimo();
        this._oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);
        this._oimo.play();
    }

    public get player(): Player {
        return this._player;
    }

    public get opponent(): Opponent {
        return this._opponent;
    }


    public get oimo(): Oimo {
        return this._oimo;
    }

    public setOpponent(opponent: Opponent): void {
        this._opponent = opponent;
    }
}

export default AbstractGameState;
