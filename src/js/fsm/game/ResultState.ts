import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";

import {Events} from "../views/GameViewState";

import GameBackground from "../../texture/sprite/background/GameBackground";
import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Hanamaru from "../../texture/sprite/character/Hanamaru";

class ResultState extends ViewContainer {
    public static TAG = ResultState.name;

    private _background: GameBackground;

    private _playerCharacter: Hanamaru;
    private _opponentCharacter: Uchicchi;

    /**
     * @override
     */
    update(elapsedTimeMillis: number): void {
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new GameBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this._playerCharacter = new Hanamaru();
        this._playerCharacter.position.set(this.viewWidth * 0.3, this.viewHeight * 0.5);

        this._opponentCharacter = new Uchicchi();
        this._opponentCharacter.position.set(this.viewWidth * 0.7, this.viewHeight * 0.5);

        this.backGroundLayer.addChild(
            this._background,
        );
        this.applicationLayer.addChild(
            this._playerCharacter,
            this._opponentCharacter,
        );

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 1000);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default ResultState;
