import {Container, interaction} from 'pixi.js';

import {t} from '../../../framework/i18n';
import {isSupportTouchEvent} from "../../../framework/utils";

import Text from "../internal/Text";

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

    /**
     * Register a callback to be invoked when any level is selected.
     *
     * @param {(event: PIXI.interaction.InteractionEvent, level: ("beginner" | "novice" | "expert")) => void} fn
     */
    public setOnSelectLevelListener(fn: (event: interaction.InteractionEvent, level: "beginner" | "novice" | "expert") => void) {
        const type = isSupportTouchEvent() ? 'touchstart' : 'click';

        this._beginnerText.interactive = true;
        this._beginnerText.on(type, (event: interaction.InteractionEvent) => fn(event, 'beginner'));

        this._noviceText.interactive = true;
        this._noviceText.on(type, (event: interaction.InteractionEvent) => fn(event, 'novice'));

        this._expertText.interactive = true;
        this._expertText.on(type, (event: interaction.InteractionEvent) => fn(event, 'expert'));
    }
}

export default SelectLevelBoard;
