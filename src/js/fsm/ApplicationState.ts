import AutoBind from "autobind-decorator";

import Application from "../../framework/Application";
import StateMachine from "../../framework/StateMachine";
import { getCurrentViewSize, getScale } from "../../framework/utils";
import { addEvents, removeEvents } from '../../framework/EventUtils';
import ViewContainer from "../../framework/ViewContainer";

import InitialViewState from "./InitialView";
import { EnterParams as GameViewEnterParams } from "./GameView/GameView";
import LocalGameView from "./GameView/LocalGameView";
import OnlineGameView from "./GameView/OnlineGameView";
import TopViewState from "./TopView";

import { toggleMute } from '../helper/MusicPlayer';
import { isOnlineMode } from "../models/Game";

export enum Events {
    INITIALIZED = "ApplicationState@INITIALIZED",
    REQUESTED_GAME_START = "ApplicationState@REQUESTED_GAME_START",
    REQUESTED_BACK_TO_TOP = "ApplicationState@REQUESTED_BACK_TO_TOP",
}

enum InnerStates {
    INITIAL = "initial",
    TOP = "top",
    GAME = "game",
    ONLINE_GAME = "online_game",
}

@AutoBind
class ApplicationState extends Application {
    private viewStateMachine: StateMachine<ViewContainer>;

    constructor() {
        super(getCurrentViewSize());
    }

    /**
     * @override
     */
    update(elapsedTime: number): void {
        this.viewStateMachine.update(elapsedTime);
    }

    /**
     * @override
     */
    onEnter(): void {
        this.updateRendererSize();
        this.updateStageScale();

        // TODO create instance each changing state.
        this.viewStateMachine = new StateMachine({
            [InnerStates.INITIAL]: new InitialViewState(),
            [InnerStates.TOP]: new TopViewState(),
            [InnerStates.GAME]: new LocalGameView(),
            [InnerStates.ONLINE_GAME]: new OnlineGameView(),
        });

        addEvents({
            [Events.INITIALIZED]: this.handleInitializedEvent,
            [Events.REQUESTED_GAME_START]: this.handleRequestedGameStartEvent,
            [Events.REQUESTED_BACK_TO_TOP]: this.handleRequestedBackToTopEvent,
        });

        window.addEventListener('resize', this.onResize);
        window.addEventListener('blur', toggleMute);
        window.addEventListener('focus', toggleMute);

        this.to(InnerStates.INITIAL);
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
     */
    protected onResize(): void {
        this.updateRendererSize();
        this.updateStageScale();
    };

    /**
     *
     *
     * @param {string} stateTag
     * @param {T} params
     */
    protected to = <T>(stateTag: string, params?: T): void => {
        this.viewStateMachine.change(stateTag, params);
        this.stage.removeChildren();
        this.stage.addChild(this.viewStateMachine.current);
    }

    /**
     *
     */
    private updateRendererSize() {
        const {width, height} = getCurrentViewSize();
        this.renderer.resize(width, height);
    };

    /**
     *
     */
    private updateStageScale() {
        this.stage.scale.x = this.stage.scale.y = getScale();
    };

    /**
     *
     * @private
     */
    private handleInitializedEvent() {
        this.to(InnerStates.TOP);
    };

    /**
     *
     * @private
     */
    private handleRequestedGameStartEvent(e: CustomEvent) {
        const {game} = e.detail;

        const nextState = isOnlineMode(game.mode) ?
            InnerStates.ONLINE_GAME :
            InnerStates.GAME;

        this.to<GameViewEnterParams>(nextState, {game});
    };

    /**
     *
     * @private
     */
    private handleRequestedBackToTopEvent() {
        this.to(InnerStates.TOP);
    };
}

export default ApplicationState;
