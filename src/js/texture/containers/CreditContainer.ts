import {Container, interaction} from 'pixi.js';

import {t} from "../../../framework/i18n";
import {isSupportTouchEvent} from "../../../framework/utils";

import CreditItem from "../sprite/text/CreditItem";
import BackToMenuButton from "../sprite/button/BackToMenuButton";

import {Ids} from "../../resources/string";
import {URL} from "../../Constants";

/**
 * @class
 */
class CreditContainer extends Container {
    private _t28Credit: CreditItem;
    private _sanzashiCredit: CreditItem;
    private _onjinCredit: CreditItem;
    private _loveliveCredit: CreditItem;

    private _backToMenuButton: BackToMenuButton;

    constructor(width: number, height: number) {
        super();

        this._t28Credit = new CreditItem(t(Ids.CREDIT_T28), URL.SOKONTOKORO_HOME);
        this._t28Credit.position.set(-1 * width * 0.3, -1 * height * 0.3);

        this._sanzashiCredit = new CreditItem(t(Ids.CREDIT_SANZASHI), URL.TWITTER_HOME_SANZASHI);
        this._sanzashiCredit.position.set(width * 0.3, -1 * height * 0.2);

        this._onjinCredit = new CreditItem(t(Ids.CREDIT_ON_JIN), URL.ONJIN_TOP);
        this._onjinCredit.position.set(-1 * width * 0.3, height * 0.1);

        this._loveliveCredit = new CreditItem(t(Ids.CREDIT_LOVELIVE), URL.LOVELIVE_TOP);
        this._loveliveCredit.position.set(width * 0.3, height * 0.3);

        this._backToMenuButton = new BackToMenuButton();
        this._backToMenuButton.position.set(-1 * width * 0.4, height * 0.4);

        this.addChild(
            this._backToMenuButton,
            this._t28Credit,
            this._sanzashiCredit,
            this._onjinCredit,
            this._loveliveCredit,
        );
    }

    public setOnBackToMenuButtonClickListener(fn: (event: interaction.InteractionEvent) => void) {
        this._backToMenuButton.interactive = true;
        this._backToMenuButton.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }
}

export default CreditContainer;
