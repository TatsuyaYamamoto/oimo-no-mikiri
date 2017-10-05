import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";

import AbstractGameState from "./AbstractGameState";
import {Events} from "../views/GameViewState";

import BattleResultLabels, {BattleResultTypes} from "../../texture/containers/BattleResultLabels";

import GameBackground from "../../texture/sprite/background/GameBackground";

export interface EnterParams extends Deliverable {
    resultType: 'playerWin' | 'opponentWin' | 'draw',
}

class ResultState extends AbstractGameState {
    public static TAG = ResultState.name;

    private _background: GameBackground;

    private _battleResultLabels: BattleResultLabels;

    /**
     * @override
     */
    update(elapsedTimeMillis: number): void {
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._background = new GameBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.player.position.set(this.viewWidth * 0.3, this.viewHeight * 0.5);

        this.opponent.position.set(this.viewWidth * 0.7, this.viewHeight * 0.5);

        this._battleResultLabels = new BattleResultLabels(
            this.viewWidth,
            this.viewHeight,
            <BattleResultTypes>params.resultType,
            "WinnerName"); // TODO: get winner name according to result.
        this._battleResultLabels.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this._battleResultLabels.show(true);

        this.backGroundLayer.addChild(
            this._background,
        );

        this.applicationLayer.addChild(
            this.player,
            this.opponent,
            this._battleResultLabels,
        );

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 5000);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default ResultState;
