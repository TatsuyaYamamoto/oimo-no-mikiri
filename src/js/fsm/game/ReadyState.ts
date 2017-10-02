import ViewContainer from "../../../framework/ViewContainer";
import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";

import {Events} from '../views/GameViewState';

import GameBackground from "../../texture/sprite/background/GameBackground";

class ReadyState extends ViewContainer {
    public static TAG = ReadyState.name;

    private _background: GameBackground;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new GameBackground();

        this.backGroundLayer.addChild(
            this._background,
        );

        // TODO: set animation component and fire event on complete.
        window.setTimeout(function () {
            dispatchEvent(Events.IS_READY);
        }, 1000);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default ReadyState;
