import {Graphics, Container} from 'pixi.js';

import {t} from '../../../framework/i18n';

import Text from "../internal/Text";
import Sprite from "../internal/Sprite";
import VerticalText from "../sprite/text/VerticalText";
import Player from "../sprite/character/Player";
import Opponent from "../sprite/character/Opponent";

import {Ids as StringIds} from "../../resources/string";

interface GameResultPaperOptions {
    width: number,
    height: number,
    straightWins: number,
    playerName: string,
    winnerName: string,
    topTime: number,
    player: Player,
    opponent: Opponent,
}

class GameResultPaper extends Container {
    private _background: Graphics;

    private _straightWinsLabel: Text;
    private _straightWinsValue: Text;
    private _topTimeLabel: Text;
    private _topTimeValue: Text;

    private _playerName: VerticalText;
    private _winnerName: Text;

    private _playerTexture: Sprite;
    private _opponentTexture: Sprite;

    constructor(options: GameResultPaperOptions) {
        super();

        const rectHeight = options.height * 0.9;
        const rectWidth = rectHeight * (1 / Math.sqrt(2));

        this._background = new Graphics();
        this._background.beginFill(0xffffff, 0.9);
        this._background.drawRoundedRect(-1 * rectWidth * 0.5, -1 * rectHeight * 0.5, rectWidth, rectHeight, 3);
        this._background.endFill();

        this._straightWinsLabel = new Text(t(StringIds.LABEL_STRAIGHT_WINS), {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 25,
        });
        this._straightWinsLabel.position.set(options.width * 0.05, -1 * options.height * 0.3);

        this._straightWinsValue = new Text(`${options.straightWins}`, {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 35,
        });
        this._straightWinsValue.position.set(-1 * options.width * 0.1, -1 * options.height * 0.3);

        this._topTimeLabel = new Text(t(StringIds.LABEL_TOP_TIME), {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 25,
        });
        this._topTimeLabel.position.set(-1 * options.width * 0.05, -1 * options.height * 0.2);

        this._topTimeValue = new Text(`${options.topTime}`, {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 35,
        });
        this._topTimeValue.position.set(options.width * 0.1, -1 * options.height * 0.2);

        this._playerName = new VerticalText(options.player.name, {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 20,
        });
        this._playerName.position.set(-1 * options.width * 0.15, options.height * 0.2);

        this._winnerName = new Text(options.player.name, {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 35,
        });
        this._winnerName.position.set(0, 0);

        this._playerTexture = options.player;
        this._playerTexture.scale.set(0.5);
        this._playerTexture.position.set(-1 * options.width * 0.08, options.height * 0.25);

        this._opponentTexture = options.opponent;
        this._opponentTexture.scale.set(0.5);
        this._opponentTexture.position.set(options.width * 0.08, options.height * 0.25);

        this.addChild(
            this._background,
            this._straightWinsLabel,
            this._straightWinsValue,
            this._topTimeLabel,
            this._topTimeValue,
            this._playerName,
            this._winnerName,
            this._playerTexture,
            this._opponentTexture,
        );
    }
}

export default GameResultPaper;
