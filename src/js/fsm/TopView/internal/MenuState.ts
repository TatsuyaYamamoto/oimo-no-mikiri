import Deliverable from "../../../../framework/Deliverable";
import {dispatchEvent} from "../../../../framework/EventUtils";

import {Events} from "../TopView";
import AbstractTopState from "./TopViewState";

import MenuBoard from "../../../texture/containers/MenuBoard";
import SelectLevelBoard from "../../../texture/containers/SelectLevelBoard";

import {play, stop} from "../../../helper/MusicPlayer";

import {Ids as SoundIds} from '../../../resources/sound';

class MenuState extends AbstractTopState {
    public static TAG = MenuState.name;

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

        this._menuBoard = new MenuBoard(this.viewHeight, this.viewHeight);
        this._menuBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this._menuBoard.setOnSelectGameStartListener(this._onSelectGameStart);
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
    private _onSelectGameStart = () => {
        this.applicationLayer.removeChild(
            this._menuBoard,
        );
        this.applicationLayer.addChild(
            this._selectLevelBoard,
        );

        play(SoundIds.SOUND_OK);
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
    private _onSelectLevel = (e, level: "beginner" | "novice" | "expert") => {
        console.log("selected level: ", level);
        dispatchEvent(Events.FIXED_PLAY_MODE, {mode: level});

        stop(SoundIds.SOUND_ZENKAI);
        play(SoundIds.SOUND_OK);
    }

}

export default MenuState;
