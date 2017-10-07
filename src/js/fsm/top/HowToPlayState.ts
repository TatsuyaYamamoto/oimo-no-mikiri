import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";

import {Events} from "../views/TopViewState";

import UsageTextArea from "../../texture/containers/UsageTextArea";
import TopBackground from "../../texture/sprite/background/TopBackground";
import BackToMenuButton from "../../texture/sprite/button/BackToMenuButton";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";
import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Oimo from "../../texture/sprite/character/Oimo";

class HowToPlayState extends ViewContainer {
    public static TAG = HowToPlayState.name;

    private _background: TopBackground;

    private _usageTextArea: UsageTextArea;

    private _oimo: Oimo;
    private _player: Player;
    private _opponent: Opponent;

    private _backToMenuButton: BackToMenuButton;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new TopBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._usageTextArea = new UsageTextArea();
        this._usageTextArea.position.set(this.viewWidth * 0.5, this.viewHeight * 0.2);

        this._oimo = new Oimo();
        this._oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

        this._player = new Hanamaru();
        this._player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

        this._opponent = new Uchicchi();
        this._opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);

        this._backToMenuButton = new BackToMenuButton();
        this._backToMenuButton.position.set(this.viewWidth * 0.2, this.viewHeight * 0.9);
        this._backToMenuButton.setOnClickListener(this._onBackToMenuClick);

        this.backGroundLayer.addChild(
            this._background
        );

        this.applicationLayer.addChild(
            this._usageTextArea,
            this._oimo,
            this._player,
            this._opponent,
            this._backToMenuButton,
        );

        this._oimo.play();
        this._player.playWait();
        this._opponent.playWait();

        // Set timeout to dispatch after ending onEnter logic.
        window.setTimeout(() => this.addClickWindowEventListener(this._handleTapWindow), 1);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
        this.removeClickWindowEventListener(this._handleTapWindow);
    }

    /**
     *
     * @private
     */
    private _onBackToMenuClick = () => {
        dispatchEvent(Events.REQUEST_BACK_TO_MENU);
    };

    /**
     *
     * @private
     */
    private _handleTapWindow = () => {
        this._startGetOimoAnimation();
    };

    /**
     *
     * @private
     */
    private _startGetOimoAnimation = () => {

    };
}

export default HowToPlayState;
