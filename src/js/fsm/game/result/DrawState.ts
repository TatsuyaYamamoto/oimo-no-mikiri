import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import {Events} from "../../views/GameViewState";
import ResultState from "./ResultState";

class DrawState extends ResultState {
    public static TAG = ResultState.name;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this.player.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

        this._resultLabel.visible = true;

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 3000);
    }
}

export default DrawState;
