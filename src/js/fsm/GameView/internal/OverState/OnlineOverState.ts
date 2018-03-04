import OverState, { EnterParams as AbstractEnterParams } from "./OverState";

import PlayerWins from "../../../../texture/containers/GameResultPaper/PlayerWins";
import TweetButton from "../../../../texture/sprite/button/TweetButton";

import Actor from "../../../../models/Actor";
import { dispatchEvent } from "../../../../../framework/EventUtils";
import { Events as AppEvents } from "../../../ApplicationState";
import { Action, Category, trackEvent } from "../../../../helper/tracker";
import { play, stop } from "../../../../helper/MusicPlayer";
import { Ids as SoundIds } from "../../../../resources/sound";
import { Events } from "../../GameView";

export interface EnterParams extends AbstractEnterParams {
    onePlayerWins: number;
    twoPlayerWins: number;
}

class OnlineOverState extends OverState {
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        const {
            winner,
            onePlayerWins,
            twoPlayerWins,
        } = params;

        const onePlayerWinsText = new PlayerWins(1, params.onePlayerWins);
        onePlayerWinsText.position.set(-1 * this.resultPaper.width * 0.25, -1 * this.resultPaper.height * 0.3);

        const twoPlayerWinsText = new PlayerWins(2, params.twoPlayerWins);
        twoPlayerWinsText.position.set(this.resultPaper.width * 0.25, -1 * this.resultPaper.height * 0.3);

        const tweetButton = new TweetButton();
        tweetButton.position.set(this.viewWidth * 0.15, this.viewHeight * 0.2);
        tweetButton.setOnClickListener(() => this._onClickTweetButton(
            winner,
            Math.max(onePlayerWins, twoPlayerWins),
            Math.min(onePlayerWins, twoPlayerWins)
        ));

        this.resultPaper.addChild(
            onePlayerWinsText,
            twoPlayerWinsText,
        );

        this.backGroundLayer.addChild(
            this.background,
        );

        this.applicationLayer.addChild(
            this.restartButton,
            this.backToTopButton,
            this.resultPaper,
            this.gameOverLogo,
            tweetButton
        );
    }

    private _onClickTweetButton = (winner: Actor, winnerWins, loserWins) => {
        console.error("Not implemented");
    };
}

export default OnlineOverState;
