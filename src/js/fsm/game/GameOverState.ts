import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";

import GameBackground from "../../texture/sprite/background/GameBackground";
import RestartButton from "../../texture/sprite/button/RestartButton";
import BackToTopButton from "../../texture/sprite/button/BackToTopButton";

export interface EnterParams extends Deliverable {
    bestTime: number,
    round: number,
}

class GameOverState extends ViewContainer {
    public static TAG = GameOverState.name;

    private _background: GameBackground;

    private _restartButton: RestartButton;
    private _backToTopButton: BackToTopButton;

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

        this._restartButton = new RestartButton();
        this._restartButton.position.set(this.viewWidth * 0.3, this.viewHeight * 0.8);
        this._backToTopButton = new BackToTopButton();
        this._backToTopButton.position.set(this.viewWidth * 0.7, this.viewHeight * 0.8);

        this.backGroundLayer.addChild(
            this._background,
        );
        this.applicationLayer.addChild(
            this._restartButton,
            this._backToTopButton,
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
