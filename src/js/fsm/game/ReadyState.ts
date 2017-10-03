import ViewContainer from "../../../framework/ViewContainer";
import {dispatchEvent} from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";

import {Events} from '../views/GameViewState';

import GameBackground from "../../texture/sprite/background/GameBackground";
import Uchicchi from "../../texture/sprite/character/Uchicchi";
import UchicchiCloseUp from "../../texture/sprite/character/UchicchiCloseUp";
import Hanamaru from "../../texture/sprite/character/Hanamaru";
import HanamaruCloseUp from "../../texture/sprite/character/HanamaruCloseUp";

class ReadyState extends ViewContainer {
    public static TAG = ReadyState.name;

    private _background: GameBackground;

    private _playerCharacter: Hanamaru;
    private _playerCharacterCloseup: HanamaruCloseUp;
    private _opponentCharacter: Uchicchi;
    private _opponentCharacterCloseup: UchicchiCloseUp;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new GameBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._playerCharacter = new Hanamaru();
        this._playerCharacter.position.set(this.viewWidth * 0.3, this.viewHeight * 0.5);

        this._playerCharacterCloseup = new HanamaruCloseUp();
        this._playerCharacterCloseup.position.set(this.viewWidth * 0.5, this.viewHeight * 0.2);

        this._opponentCharacter = new Uchicchi();
        this._opponentCharacter.position.set(this.viewWidth * 0.7, this.viewHeight * 0.5);

        this._opponentCharacterCloseup = new UchicchiCloseUp();
        this._opponentCharacterCloseup.position.set(this.viewWidth * 0.5, this.viewHeight * 0.8);

        this.backGroundLayer.addChild(
            this._background,
        );

        this.applicationLayer.addChild(
            this._playerCharacter,
            this._opponentCharacter,
            this._playerCharacterCloseup,
            this._opponentCharacterCloseup,
        );


        // TODO: set animation component and fire event on complete.
        window.setTimeout(function () {
            dispatchEvent(Events.IS_READY);
        }, 1000);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default ReadyState;
