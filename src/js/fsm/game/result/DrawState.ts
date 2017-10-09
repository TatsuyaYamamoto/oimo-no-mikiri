import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import {Events} from "../../views/GameViewState";
import ResultState from "./ResultState";

import BattleResultLabelBoard from "../../../texture/containers/BattleResultLabel";

class DrawState extends ResultState {
    public static TAG = ResultState.name;

    private _battleResultLabelBoard: BattleResultLabelBoard;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this.player.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

        this._battleResultLabelBoard = new BattleResultLabelBoard(
            this.viewWidth,
            this.viewHeight,
            'draw'
        );
        this._battleResultLabelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.applicationLayer.addChild(this._battleResultLabelBoard);

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 3000);
    }
}

export default DrawState;
