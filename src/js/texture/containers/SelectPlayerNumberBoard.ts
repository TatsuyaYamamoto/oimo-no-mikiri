import {Container, interaction} from 'pixi.js';

import {t} from '../../../framework/i18n';
import {isSupportTouchEvent} from "../../../framework/utils";

import Text from "../sprite/Text";

import {Ids as StringIds} from '../../resources/string';

class SelectPlayerNumberBoard extends Container {
    private _onePlayerText: Text;
    private _twoPlayerText: Text;

    constructor() {
        super();

        this._onePlayerText = new Text(t(StringIds.ONE_PLAYER));
        this._onePlayerText.position.x -= this._onePlayerText.width * 0.5;

        this._twoPlayerText = new Text(t(StringIds.TWO_PLAYERS));
        this._twoPlayerText.position.x += this._twoPlayerText.width * 0.5;
        
        this.addChild(
            this._onePlayerText,
            this._twoPlayerText,
        );
    }

    public setOnSelectOnePlayerListener(fn: (event: interaction.InteractionEvent) => void) {
        this._onePlayerText.interactive = true;
        this._onePlayerText.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }

    public setOnSelectTwoPlayerListener(fn: (event: interaction.InteractionEvent) => void) {
        this._twoPlayerText.interactive = true;
        this._twoPlayerText.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }
}

export default SelectPlayerNumberBoard;
