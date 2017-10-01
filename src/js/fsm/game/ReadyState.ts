import ViewContainer from "../../../framework/ViewContainer";
import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";

import {Events} from '../views/GameViewState';

class ReadyState extends ViewContainer {
    public static TAG = ReadyState.name;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

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
