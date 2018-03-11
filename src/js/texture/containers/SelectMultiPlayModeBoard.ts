import { Container, interaction } from 'pixi.js';

import { loadTexture } from "../../../framework/AssetLoader";
import { isSupportTouchEvent } from "../../../framework/utils";

import Sprite from "../internal/Sprite";

import BeginnerLevelButton from "../sprite/button/BeginnerLevelButton";
import NoviceLevelButton from "../sprite/button/NoviceLevelButton";
import ExpertLevelButton from "../sprite/button/ExpertLevelButton";

import { Ids } from "../../resources/image";
import Mode from "../../models/Mode";
import Button from "../internal/Button";

export type ClickEventType = "offline" | "online";

/**
 * @class
 */
class MenuBoardBackGround extends Sprite {
    constructor() {
        super(loadTexture(Ids.MENU_BOARD));
    }
}

class SelectMultiPlayModeBoard extends Container {
    private background: MenuBoardBackGround;
    private offlineButton: BeginnerLevelButton;
    private onlineButton: ExpertLevelButton;

    constructor(width: number, height: number) {
        super();

        this.background = new MenuBoardBackGround();
        this.background.position.set(0);

        this.offlineButton = new Button(loadTexture(Ids.BUTTON_MENU_OFFLINE_GAME));
        this.offlineButton.position.set(-1 * width * 0.2, height * 0.05);

        this.onlineButton = new Button(loadTexture(Ids.BUTTON_MENU_ONLINE_GAME));
        this.onlineButton.position.set(width * 0.2, height * 0.05);

        this.addChild(
            this.background,
            this.offlineButton,
            this.onlineButton,
        );
    }

    public onClick(event: ClickEventType, fn: (event: interaction.InteractionEvent, mode: Mode) => void) {
        const type = isSupportTouchEvent() ? 'touchstart' : 'click';

        switch (event) {
            case "online":
                this.onlineButton.interactive = true;
                this.onlineButton.on(type, (event: interaction.InteractionEvent) => fn(event, Mode.MULTI_ONLINE));
                break;

            case "offline":
                this.offlineButton.interactive = true;
                this.offlineButton.on(type, (event: interaction.InteractionEvent) => fn(event, Mode.MULTI_LOCAL));
                break;
        }
    }
}

export default SelectMultiPlayModeBoard;
