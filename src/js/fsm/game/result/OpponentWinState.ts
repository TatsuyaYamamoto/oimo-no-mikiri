import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import {Events} from "../../views/GameViewState";
import ResultState from "./ResultState";

import BattleResultLabelBoard from "../../../texture/containers/BattleResultLabel";

class OpponentWinState extends ResultState {
    public static TAG = OpponentWinState.name;

    private _battleResultLabelBoard: BattleResultLabelBoard;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._battleResultLabelBoard = new BattleResultLabelBoard(
            this.viewWidth,
            this.viewHeight,
            'opponentWin',
            this.opponent.name
        );
        this._battleResultLabelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.applicationLayer.addChild(this._battleResultLabelBoard);

        this.whiteOut('opponent', () => {
            window.setTimeout(function () {
                dispatchEvent(Events.REQUEST_READY);
            }, 3000);
        });
    }
}

export default OpponentWinState;
