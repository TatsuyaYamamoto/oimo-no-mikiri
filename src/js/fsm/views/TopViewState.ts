import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent, addEvents, removeEvents} from "../../../framework/EventUtils";

import TitleState from "../top/TitleState";
import MenuState from "../top/MenuState";
import LevelSelectState from "../top/LevelSelectState";

export enum Events {
    TAP_TITLE = 'GameViewState@TAP_TITLE',
    START_SINGLE_PLAY = 'GameViewState@START_SINGLE_PLAY',
    SELECT_NPC_LEVEL = 'GameViewState@ACTION_SUCCESS',
}

class TopViewState extends ViewContainer {
    public static TAG = TopViewState.name;

    private _topStateMachine: StateMachine;
    private _titleState: TitleState;
    private _menuState: MenuState;
    private _levelSelectState: LevelSelectState;

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
        this._levelSelectState = new LevelSelectState();

        this._topStateMachine = new StateMachine({
            [TitleState.TAG]: this._titleState,
            [MenuState.TAG]: this._menuState,
            [LevelSelectState.TAG]: this._levelSelectState,
        });

        this._topStateMachine.init(TitleState.TAG);

        addEvents({
            [Events.TAP_TITLE]: this._handleTapTitleEvent,
            [Events.START_SINGLE_PLAY]: this._handleStartSinglePlayEvent,
            [Events.SELECT_NPC_LEVEL]: this._handleSelectNpcLevelEvent,
        });
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        removeEvents([
            Events.TAP_TITLE,
            Events.START_SINGLE_PLAY,
            Events.SELECT_NPC_LEVEL
        ])
    }

    /**
     *
     * @private
     */
    private _handleTapTitleEvent = () => {

    };

    /**
     *
     * @private
     */
    private _handleStartSinglePlayEvent = () => {

    };

    /**
     *
     * @private
     */
    private _handleSelectNpcLevelEvent = () => {

    };
}

export default TopViewState;
