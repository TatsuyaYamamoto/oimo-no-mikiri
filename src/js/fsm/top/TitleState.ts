import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from '../../../framework/EventUtils';

import {Events} from "../views/TopViewState";

import TopBackground from "../../texture/sprite/background/TopBackground";

class TitleState extends ViewContainer {
    public static TAG = TitleState.name;

    private _background: TopBackground;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new TopBackground();

        this.backGroundLayer.addChild(
            this._background
        );

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
