import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";

import AbstractGameState from "./AbstractGameState";
import {Events} from "../views/GameViewState";

import GameBackground from "../../texture/sprite/background/GameBackground";

class ResultState extends AbstractGameState {
    public static TAG = ResultState.name;

    private _background: GameBackground;

    /**
     * @override
     */
    update(elapsedTimeMillis: number): void {
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new GameBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.player.position.set(this.viewWidth * 0.3, this.viewHeight * 0.5);

        this.opponent.position.set(this.viewWidth * 0.7, this.viewHeight * 0.5);

        this.backGroundLayer.addChild(
            this._background,
        );
        this.applicationLayer.addChild(
            this.player,
            this.opponent,
        );

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 1000);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default ResultState;
