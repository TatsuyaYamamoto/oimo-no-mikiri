import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";

import AbstractGameState from "./AbstractGameState";
import {Events} from '../views/GameViewState';
import {Events as AppEvents} from '../ApplicationState';

import BackGround from "../../texture/containers/BackGround";
import RestartButton from "../../texture/sprite/button/RestartButton";
import BackToTopButton from "../../texture/sprite/button/BackToTopButton";
import GameOverLogo from "../../texture/sprite/GameOverLogo";


export interface EnterParams extends Deliverable {
    bestTime: number,
    round: number,
}

class GameOverState extends AbstractGameState {
    public static TAG = GameOverState.name;

    private _background: BackGround;

    private _gameOverLogo: GameOverLogo;

    private _restartButton: RestartButton;
    private _backToTopButton: BackToTopButton;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);
        this._background.progress(elapsedMS);
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._background = new BackGround();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._gameOverLogo = new GameOverLogo();
        this._gameOverLogo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.2);

        this._restartButton = new RestartButton();
        this._restartButton.position.set(this.viewWidth * 0.3, this.viewHeight * 0.8);
        this._restartButton.setOnClickListener(this._onClickRestartButton);

        this._backToTopButton = new BackToTopButton();
        this._backToTopButton.position.set(this.viewWidth * 0.7, this.viewHeight * 0.8);
        this._backToTopButton.setOnClickListener(this._onClickBackToTopButton);

        this.backGroundLayer.addChild(
            this._background,
        );
        this.applicationLayer.addChild(
            this._restartButton,
            this._backToTopButton,
            this._gameOverLogo,
        );
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }

    /**
     *
     * @private
     */
    private _onClickRestartButton = () => {
        dispatchEvent(Events.RESTART_GAME);
    };

    /**
     *
     * @private
     */
    private _onClickBackToTopButton = () => {
        // prevent to propagate to invoke tap event on title view.
        setTimeout(() => dispatchEvent(AppEvents.REQUESTED_BACK_TO_TOP), 1);
    };
}

export default GameOverState;
