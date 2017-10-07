import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import {Events} from "../../views/GameViewState";
import ResultState from "./ResultState";

export interface EnterParams extends Deliverable {
    actor: 'player' | 'opponent',
    isEnded: boolean,
}

class FalseStartedState extends ResultState {
    public static TAG = FalseStartedState.name;

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);


        if (params.isEnded) {
            this._resultLabel.visible = true;
            if (params.actor === 'player') {
                this._opponentLabel.visible = true;
            } else {
                this._playerLabel.visible = true;
            }

        } else {
            this._resultLabel.visible = true;
        }

        this._hueFilter.hue(180);
        this._brightnessFilter.brightness(0.5);

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 3000);
    }
}

export default FalseStartedState;
