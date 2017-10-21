import Application from "../../framework/Application";
import StateMachine from "../../framework/StateMachine";
import {getCurrentViewSize, getScale} from "../../framework/utils";
import {addEvents, removeEvents} from '../../framework/EventUtils';

import InitialViewState from "./views/InitialViewState";
import GameViewState, {EnterParams as GameViewEnterParams} from "./views/GameViewState";
import TopViewState from "./views/TopViewState";

import {toggleMute} from '../helper/MusicPlayer';
import {NPC_LEVELS} from "../Constants";

export enum Events {
    INITIALIZED = "ApplicationState@INITIALIZED",
    REQUESTED_GAME_START = "ApplicationState@REQUESTED_GAME_START",
    REQUESTED_BACK_TO_TOP = "ApplicationState@REQUESTED_BACK_TO_TOP",
}

class ApplicationState extends Application {
    private _viewStateMachine: StateMachine;

    private _initialViewState: InitialViewState;
    private _topViewState: TopViewState;
    private _gameViewState: GameViewState;

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

        this._initialViewState = new InitialViewState();
        this._topViewState = new TopViewState();
        this._gameViewState = new GameViewState();

        this._viewStateMachine = new StateMachine({
            [InitialViewState.TAG]: this._initialViewState,
            [TopViewState.TAG]: this._topViewState,
            [GameViewState.TAG]: this._gameViewState
        });

        addEvents({
            [Events.INITIALIZED]: this._handleInitializedEvent,
            [Events.REQUESTED_GAME_START]: this._handleRequestedGameStartEvent,
            [Events.REQUESTED_BACK_TO_TOP]: this._handleRequestedBackToTopEvent,
        });

        window.addEventListener('resize', this.onResize);
        window.addEventListener('blur', toggleMute);
        window.addEventListener('focus', toggleMute);

        this._viewStateMachine.init(InitialViewState.TAG);
        this.stage.addChild(this._initialViewState);
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
        this._viewStateMachine.change(TopViewState.TAG);
        this.stage.removeChildren();
        this.stage.addChild(this._topViewState);
    };

    /**
     *
     * @private
     */
    private _handleRequestedGameStartEvent = (e: CustomEvent) => {
        const mode: "beginner" | "novice" | "expert" = e.detail.mode;
        let level: NPC_LEVELS = NPC_LEVELS[mode.toUpperCase()];

        this._viewStateMachine.change<GameViewEnterParams>(GameViewState.TAG, {
            level,
            roundLength: 5,
        });
        this.stage.removeChildren();
        this.stage.addChild(this._gameViewState);
    };

    /**
     *
     * @private
     */
    private _handleRequestedBackToTopEvent = () => {
        this._viewStateMachine.change(TopViewState.TAG);
        this.stage.removeChildren();
        this.stage.addChild(this._topViewState);
    };
}

export default ApplicationState;
