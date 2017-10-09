import {Container, Graphics} from 'pixi.js';

import VerticalText from "../sprite/text/VerticalText";
import Text from "../internal/Text";

class BattleResultLabel extends Container {
    private _text: VerticalText;
    private _rectangle: Graphics;

    constructor(text: string, isVertical = true) {
        super();
        this._text = isVertical ?
            new VerticalText(text) :
            new Text(text);

        const rectangleWidth = this._text.width * 1.5;
        const rectangleHeight = this._text.height * 1.5;

        this._rectangle = new Graphics();
        this._rectangle.beginFill(0xffffff, 1);
        this._rectangle.drawRect(
            -1 * rectangleWidth * 0.5,
            -1 * rectangleHeight * 0.5,
            rectangleWidth,
            rectangleHeight);
        this._rectangle.endFill();

        this.addChild(
            this._rectangle,
            this._text,
        );
    }
}

export default BattleResultLabel;
