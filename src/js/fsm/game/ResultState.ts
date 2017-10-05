import {filters} from 'pixi.js';

import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";

import AbstractGameState from "./AbstractGameState";
import {Events} from "../views/GameViewState";

import BattleResultLabels, {BattleResultTypes} from "../../texture/containers/BattleResultLabels";

import GameBackground from "../../texture/sprite/background/GameBackground";

export interface EnterParams extends Deliverable {
    resultType: 'playerWin' |
        'opponentWin' |
        'playerWinWithFalseStarted' |
        'opponentWinWithFalseStarted' |
        'draw' |
        'playerFalseStarted' |
        'opponentFalseStarted'
}

class ResultState extends AbstractGameState {
    public static TAG = ResultState.name;

    private _background: GameBackground;

    private _battleResultLabels: BattleResultLabels;

    private _hueFilter: filters.ColorMatrixFilter;
    private _brightnessFilter: filters.ColorMatrixFilter;

    /**
     * @override
     */
    update(elapsedTimeMillis: number): void {
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);
        const resultType = <BattleResultTypes>params.resultType;

        this._background = new GameBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.player.position.set(this.viewWidth * 0.3, this.viewHeight * 0.5);

        this.opponent.position.set(this.viewWidth * 0.7, this.viewHeight * 0.5);

        this._battleResultLabels = new BattleResultLabels(
            this.viewWidth,
            this.viewHeight,
            resultType,
            "WinnerName"); // TODO: get winner name according to result.
        this._battleResultLabels.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this._battleResultLabels.show(true);

        this._hueFilter = new filters.ColorMatrixFilter();
        this._brightnessFilter = new filters.ColorMatrixFilter();
        this._background.filters = [this._hueFilter, this._brightnessFilter];

        this.backGroundLayer.addChild(
            this._background,
        );

        this.applicationLayer.addChild(
            this.player,
            this.opponent,
            this._battleResultLabels,
        );

        if (resultType === BattleResultTypes.PLAYER_FALSE_STARTED || resultType === BattleResultTypes.OPPONENT_FALSE_STARTED) {
            this._hueFilter.hue(180);
            this._brightnessFilter.brightness(0.5);
        }

        // TODO: fire after completing animation.
        window.setTimeout(function () {
            dispatchEvent(Events.REQUEST_READY);
        }, 3000);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default ResultState;
