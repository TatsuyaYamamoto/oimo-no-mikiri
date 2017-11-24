import {Container, interaction} from 'pixi.js';

import {loadTexture} from "../../../framework/AssetLoader";
import {isSupportTouchEvent} from "../../../framework/utils";

import Sprite from "../internal/Sprite";
import GameStartButton from "../sprite/button/GameStartButton";
import HowToPlayButton from "../sprite/button/HowToPlayButton";
import CreditButton from "../sprite/button/CreditButton";
import SelectCharacterButton from "../sprite/button/SelectCharacterButton";
import HomeButton from "../sprite/button/HomeButton";

import {Ids} from "../../resources/image";
import SoundButton from "../sprite/button/SoundButton";

/**
 * @class
 */
class MenuBoardBackGround extends Sprite {
    constructor() {
        super(loadTexture(Ids.MENU_BOARD));
    }
}

/**
 * @class
 */
class MenuBoard extends Container {
    private _backGround: MenuBoardBackGround;

    private _homeButton: HomeButton;
    private _soundButton: SoundButton;
    private _gameStartButton: GameStartButton;
    private _howToPlayButton: HowToPlayButton;
    private _creditButton: CreditButton;
    private _selectCharacterButton: SelectCharacterButton;

    constructor(width: number, height: number) {
        super();

        this._backGround = new MenuBoardBackGround();
        this._backGround.position.set(0);

        this._homeButton = new HomeButton();
        this._homeButton.position.set(width * 0.35, -1 * height * 0.33);

        this._soundButton = new SoundButton();
        this._soundButton.position.set(width * 0.55, -1 * height * 0.33);

        this._gameStartButton = new GameStartButton();
        this._gameStartButton.position.set(-1 * width * 0.35, height * 0.05);

        this._howToPlayButton = new HowToPlayButton();
        this._howToPlayButton.position.set(-1 * width * 0.05, height * 0.05);

        this._creditButton = new CreditButton();
        this._creditButton.position.set(width * 0.25, height * 0.05);

        this._selectCharacterButton = new SelectCharacterButton();
        this._selectCharacterButton.position.set(width * 0.57, height * 0.2);

        this.addChild(
            this._backGround,
            this._gameStartButton,
            this._howToPlayButton,
            this._creditButton,
            this._selectCharacterButton,
            this._homeButton,
            this._soundButton,
        );
    }

    public setOnSelectHomeListener(fn: (event: interaction.InteractionEvent) => void) {
        this._homeButton.interactive = true;
        this._homeButton.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }

    public setOnSelectSoundListener(fn: (event: interaction.InteractionEvent) => void) {
        this._soundButton.interactive = true;
        this._soundButton.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }

    public setOnSelectGameStartListener(fn: (event: interaction.InteractionEvent) => void) {
        this._gameStartButton.interactive = true;
        this._gameStartButton.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }

    public setOnSelectHowToPlayListener(fn: (event: interaction.InteractionEvent) => void) {
        this._howToPlayButton.interactive = true;
        this._howToPlayButton.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }

    public setOnSelectCreditListener(fn: (event: interaction.InteractionEvent) => void) {
        this._creditButton.interactive = true;
        this._creditButton.on(isSupportTouchEvent() ? 'touchstart' : 'click', fn);
    }
}

export default MenuBoard;
