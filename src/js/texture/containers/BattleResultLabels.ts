import {Container, Graphics} from 'pixi.js';
import VerticalText from "../sprite/text/VerticalText";

export enum BattleResultTypes {
    PLAYER_WIN = 'playerWin',
    OPPONENT_WIN = 'opponentWin',
    DRAW = 'draw',
    PLAYER_FALSE_STARTED = 'playerFalseStarted',
    OPPONENT_FALSE_STARTED = 'opponentFalseStarted'
}

class Label extends Container {
    private _text: VerticalText;
    private _rectangle: Graphics;

    constructor(text: string) {
        super();
        this._text = new VerticalText(text);

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

class BattleResultLabels extends Container {
    private _type: BattleResultTypes;

    private _resultLabel: Label;
    private _playerLabel: Label;
    private _opponentLabel: Label;

    constructor(width: number, height: number, type: BattleResultTypes, winnerName?: string) {
        super();
        this._type = type;

        if (this._type === BattleResultTypes.PLAYER_FALSE_STARTED || this._type === BattleResultTypes.OPPONENT_FALSE_STARTED) {
            this._resultLabel = new Label("仕切り直し");
        } else {
            this._resultLabel = new Label("勝者");
        }

        this._playerLabel = new Label(winnerName);
        this._playerLabel.position.x = -1 * width * 0.3;

        this._opponentLabel = new Label(winnerName);
        this._opponentLabel.position.x = width * 0.3;

        switch (this._type) {
            case BattleResultTypes.PLAYER_WIN:
                this.addChild(this._playerLabel, this._resultLabel);
                break;

            case BattleResultTypes.OPPONENT_WIN:
                this.addChild(this._opponentLabel, this._resultLabel);
                break;

            case BattleResultTypes.PLAYER_FALSE_STARTED:
            case BattleResultTypes.OPPONENT_FALSE_STARTED:
                this._resultLabel = new Label("仕切り直し");
                this.addChild(this._resultLabel,);
                break;

            case BattleResultTypes.DRAW:
            default:
                this._resultLabel = new Label("勝者");
                this.addChild(this._resultLabel,);
                break;
        }
    }

    public show(value: boolean) {
        this.visible = value;
    }
}

export default BattleResultLabels;
