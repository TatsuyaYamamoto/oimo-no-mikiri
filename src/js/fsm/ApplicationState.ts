import Application from "../../framework/Application";
import StateMachine from "../../framework/StateMachine";
import {getCurrentViewSize, getScale} from "../../framework/utils";
import {addEvents, removeEvents} from '../../framework/EventUtils';

import InitialViewState from "./InitialView";
import GameViewState, {EnterParams as GameViewEnterParams} from "./GameView";
import TopViewState from "./TopView";

import {toggleMute} from '../helper/MusicPlayer';
import {NPC_LEVELS} from "../Constants";
import ViewContainer from "../../framework/ViewContainer";

export enum Events {
    INITIALIZED = "ApplicationState@INITIALIZED",
    REQUESTED_GAME_START = "ApplicationState@REQUESTED_GAME_START",
    REQUESTED_BACK_TO_TOP = "ApplicationState@REQUESTED_BACK_TO_TOP",
}

class ApplicationState extends Application {
    private _viewStateMachine: StateMachine<ViewContainer>;

    constructor() {
        super(getCurrentViewSize());
    }

    /**
     * @override
     */
    update(elapsedTime: number): void {
        this._viewStateMachine.update(elapsedTime);
    }

    /**
     * @override
     */
    onEnter(): void {
        this._updateRendererSize();
        this._updateStageScale();

        this._viewStateMachine = new StateMachine({
            [InitialViewState.TAG]: new InitialViewState(),
            [TopViewState.TAG]: new TopViewState(),
            [GameViewState.TAG]: new GameViewState(),
        });

        addEvents({
            [Events.INITIALIZED]: this._handleInitializedEvent,
            [Events.REQUESTED_GAME_START]: this._handleRequestedGameStartEvent,
            [Events.REQUESTED_BACK_TO_TOP]: this._handleRequestedBackToTopEvent,
        });

        window.addEventListener('resize', this.onResize);
        window.addEventListener('blur', toggleMute);
        window.addEventListener('focus', toggleMute);

        this._to(InitialViewState.TAG);
    }

    /**
     * @override
     */
    onExit(): void {
        removeEvents([
            Events.INITIALIZED,
        ]);
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('blur', toggleMute);
        window.removeEventListener('focus', toggleMute);
    }

    /**
     *
     * @private
     */
    private onResize = (): void => {
        this._updateRendererSize();
        this._updateStageScale();
    };

    /**
     *
     * @private
     */
    private _updateRendererSize = () => {
        const {width, height} = getCurrentViewSize();
        this.renderer.resize(width, height);
    };

    /**
     *
     * @private
     */
    private _updateStageScale = () => {
        this.stage.scale.x = this.stage.scale.y = getScale();
    };

    /**
     *
     * @private
     */
    private _handleInitializedEvent = () => {
        this._to(TopViewState.TAG);
    };

    /**
     *
     * @private
     */
    private _handleRequestedGameStartEvent = (e: CustomEvent) => {
        const mode: "beginner" | "novice" | "expert" = e.detail.mode;
        let level: NPC_LEVELS = NPC_LEVELS[mode.toUpperCase()];

        this._to<GameViewEnterParams>(GameViewState.TAG, {
            level,
            roundLength: 5,
        });
    };

    /**
     *
     * @private
     */
    private _handleRequestedBackToTopEvent = () => {
        this._to(TopViewState.TAG);
    };

    /**
     *
     *
     * @param {string} stateTag
     * @param {T} params
     * @private
     */
    private _to = <T>(stateTag: string, params?: T): void => {
        this._viewStateMachine.change(stateTag, params);
        this.stage.removeChildren();
        this.stage.addChild(this._viewStateMachine.current);
    }
}

export default ApplicationState;
