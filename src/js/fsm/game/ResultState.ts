import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";
import {Events} from "../views/GameViewState";

class ResultState extends ViewContainer {
    public static TAG = ResultState.name;

    /**
     * @override
     */
    update(elapsedTimeMillis: number): void {
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);
        // TODO: fire after completing animation.
        dispatchEvent(Events.REQUEST_READY);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default ResultState;
