import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import {Events} from "../../views/GameViewState";
import ResultState from "./ResultState";

class OpponentWinState extends ResultState {
    public static TAG = OpponentWinState.name;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._resultLabel.visible = true;
        this._opponentLabel.visible = true;

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 3000);
    }
}

export default OpponentWinState;
