import {filters} from 'pixi.js';

import Deliverable from "../../../../framework/Deliverable";

import AbstractGameState from "../AbstractGameState";

import GameBackground from "../../../texture/sprite/background/GameBackground";
import BattleResultLabel from '../../../texture/containers/BattleResultLabel';

export interface EnterParams extends Deliverable {
    resultType: 'playerWin' |
        'opponentWin' |
        'playerWinWithFalseStarted' |
        'opponentWinWithFalseStarted' |
        'draw' |
        'playerFalseStarted' |
        'opponentFalseStarted'
}

abstract class ResultState extends AbstractGameState {
    protected _background: GameBackground;

    protected _resultLabel: BattleResultLabel;
    protected _playerLabel: BattleResultLabel;
    protected _opponentLabel: BattleResultLabel;

    protected _hueFilter: filters.ColorMatrixFilter;
    protected _brightnessFilter: filters.ColorMatrixFilter;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._background = new GameBackground();
        this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.player.position.set(this.viewWidth * 0.3, this.viewHeight * 0.5);

        this.opponent.position.set(this.viewWidth * 0.7, this.viewHeight * 0.5);

        // TODO: replace string resources.
        this._resultLabel = new BattleResultLabel('勝者');
        this._resultLabel.position.set(this.viewWidth * 0.5, this.viewHeight * 0.3);
        this._resultLabel.visible = false;

        // TODO: replace string resources.
        this._playerLabel = new BattleResultLabel('ぷれいやー');
        this._playerLabel.position.set(this.viewWidth * 0.3, this.viewHeight * 0.3);
        this._playerLabel.visible = false;

        // TODO: replace string resources.
        this._opponentLabel = new BattleResultLabel('こんぴゅーた');
        this._opponentLabel.position.set(this.viewWidth * 0.7, this.viewHeight * 0.3);
        this._opponentLabel.visible = false;

        this._hueFilter = new filters.ColorMatrixFilter();
        this._brightnessFilter = new filters.ColorMatrixFilter();
        this._background.filters = [this._hueFilter, this._brightnessFilter];

        this.backGroundLayer.addChild(
            this._background,
        );

        this.applicationLayer.addChild(
            this.player,
            this.opponent,
            this._resultLabel,
            this._playerLabel,
            this._opponentLabel,
        );
    }
}

export default ResultState;
