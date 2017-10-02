import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";

import GameBackground from "../../texture/sprite/background/GameBackground";

export interface EnterParams extends Deliverable {
    bestTime: number,
    round: number,
}

class GameOverState extends ViewContainer {
    public static TAG = GameOverState.name;

    private _background: GameBackground;

    /**
     * @override
     */
    update(elapsedMS: number): void {
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._background = new GameBackground();

        this.backGroundLayer.addChild(
            this._background,
        );
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default GameOverState;
