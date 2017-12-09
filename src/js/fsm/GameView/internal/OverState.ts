import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import AbstractGameState from "./GameViewState";
import {Events} from '../GameView';
import {Events as AppEvents} from '../../ApplicationState';

import RestartButton from "../../../texture/sprite/button/RestartButton";
import BackToTopButton from "../../../texture/sprite/button/BackToTopButton";
import TweetButton from "../../../texture/sprite/button/TweetButton";
import GameOverLogo from "../../../texture/sprite/GameOverLogo";
import GameResultPaper from "../../../texture/containers/GameResultPaper";

import Actor from "../../../models/Actor";
import Mode from "../../../models/Mode";

import {play, stop} from "../../../helper/MusicPlayer";
import {postPlayLog, tweetGameResult} from "../../../helper/network";
import {Action, Category, trackEvent} from "../../../helper/tracker";

import {Ids as SoundIds} from '../../../resources/sound';

export interface EnterParams extends Deliverable {
    winner: Actor;
    bestTime: number;
    straightWins: number;
    mode: Mode;
}

class OverState extends AbstractGameState {
    private _resultPaper: GameResultPaper;
    private _gameOverLogo: GameOverLogo;
    private _restartButton: RestartButton;
    private _backToTopButton: BackToTopButton;
    private _tweetButton: TweetButton;

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        const {
            winner,
            straightWins,
            bestTime,
            mode
        } = params;

        this._resultPaper = new GameResultPaper({
            height: this.viewHeight * 0.9,
            straightWins: straightWins,
            topTime: bestTime,
            winnerName: winner === Actor.PLAYER ? this.player.name : this.opponent.name,
            playerTexture: winner === Actor.PLAYER ? this.player.winTexture : this.player.loseTexture,
            playerName: this.player.name,
            opponentTexture: winner === Actor.PLAYER ? this.opponent.loseTexture : this.opponent.winTexture,
            opponentName: this.opponent.name,
        });
        this._resultPaper.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._gameOverLogo = new GameOverLogo();
        this._gameOverLogo.position.set(this.viewWidth * 0.75, this.viewHeight * 0.1);
        this._gameOverLogo.scale.set(0.5);

        this._restartButton = new RestartButton();
        this._restartButton.position.set(this.viewWidth * 0.15, this.viewHeight * 0.8);
        this._restartButton.setOnClickListener(this._onClickRestartButton);

        this._backToTopButton = new BackToTopButton();
        this._backToTopButton.position.set(this.viewWidth * 0.85, this.viewHeight * 0.8);
        this._backToTopButton.setOnClickListener(this._onClickBackToTopButton);

        this._tweetButton = new TweetButton();
        this._tweetButton.position.set(this.viewWidth * 0.15, this.viewHeight * 0.2);
        this._tweetButton.setOnClickListener(() => this._onClickTweetButton(bestTime, straightWins));

        this.backGroundLayer.addChild(
            this.background,
        );
        this.applicationLayer.addChild(
            this._restartButton,
            this._backToTopButton,
            this._resultPaper,
            this._gameOverLogo,
            this._tweetButton,
        );

        // logging result.
        postPlayLog(bestTime, mode, straightWins);

        // track result
        this._trackAchievementToGa(bestTime, straightWins, mode);
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

        trackEvent(
            Category.BUTTON,
            Action.TAP,
            "restart_game");
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

        trackEvent(
            Category.BUTTON,
            Action.TAP,
            "back_to_menu");
    };

    private _onClickTweetButton = (bestTime: number, wins: number) => {
        trackEvent(
            Category.BUTTON,
            Action.TAP,
            "result_tweet");

        tweetGameResult(bestTime, wins);
    };

    private _trackAchievementToGa = (bestTime, straightWins, mode) => {
        trackEvent(
            Category.ACHIEVEMENT,
            `${straightWins}-straight-wins`,
            mode,
            bestTime);
    }
}

export default OverState;
