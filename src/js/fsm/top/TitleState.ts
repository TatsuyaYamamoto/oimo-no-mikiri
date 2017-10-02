import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from '../../../framework/EventUtils';

import {Events} from "../views/TopViewState";

import TopBackground from "../../texture/sprite/background/TopBackground";
import TitleLogo from "../../texture/sprite/TitleLogo";

class TitleState extends ViewContainer {
    public static TAG = TitleState.name;

    private _background: TopBackground;

    private _titleLogo: TitleLogo;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new TopBackground();

        this._titleLogo = new TitleLogo();
        this._titleLogo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.backGroundLayer.addChild(
            this._background
        );
        this.applicationLayer.addChild(
            this._titleLogo,
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
