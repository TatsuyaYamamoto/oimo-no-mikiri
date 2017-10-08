import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import {Events} from "../../views/GameViewState";
import ResultState from "./ResultState";

class PlayerWinState extends ResultState {
    public static TAG = PlayerWinState.name;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._resultLabel.visible = true;
        this._playerLabel.visible = true;

        this.whiteOut('player', () => {
            window.setTimeout(function () {
                dispatchEvent(Events.REQUEST_READY);
            }, 3000);
        });
    }
}

export default PlayerWinState;
