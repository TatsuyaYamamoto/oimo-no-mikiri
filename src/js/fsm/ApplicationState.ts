import Application from "../../framework/Application";
import StateMachine from "../../framework/StateMachine";
import {getCurrentViewSize, getScale} from "../../framework/utils";
import {addEvents, removeEvents} from '../../framework/EventUtils';
import ViewContainer from "../../framework/ViewContainer";

import InitialViewState from "./InitialView";
import GameViewState, {EnterParams as GameViewEnterParams} from "./GameView";
import TopViewState from "./TopView";

import {toggleMute} from '../helper/MusicPlayer';

export enum Events {
    INITIALIZED = "ApplicationState@INITIALIZED",
    REQUESTED_GAME_START = "ApplicationState@REQUESTED_GAME_START",
    REQUESTED_BACK_TO_TOP = "ApplicationState@REQUESTED_BACK_TO_TOP",
}

enum InnerStates {
    INITIAL = "initial",
    TOP = "top",
    GAME = "game",
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
            [InnerStates.INITIAL]: new InitialViewState(),
            [InnerStates.TOP]: new TopViewState(),
            [InnerStates.GAME]: new GameViewState(),
        });

        addEvents({
            [Events.INITIALIZED]: this._handleInitializedEvent,
            [Events.REQUESTED_GAME_START]: this._handleRequestedGameStartEvent,
            [Events.REQUESTED_BACK_TO_TOP]: this._handleRequestedBackToTopEvent,
        });

        window.addEventListener('resize', this.onResize);
        window.addEventListener('blur', toggleMute);
        window.addEventListener('focus', toggleMute);

        this._to(InnerStates.INITIAL);
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
        this._to(InnerStates.TOP);
    };

    /**
     *
     * @private
     */
    private _handleRequestedGameStartEvent = (e: CustomEvent) => {
        const {mode} = e.detail;

        this._to<GameViewEnterParams>(InnerStates.GAME, {mode});
    };

    /**
     *
     * @private
     */
    private _handleRequestedBackToTopEvent = () => {
        this._to(InnerStates.TOP);
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
