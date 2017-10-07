import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import TitleState from "../top/TitleState";
import MenuState from "../top/MenuState";

import {Events as AppEvents} from '../ApplicationState';
import HowToPlayState from "../top/HowToPlayState";

export enum Events {
    TAP_TITLE = 'GameViewState@TAP_TITLE',
    REQUEST_BACK_TO_MENU = 'GameViewState@REQUEST_BACK_TO_MENU',
    REQUEST_HOW_TO_PLAY = 'GameViewState@REQUEST_HOW_TO_PLAY',
    FIXED_PLAY_MODE = 'GameViewState@FIXED_PLAY_MODE',
}

class TopViewState extends ViewContainer {
    public static TAG = TopViewState.name;

    private _topStateMachine: StateMachine;
    private _titleState: TitleState;
    private _menuState: MenuState;
    private _howToPlayState: HowToPlayState;

    /**
     * @override
     */
    update(elapsedTime: number): void {
        super.update(elapsedTime);

        this._topStateMachine.update(elapsedTime);
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._titleState = new TitleState();
        this._menuState = new MenuState();
        this._howToPlayState = new HowToPlayState();

        this._topStateMachine = new StateMachine({
            [TitleState.TAG]: this._titleState,
            [MenuState.TAG]: this._menuState,
            [HowToPlayState.TAG]: this._howToPlayState,
        });

        this._topStateMachine.init(TitleState.TAG);
        this.applicationLayer.addChild(this._titleState);

        addEvents({
            [Events.TAP_TITLE]: this._handleTapTitleEvent,
            [Events.REQUEST_BACK_TO_MENU]: this._handleRequestBackMenuEvent,
            [Events.REQUEST_HOW_TO_PLAY]: this._handleRequestHowToPlayEvent,
            [Events.FIXED_PLAY_MODE]: this._handleFixedPlayModeEvent,
        });
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        removeEvents([
            Events.TAP_TITLE,
            Events.REQUEST_BACK_TO_MENU,
            Events.REQUEST_HOW_TO_PLAY,
            Events.FIXED_PLAY_MODE,
        ])
    }

    /**
     *
     * @private
     */
    private _handleTapTitleEvent = () => {
        this._topStateMachine.change(MenuState.TAG);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._menuState);
    };

    /**
     *
     * @private
     */
    private _handleRequestHowToPlayEvent = () => {
        this._topStateMachine.change(HowToPlayState.TAG);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._howToPlayState);
    };

    /**
     *
     * @private
     */
    private _handleRequestBackMenuEvent = () => {
        this._topStateMachine.change(MenuState.TAG);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._menuState);
    };

    /**
     *
     * @private
     */
    private _handleFixedPlayModeEvent = (e: CustomEvent) => {
        console.log("Fixed play mode: ", e.detail.mode);
        dispatchEvent(AppEvents.REQUESTED_GAME_START, {mode: e.detail.mode});
    };
}

export default TopViewState;
