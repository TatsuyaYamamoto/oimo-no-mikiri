import ViewContainer from "../../../framework/ViewContainer";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";
import PlayerCloseUp from "../../texture/sprite/character/PlayerCloseUp";
import OpponentCloseUp from "../../texture/sprite/character/OpponentCloseUp";

abstract class AbstractGameState extends ViewContainer {
    private _player: Player;
    private _opponent: Opponent;

    constructor(player: Player, opponent: Opponent) {
        super();

        this._player = player;
        this._opponent = opponent;
    }

    public get player(): Player {
        return this._player;
    }

    public get opponent(): Opponent {
        return this._opponent;
    }

    public setOpponent(opponent: Opponent): void {
        this._opponent = opponent;
    }
}

export default AbstractGameState;
