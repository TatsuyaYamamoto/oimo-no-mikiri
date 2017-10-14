import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from '../../../framework/EventUtils';

import AbstractTopState from "./AbstractTopState";
import {Events} from "../views/TopViewState";

import TitleLogo from "../../texture/sprite/TitleLogo";

class TitleState extends AbstractTopState {
    public static TAG = TitleState.name;

    private _titleLogo: TitleLogo;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);
        this.background.progress(elapsedMS);
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._titleLogo = new TitleLogo();
        this._titleLogo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.backGroundLayer.addChild(
            this.background
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
