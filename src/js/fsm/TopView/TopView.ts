import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import TitleState from "./internal/TitleState";
import MenuState from "./internal/MenuState";

import {Events as AppEvents} from '../ApplicationState';
import HowToPlayState from "./internal/HowToPlayState";
import CreditState from "./internal/CreditState";

export enum Events {
    TAP_TITLE = 'GameView@TAP_TITLE',
    REQUEST_BACK_TO_MENU = 'GameView@REQUEST_BACK_TO_MENU',
    REQUEST_HOW_TO_PLAY = 'GameView@REQUEST_HOW_TO_PLAY',
    REQUEST_CREDIT = 'GameView@REQUEST_CREDIT',
    FIXED_PLAY_MODE = 'GameView@FIXED_PLAY_MODE',
}

class TopViewState extends ViewContainer {
    public static TAG = TopViewState.name;

    private _topStateMachine: StateMachine<ViewContainer>;

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

        this._topStateMachine = new StateMachine({
            [TitleState.TAG]: new TitleState(),
            [MenuState.TAG]: new MenuState(),
            [HowToPlayState.TAG]: new HowToPlayState(),
            [CreditState.TAG]: new CreditState(),
        });

        addEvents({
            [Events.TAP_TITLE]: this._handleTapTitleEvent,
            [Events.REQUEST_BACK_TO_MENU]: this._handleRequestBackMenuEvent,
            [Events.REQUEST_HOW_TO_PLAY]: this._handleRequestHowToPlayEvent,
            [Events.REQUEST_CREDIT]: this._handleRequestCredit,
            [Events.FIXED_PLAY_MODE]: this._handleFixedPlayModeEvent,
        });

        this._to(TitleState.TAG);
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
        this._to(MenuState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleRequestHowToPlayEvent = () => {
        this._to(HowToPlayState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleRequestBackMenuEvent = () => {
        this._to(MenuState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleRequestCredit = () => {
        this._to(CreditState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleFixedPlayModeEvent = (e: CustomEvent) => {
        console.log("Fixed play mode: ", e.detail.mode);
        dispatchEvent(AppEvents.REQUESTED_GAME_START, {mode: e.detail.mode});
    };

    private _to = (stateTag: string) => {
        this._topStateMachine.change(stateTag);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._topStateMachine.current);
    }
}

export default TopViewState;
