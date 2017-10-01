import {Container, interaction} from 'pixi.js';

import {t} from '../../../framework/i18n';
import {isSupportTouchEvent} from "../../../framework/utils";

import Text from "../sprite/Text";

import {Ids as StringIds} from '../../resources/string';

class SelectLevelBoard extends Container {
    private _beginnerText: Text;
    private _noviceText: Text;
    private _expertText: Text;

    constructor() {
        super();

        this._beginnerText = new Text(t(StringIds.BEGINNER));
        this._beginnerText.position.x -= this._beginnerText.width;

        this._noviceText = new Text(t(StringIds.NOVICE));

        this._expertText = new Text(t(StringIds.EXPERT));
        this._expertText.position.x += this._expertText.width;

        this.addChild(
            this._beginnerText,
            this._noviceText,
            this._expertText,
        );
    }

    public setOnSelectBeginnerListener(fn: (event: interaction.InteractionEvent) => void) {
        this._beginnerText.interactive = true;
        this._beginnerText.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }

    public setOnSelectNoviceListener(fn: (event: interaction.InteractionEvent) => void) {
        this._beginnerText.interactive = true;
        this._beginnerText.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }

    public setOnSelectExpertListener(fn: (event: interaction.InteractionEvent) => void) {
        this._beginnerText.interactive = true;
        this._beginnerText.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }
}

export default SelectLevelBoard;
