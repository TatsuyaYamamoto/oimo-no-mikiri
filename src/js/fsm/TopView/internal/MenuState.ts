import Deliverable from "../../../../framework/Deliverable";
import { dispatchEvent } from "../../../../framework/EventUtils";

import { Events } from "../TopView";
import AbstractTopState from "./TopViewState";

import MenuBoard from "../../../texture/containers/MenuBoard";
import SelectLevelBoard from "../../../texture/containers/SelectLevelBoard";

import Mode, { Level } from "../../../models/Mode";

import { play, stop, toggleMute } from "../../../helper/MusicPlayer";
import { goTo } from "../../../helper/network";
import { Action, Category, trackEvent, trackPageView, VirtualPageViews } from "../../../helper/tracker";
import { onJoinedRoom, requestCreateRoom, requestLeaveRoom } from "../../../helper/firebase";
import RoomCreationModal from "../../../helper/modal/RoomCreationModal";
import WaitingJoinModal from "../../../helper/modal/WaitingJoinModal";
import ReadyModal from "../../../helper/modal/ReadyModal";

import { URL } from '../../../Constants';
import { Ids as SoundIds } from '../../../resources/sound';


class MenuState extends AbstractTopState {
    private _menuBoard: MenuBoard;
    private _selectLevelBoard: SelectLevelBoard;

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);
        this.background.progress(elapsedMS);
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        // Tracking
        trackPageView(VirtualPageViews.MENU);

        this._menuBoard = new MenuBoard(this.viewHeight, this.viewHeight);
        this._menuBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this._menuBoard.setOnSelectHomeListener(this._onSelectHome);
        this._menuBoard.setOnSelectSoundListener(this._onToggleSound);
        this._menuBoard.setOnOnePlayerGameStartClickListener(this._onOnePlayerSelected);
        this._menuBoard.setOnTwoPlayerGameStartClickListener(this._onTwoPlayerSelected);
        this._menuBoard.setOnOnlineGameStartClickListener(this._onOnlineSelected);
        this._menuBoard.setOnSelectHowToPlayListener(this._onSelectHowToPlay);
        this._menuBoard.setOnSelectCreditListener(this._onSelectCredit);

        this._selectLevelBoard = new SelectLevelBoard(this.viewHeight, this.viewHeight);
        this._selectLevelBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this._selectLevelBoard.setOnSelectLevelListener(this._onSelectLevel);

        this.backGroundLayer.addChild(
            this.background
        );

        this.applicationLayer.addChild(
            this._menuBoard,
        )
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }

    /**
     *
     * @private
     */
    private _onSelectHome = () => {
        goTo(URL.TWITTER_HOME_T28);

        trackEvent(
            Category.BUTTON,
            Action.TAP,
            "home");
    };

    /**
     *
     * @private
     */
    private _onToggleSound = () => {
        play(SoundIds.SOUND_TOGGLE_SOUND);
        toggleMute();

        trackEvent(
            Category.BUTTON,
            Action.TAP,
            "toggle_sound");
    };

    /**
     *
     * @private
     */
    private _onOnePlayerSelected = () => {
        this.applicationLayer.removeChild(
            this._menuBoard,
        );
        this.applicationLayer.addChild(
            this._selectLevelBoard,
        );

        play(SoundIds.SOUND_OK);

        trackEvent(
            Category.BUTTON,
            Action.TAP,
            "single_play_mode");
    };

    private _onTwoPlayerSelected = () => {
        dispatchEvent(Events.FIXED_PLAY_MODE, {mode: Mode.asTwoPlayer()});

        stop(SoundIds.SOUND_ZENKAI);
        play(SoundIds.SOUND_OK);

        trackEvent(
            Category.BUTTON,
            Action.TAP,
            "multi_play_mode");
    };

    private _onOnlineSelected = async () => {
        play(SoundIds.SOUND_OK);

        const creationModal = new RoomCreationModal();
        creationModal.open();

        const roomId = await requestCreateRoom();
        const url = `${location.protocol}//${location.hostname}${location.pathname}?roomId=${roomId}`;

        const waitingModal = new WaitingJoinModal(url);

        onJoinedRoom(roomId, () => {
            waitingModal.close();
            const readyModal = new ReadyModal();
            readyModal.open();
            setTimeout(() => {
                readyModal.close();
            }, 3000)
        });

        creationModal.close();
        waitingModal.open();

    };

    /**
     *
     * @private
     */
    private _onSelectHowToPlay = () => {
        dispatchEvent(Events.REQUEST_HOW_TO_PLAY);

        play(SoundIds.SOUND_OK);
    };

    /**
     *
     * @private
     */
    private _onSelectCredit = () => {
        dispatchEvent(Events.REQUEST_CREDIT);

        play(SoundIds.SOUND_OK);
    };

    /**
     *
     * @private
     */
    private _onSelectLevel = (e, level: Level) => {
        dispatchEvent(Events.FIXED_PLAY_MODE, {mode: Mode.asOnePlayer(level)});

        stop(SoundIds.SOUND_ZENKAI);
        play(SoundIds.SOUND_OK);

        trackEvent(
            Category.BUTTON,
            Action.TAP,
            level);
    };
}

export default MenuState;
