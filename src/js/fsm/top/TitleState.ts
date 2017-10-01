import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from '../../../framework/EventUtils';

import {Events} from "../views/TopViewState";

class TitleState extends ViewContainer {
    public static TAG = TitleState.name;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);
        this.addClickWindowEventListener(this._handleTapWindow);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
        this.removeClickWindowEventListener(this._handleTapWindow);
    }

    private _handleTapWindow = () => {
        dispatchEvent(Events.TAP_TITLE);
    };
}

export default TitleState;
