import { Container, interaction } from 'pixi.js';

import { loadTexture } from "../../../framework/AssetLoader";
import { isSupportTouchEvent } from "../../../framework/utils";

import Sprite from "../internal/Sprite";

import BeginnerLevelButton from "../sprite/button/BeginnerLevelButton";
import NoviceLevelButton from "../sprite/button/NoviceLevelButton";
import ExpertLevelButton from "../sprite/button/ExpertLevelButton";

import { Ids } from "../../resources/image";
import Mode from "../../models/Mode";

/**
 * @class
 */
class SelectLevelBoardBackGround extends Sprite {
    constructor() {
        super(loadTexture(Ids.SELECT_LEVEL_BOARD));
    }
}

class SelectLevelBoard extends Container {
    private _background: SelectLevelBoardBackGround;
    private _beginnerButton: BeginnerLevelButton;
    private _noviceButton: NoviceLevelButton;
    private _expertButton: ExpertLevelButton;

    constructor(width: number, height: number) {
        super();

        this._background = new SelectLevelBoardBackGround();
        this._background.position.set(0);

        this._beginnerButton = new BeginnerLevelButton();
        this._beginnerButton.position.set(-1 * width * 0.3, 0);

        this._noviceButton = new NoviceLevelButton();
        this._noviceButton.position.set(0, 0);

        this._expertButton = new ExpertLevelButton();
        this._expertButton.position.set(width * 0.3, 0);

        this.addChild(
            this._background,
            this._beginnerButton,
            this._noviceButton,
            this._expertButton,
        );
    }

    /**
     * Register a callback to be invoked when any level is selected.
     *
     * @param {(event: PIXI.interaction.InteractionEvent, level: ("beginner" | "novice" | "expert")) => void} fn
     */
    public setOnSelectLevelListener(fn: (event: interaction.InteractionEvent, level: Mode.SINGLE_BEGINNER | Mode.SINGLE_NOVICE | Mode.SINGLE_EXPERT) => void) {
        const type = isSupportTouchEvent() ? 'touchstart' : 'click';

        this._beginnerButton.interactive = true;
        this._beginnerButton.on(type, (event: interaction.InteractionEvent) => fn(event, Mode.SINGLE_BEGINNER));

        this._noviceButton.interactive = true;
        this._noviceButton.on(type, (event: interaction.InteractionEvent) => fn(event, Mode.SINGLE_NOVICE));

        this._expertButton.interactive = true;
        this._expertButton.on(type, (event: interaction.InteractionEvent) => fn(event, Mode.SINGLE_EXPERT));
    }
}

export default SelectLevelBoard;
