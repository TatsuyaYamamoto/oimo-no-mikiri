import AutoBind from "autobind-decorator";

import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";
import { dispatchEvent, addEvents, removeEvents } from "../../../framework/EventUtils";

import { Events as AppEvents } from '../ApplicationState';
import HowToPlayState from "./internal/HowToPlayState";
import CreditState from "./internal/CreditState";
import TitleState from "./internal/TitleState";
import MenuState from "./internal/MenuState";

import OnlineGame, { GameEvents } from "../../models/online/OnlineGame";
import Mode from "../../models/Mode";
import LocalGame from "../../models/local/LocalGame";

import { stop } from "../../helper/MusicPlayer";

import { Ids as SoundIds } from "../../resources/sound";

import {
    closeModal,
    openCreateRoomModal,
    openJoinRoomModal,
    openReadyRoomModal,
    openRejectJoinRoomModal
} from "../../helper/modals";

export enum Events {
    TAP_TITLE = 'GameView@TAP_TITLE',
    REQUEST_BACK_TO_MENU = 'GameView@REQUEST_BACK_TO_MENU',
    REQUEST_HOW_TO_PLAY = 'GameView@REQUEST_HOW_TO_PLAY',
    REQUEST_CREDIT = 'GameView@REQUEST_CREDIT',
    FIXED_PLAY_MODE = 'GameView@FIXED_PLAY_MODE',
}

enum InnerStates {
    TITLE = "title",
    MENU = "menu",
    HOW_TO_PLAY = "how_to_play",
    CREDIT = "credit",
}

@AutoBind
class TopViewState extends ViewContainer {
    /**
     * @override
     */
    update(elapsedTime: number): void {
        super.update(elapsedTime);

        this.stateMachine.update(elapsedTime);
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this.stateMachine = new StateMachine({
            [InnerStates.TITLE]: new TitleState(),
            [InnerStates.MENU]: new MenuState(),
            [InnerStates.HOW_TO_PLAY]: new HowToPlayState(),
            [InnerStates.CREDIT]: new CreditState(),
        });

        addEvents({
            [Events.TAP_TITLE]: this.handleTapTitleEvent,
            [Events.REQUEST_BACK_TO_MENU]: this.handleRequestBackMenuEvent,
            [Events.REQUEST_HOW_TO_PLAY]: this.handleRequestHowToPlayEvent,
            [Events.REQUEST_CREDIT]: this.handleRequestCredit,
            [Events.FIXED_PLAY_MODE]: this.handleFixedPlayModeEvent,
        });

        this.to(InnerStates.TITLE);
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
     */
    private handleTapTitleEvent = () => {
        this.to(InnerStates.MENU);
    };

    /**
     *
     */
    private handleRequestHowToPlayEvent = () => {
        this.to(InnerStates.HOW_TO_PLAY);
    };

    /**
     *
     * @private
     */
    private handleRequestBackMenuEvent = () => {
        this.to(InnerStates.MENU);
    };

    /**
     *
     * @private
     */
    private handleRequestCredit = () => {
        this.to(InnerStates.CREDIT);
    };

    /**
     *
     * @private
     */
    private handleFixedPlayModeEvent = (e: CustomEvent) => {
        const {mode, gameId} = e.detail;
        console.log("Fixed play mode: ", mode);


        switch (mode) {
            case Mode.MULTI_ONLINE:
                gameId ?
                    this.joinGame(gameId) :
                    this.createGame();
                break;
            default:
                stop(SoundIds.SOUND_ZENKAI);
                dispatchEvent(AppEvents.REQUESTED_GAME_START, {
                    game: new LocalGame(mode)
                });
        }

    };

    /**
     *
     */
    private createGame = async () => {
        const game = await OnlineGame.create();
        game.join();
        game.once(GameEvents.FULFILLED_MEMBERS, () => {
            openReadyRoomModal();
            game.requestReady();
        });

        game.once(GameEvents.IS_READY, () => {
            stop(SoundIds.SOUND_ZENKAI);
            console.error("colose!!!");
            closeModal();
            setTimeout(() => dispatchEvent(AppEvents.REQUESTED_GAME_START, {game}), 0);
        });

        const url = `${location.protocol}//${location.host}${location.pathname}?gameId=${game.id}`;

        openCreateRoomModal(url);
    };

    /**
     *
     * @param {string} gameId
     */
    private joinGame = (gameId: string) => {
        openJoinRoomModal(gameId);

        const game = new OnlineGame(gameId);
        game.once(GameEvents.FULFILLED_MEMBERS, () => {
            openReadyRoomModal();
            game.requestReady();
        });
        game.once(GameEvents.IS_READY, () => {
            stop(SoundIds.SOUND_ZENKAI);
            closeModal();
            setTimeout(() => dispatchEvent(AppEvents.REQUESTED_GAME_START, {game}), 0);
        });

        game.join().catch((e) => {
            openRejectJoinRoomModal(gameId);

            setTimeout(() => {
                closeModal();
                this.to(InnerStates.TITLE);
            }, 2000);
        })
    };
}

export default TopViewState;
