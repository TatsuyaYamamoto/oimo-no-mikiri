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

import JoinModal from "../../helper/modal/JoinModal";
import { stop } from "../../helper/MusicPlayer";
import ReadyModal from "../../helper/modal/ReadyModal";
import WaitingJoinModal from "../../helper/modal/WaitingJoinModal";
import RoomCreationModal from "../../helper/modal/RoomCreationModal";
import MemberLeftModal from "../../helper/modal/MemberLeftModal";
import RejectJoinModal from "../../helper/modal/RejectJoinModal";

import { Ids as SoundIds } from "../../resources/sound";
import LocalGame from "../../models/local/LocalGame";

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

class TopViewState extends ViewContainer {
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
            [InnerStates.TITLE]: new TitleState(),
            [InnerStates.MENU]: new MenuState(),
            [InnerStates.HOW_TO_PLAY]: new HowToPlayState(),
            [InnerStates.CREDIT]: new CreditState(),
        });

        addEvents({
            [Events.TAP_TITLE]: this._handleTapTitleEvent,
            [Events.REQUEST_BACK_TO_MENU]: this._handleRequestBackMenuEvent,
            [Events.REQUEST_HOW_TO_PLAY]: this._handleRequestHowToPlayEvent,
            [Events.REQUEST_CREDIT]: this._handleRequestCredit,
            [Events.FIXED_PLAY_MODE]: this._handleFixedPlayModeEvent,
        });

        this._to(InnerStates.TITLE);
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
        this._to(InnerStates.MENU);
    };

    /**
     *
     * @private
     */
    private _handleRequestHowToPlayEvent = () => {
        this._to(InnerStates.HOW_TO_PLAY);
    };

    /**
     *
     * @private
     */
    private _handleRequestBackMenuEvent = () => {
        this._to(InnerStates.MENU);
    };

    /**
     *
     * @private
     */
    private _handleRequestCredit = () => {
        this._to(InnerStates.CREDIT);
    };

    /**
     *
     * @private
     */
    private _handleFixedPlayModeEvent = (e: CustomEvent) => {
        const {mode, gameId} = e.detail;
        console.log("Fixed play mode: ", mode);


        switch (mode) {
            case Mode.MULTI_ONLINE:
                gameId ?
                    this.joinGame(gameId) :
                    this.createGame();
                break;
            default:
                dispatchEvent(AppEvents.REQUESTED_GAME_START, {
                    game: new LocalGame(mode)
                });
        }

    };

    /**
     *
     */
    private createGame = async () => {
        const creationModal = new RoomCreationModal();
        creationModal.open();

        const game = await OnlineGame.create();
        game.join();
        game.on(GameEvents.MEMBER_LEFT, () => {
            new MemberLeftModal().open();
            setTimeout(() => location.reload(), 2000);
        });

        const url = `${location.protocol}//${location.host}${location.pathname}?gameId=${game.id}`;

        const waitingModal = new WaitingJoinModal(url);
        const readyModal = new ReadyModal();

        game.once(GameEvents.FULFILLED_MEMBERS, () => {
            waitingModal.close();
            readyModal.open();

            game.requestReady();
        });

        game.once(GameEvents.IS_READY, () => {
            stop(SoundIds.SOUND_ZENKAI);
            readyModal.close();

            dispatchEvent(AppEvents.REQUESTED_GAME_START, {
                game
            });
        });

        creationModal.close();
        waitingModal.open();
    };

    /**
     *
     * @param {string} gameId
     */
    private joinGame = (gameId: string) => {
        const joinModal = new JoinModal(gameId);
        const readyModal = new ReadyModal();

        joinModal.open();

        const game = new OnlineGame(gameId);
        game.on(GameEvents.MEMBER_LEFT, () => {
            new MemberLeftModal().open();
            setTimeout(() => location.reload(), 2000);
        });
        game.once(GameEvents.FULFILLED_MEMBERS, () => {
            joinModal.close();
            readyModal.open();

            game.requestReady();
        });
        game.once(GameEvents.IS_READY, () => {
            stop(SoundIds.SOUND_ZENKAI);
            readyModal.close();

            dispatchEvent(AppEvents.REQUESTED_GAME_START, {
                game
            });
        });

        game.join().catch((e) => {
            joinModal.close();

            const rejectModal = new RejectJoinModal({
                onClose: () => this._to(InnerStates.TITLE)
            });
            rejectModal.open();
        })
    };

    private _to = (stateTag: string) => {
        this._topStateMachine.change(stateTag);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this._topStateMachine.current);
    }
}

export default TopViewState;
