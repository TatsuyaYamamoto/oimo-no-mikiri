import {Graphics, Container, Sprite} from 'pixi.js';

import {t} from '../../../framework/i18n';

import Text from "../internal/Text";
import VerticalText from "../sprite/text/VerticalText";
import Player from "../sprite/character/Player";
import Opponent from "../sprite/character/Opponent";

import {Ids as StringIds} from "../../resources/string";
import Texture = PIXI.Texture;

/**
 * Graphics of calligraphy paper.
 * This is background {@link Container} in {@link GameResultPaper}
 * Shape of {@link CalligraphyPaper} is RoundedRect that has width and height provided from constructor's params.
 *
 * @class
 */
class CalligraphyPaper extends Graphics {
    constructor(width: number, height: number) {
        super();

        this.beginFill(0xffffff, 0.95);
        this.drawRoundedRect(-1 * width * 0.5, -1 * height * 0.5, width, height, 3);
        this.endFill();

        const paperWeightWidth = width * 0.8;
        const paperWeightHeight = height * 0.035;
        this.beginFill(0xC0C0C0);
        this.drawRoundedRect(
            -1 * paperWeightWidth * 0.5,
            -1 * height * 0.47,
            paperWeightWidth,
            paperWeightHeight,
            4);
        this.endFill();
    }
}

/**
 * Container that has straight wins' label and value text.
 * It's set center as a container's anchor.
 * Then, you should consider it in implementing that {@link StraightWins#position}.
 *
 * @class
 */
class StraightWins extends Container {
    private _label: Text;
    private _value: Text;

    constructor(width: number, height: number, wins: number) {
        super();

        this._label = new Text(t(StringIds.LABEL_STRAIGHT_WINS), {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 50,
            padding: 5 // prevent to cut off words.
        });
        this._value = new Text(`${wins}`, {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 60,
            padding: 5 // prevent to cut off words.
        });

        // Set position to be set center as anchor.
        const totalWidth = this._label.width + this._value.width;
        this._value.position.x = -1 * totalWidth * 0.5 + this._value.width * 0.5;
        this._label.position.x = totalWidth * 0.5 - this._label.width * 0.5;

        this.addChild(
            this._label,
            this._value,
        );
    }
}

/**
 * Container that has top time' label and value text.
 * It's set right end as a container's anchor.
 * Then, you should consider it in implementing that {@link StraightWins#position}.
 *
 * @class
 */
class TopTime extends Container {
    private _label: Text;
    private _value: Text;

    constructor(width: number, height: number, topTime: number) {
        super();

        this._label = new Text(t(StringIds.LABEL_TOP_TIME), {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 20,
            // textBaseline: 'middle',
            padding: 5 // prevent to cut off words.
        });
        this._value = new Text(`${topTime}`, {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 30,
            padding: 5 // prevent to cut off words.
        });

        // Set position to be set right end as anchor.
        const totalWidth = this._label.width + this._value.width;
        this._label.position.x = -1 * totalWidth + this._label.width * 0.5;
        this._value.position.x = -1 * this._value.width * 0.5;

        this.addChild(
            this._label,
            this._value,
        );
    }
}

/**
 * @class
 */
class PlayerName extends VerticalText {
    constructor(text: string) {
        super(text, {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 20,
        });
    }
}

/**
 * @class
 */
class WinnerName extends Text {
    constructor(text: string) {
        super(text, {
            fontFamily: 'g_brushtappitsu_freeH',
            fontSize: 40,
            fill: '#ff504d',
            stroke: '#ed514e',
            strokeThickness: 2,
            padding: 5 // prevent to cut off words.
        });
    }
}

/**
 * @interface
 */
interface GameResultPaperOptions {
    height: number,
    straightWins: number,
    topTime: number,
    winnerName: string,
    playerTexture: Texture,
    playerName: string,
    opponentTexture: Texture,
    opponentName: string,
}

/**
 * @class
 */
class GameResultPaper extends Container {
    private _calligraphyPaper: CalligraphyPaper;

    private _straightWins: StraightWins;
    private _topTime: TopTime;

    private _playerName: PlayerName;
    private _winnerName: Text;

    private _playerSprite: Sprite;
    private _opponentSprite: Sprite;

    constructor(options: GameResultPaperOptions) {
        super();

        const height = options.height;
        const width = height * (1 / Math.sqrt(2));

        this._calligraphyPaper = new CalligraphyPaper(width, height);

        this._straightWins = new StraightWins(width, height, options.straightWins);
        this._straightWins.position.set(0, -1 * height * 0.3);

        this._topTime = new TopTime(width, height, options.topTime);
        this._topTime.position.set(width * 0.45, -1 * height * 0.15);

        this._playerName = new PlayerName(options.playerName);
        this._playerName.position.set(-1 * width * 0.4, height * 0.2);

        this._winnerName = new WinnerName(options.winnerName);
        this._winnerName.position.set(0, height * 0.05);

        this._playerSprite = this._from(options.playerTexture);
        this._playerSprite.position.set(-1 * width * 0.2, height * 0.3);

        this._opponentSprite = this._from(options.opponentTexture);
        this._opponentSprite.position.set(width * 0.2, height * 0.3);

        this.addChild(
            this._calligraphyPaper,
            this._straightWins,
            this._topTime,
            this._playerName,
            this._winnerName,
            this._playerSprite,
            this._opponentSprite,
        );
    }

    private _from = (texture: Texture): Sprite => {
        const s = new Sprite(texture);
        s.anchor.set(0.5);
        s.scale.set(0.5);
        return s;
    }
}

export default GameResultPaper;
