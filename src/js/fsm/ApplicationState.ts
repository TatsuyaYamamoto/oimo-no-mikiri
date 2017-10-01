import Application from "../../framework/Application";
import StateMachine from "../../framework/StateMachine";
import {toggleMute} from '../../framework/utils';
import {getCurrentViewSize, getScale} from "../../framework/utils";
import {addEvents, removeEvents} from '../../framework/EventUtils';

import InitialViewState from "./views/InitialViewState";
import GameViewState, {EnterParams as GameViewEnterParams} from "./views/GameViewState";
import {NPC_LEVELS} from "../Constants";

export enum Events {
    INITIALIZED = "ApplicationState@INITIALIZED",
}

class ApplicationState extends Application {
    private _viewStateMachine: StateMachine;

    private _initialViewState: InitialViewState;
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
        this._gameViewState = new GameViewState();

        this._viewStateMachine = new StateMachine({
            [InitialViewState.TAG]: this._initialViewState,
            [GameViewState.TAG]: this._gameViewState
        });

        addEvents({
            [Events.INITIALIZED]: this._goGameViewState,
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
    private _goGameViewState = () => {
        this._viewStateMachine.change(GameViewState.TAG, () => {
            const params: GameViewEnterParams = {
                level: NPC_LEVELS.MIDDLE,
                roundLength: 5,
            };

            return params;
        });
        this.stage.removeChildren();
        this.stage.addChild(this._gameViewState);
    }
}

export default ApplicationState;
