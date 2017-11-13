import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import AbstractGameState from "./GameViewState";
import {Events} from '../GameView';
import {Events as AppEvents} from '../../ApplicationState';

import BackGround from "../../../texture/containers/BackGround";
import RestartButton from "../../../texture/sprite/button/RestartButton";
import BackToTopButton from "../../../texture/sprite/button/BackToTopButton";
import GameOverLogo from "../../../texture/sprite/GameOverLogo";
import GameResultPaper from "../../../texture/containers/GameResultPaper";

import {play, stop} from "../../../helper/MusicPlayer";

import {Ids as SoundIds} from '../../../resources/sound';

export interface EnterParams extends Deliverable {
    bestTime: number,
    round: number,
}

class OverState extends AbstractGameState {
    public static TAG = OverState.name;

    private _resultPaper: GameResultPaper;
    private _gameOverLogo: GameOverLogo;
    private _restartButton: RestartButton;
    private _backToTopButton: BackToTopButton;

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this._resultPaper = new GameResultPaper({
            height: this.viewHeight * 0.9,
            straightWins: params.round,
            playerName: 'playerName',
            winnerName: 'winnerName',
            topTime: params.bestTime,
            player: this.player,
            opponent: this.opponent,
        });
        this._resultPaper.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._gameOverLogo = new GameOverLogo();
        this._gameOverLogo.position.set(this.viewWidth * 0.75, this.viewHeight * 0.1);
        this._gameOverLogo.scale.set(0.5);

        this._restartButton = new RestartButton();
        this._restartButton.position.set(this.viewWidth * 0.1, this.viewHeight * 0.8);
        this._restartButton.setOnClickListener(this._onClickRestartButton);

        this._backToTopButton = new BackToTopButton();
        this._backToTopButton.position.set(this.viewWidth * 0.9, this.viewHeight * 0.8);
        this._backToTopButton.setOnClickListener(this._onClickBackToTopButton);

        this.backGroundLayer.addChild(
            this.background,
        );
        this.applicationLayer.addChild(
            this._restartButton,
            this._backToTopButton,
            this._resultPaper,
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

        play(SoundIds.SOUND_OK);
    };

    /**
     *
     * @private
     */
    private _onClickBackToTopButton = () => {
        // prevent to propagate to invoke tap event on title view.
        setTimeout(() => dispatchEvent(AppEvents.REQUESTED_BACK_TO_TOP), 1);

        stop(SoundIds.SOUND_WAVE_LOOP);
        play(SoundIds.SOUND_CANCEL);
    };
}

export default OverState;
