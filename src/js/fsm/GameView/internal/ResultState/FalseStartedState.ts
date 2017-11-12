import Deliverable from "../../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../../framework/EventUtils";

import {Events} from "../../GameView";
import ResultState from "./ResultState";

import BattleResultLabelBoard from "../../../../texture/containers/BattleResultLabel";

export interface EnterParams extends Deliverable {
    actor: 'player' | 'opponent',
    isEnded: boolean,
}

class FalseStartedState extends ResultState {
    public static TAG = FalseStartedState.name;

    private _battleResultLabelBoard: BattleResultLabelBoard;

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        if (params.isEnded) {
            const winnerName = params.actor === 'player' ?
                this.opponent.name :
                this.player.name;

            const resultType = params.actor === 'player' ?
                'opponentWin' :
                'playerWin';

            this._battleResultLabelBoard = new BattleResultLabelBoard(
                this.viewWidth,
                this.viewHeight,
                resultType,
                winnerName
            );
        } else {
            this._battleResultLabelBoard = new BattleResultLabelBoard(
                this.viewWidth,
                this.viewHeight,
                'falseStart'
            );
        }
        this._battleResultLabelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this.applicationLayer.addChild(this._battleResultLabelBoard);

        this._hueFilter.hue(180);
        this._brightnessFilter.brightness(0.5);

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 3000);
    }
}

export default FalseStartedState;
