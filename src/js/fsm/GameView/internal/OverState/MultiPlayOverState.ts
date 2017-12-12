import {
    default as OverState,
    EnterParams as AbstractEnterParams
} from "./OverState";
import PlayerWins from "../../../../texture/containers/GameResultPaper/PlayerWins";

export interface EnterParams extends AbstractEnterParams {
    onePlayerWins: number;
    twoPlayerWins: number;
}

class MultiPlayOverState extends OverState {
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        const onePlayerWins = new PlayerWins(1, params.onePlayerWins);
        onePlayerWins.position.set(-1 * this.resultPaper.width * 0.25, -1 * this.resultPaper.height * 0.3);

        const twoPlayerWins = new PlayerWins(2, params.twoPlayerWins);
        twoPlayerWins.position.set(this.resultPaper.width * 0.25, -1 * this.resultPaper.height * 0.3);

        this.resultPaper.addChild(
            onePlayerWins,
            twoPlayerWins,
        );

        this.backGroundLayer.addChild(
            this.background,
        );

        this.applicationLayer.addChild(
            this.restartButton,
            this.backToTopButton,
            this.gameOverLogo,
            this.resultPaper,
        );
    }
}

export default MultiPlayOverState;
