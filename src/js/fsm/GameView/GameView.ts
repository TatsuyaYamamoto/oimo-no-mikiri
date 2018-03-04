import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import Deliverable from "../../../framework/Deliverable";

import { EnterParams as ResultStateEnterParams } from "./internal/ResultState";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";

import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Ruby from "../../texture/sprite/character/Ruby";

import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Shitake from "../../texture/sprite/character/Shitake";
import LittleDaemon from "../../texture/sprite/character/LittleDeamon";
import Wataame from "../../texture/sprite/character/Wataame";
import EnemyRuby from "../../texture/sprite/character/EnemyRuby";

import Game, { isSingleMode } from '../../models/Game';
import { BattleEvents } from "../../models/Battle";

import { trackPageView, VirtualPageViews } from "../../helper/tracker";
import { play } from "../../helper/MusicPlayer";

import { Ids as SoundIds } from "../../resources/sound";

export enum Events {
    REQUEST_READY = 'GameView@REQUEST_READY',
    IS_READY = 'GameView@IS_READY',
    ATTACK = 'GameView@ATTACK',
    FIXED_RESULT = 'GameView@FIXED_RESULT',
    RESTART_GAME = 'GameView@RESTART_GAME',
    BACK_TO_TOP = 'GameView@BACK_TO_TOP',
}

export interface EnterParams extends Deliverable {
    game: Game;
}

export enum InnerStates {
    READY = "ready",
    ACTION = "action",
    RESULT = "result",
    OVER = "over",
}

abstract class GameView extends ViewContainer {
    private _game: Game;

    private _player: Player;
    /**
     * 2Player's character for multi play mode.
     */
    private _opponent: Opponent;

    /**
     * Opponents for single play mode.
     */
    private _opponents: { [roundNumber: number]: Opponent };

    public get player(): Player {
        return this._player;
    }

    public get opponent(): Opponent {
        if (isSingleMode(this.game.mode)) {
            return this._opponents[this._game.currentRound];
        } else {
            return this._opponent;
        }
    }

    protected abstract get gameStateMachine(): StateMachine<ViewContainer>;

    public get game(): Game {
        return this._game;
    }


    /**
     * @override
     */
    update(elapsedTime: number): void {
        super.update(elapsedTime);
        this.gameStateMachine.update(elapsedTime);
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        // Tracking
        trackPageView(VirtualPageViews.GAME);

        this._game = params.game;

        this._player = new Hanamaru();

        if (isSingleMode(this.game.mode)) {
            this._opponents = {};
            this._opponents[1] = new Wataame();
            this._opponents[2] = new LittleDaemon();
            this._opponents[3] = new Shitake();
            this._opponents[4] = new Uchicchi();
            this._opponents[5] = new EnemyRuby();
        } else {
            this._opponent = new Ruby();
        }
    }
    protected onAttacked = (e: CustomEvent) => {
        const {attacker, attackTime} = e.detail;

        const offEvents = () => {
            this.game.currentBattle.off(BattleEvents.SUCCEED_ATTACK);
            this.game.currentBattle.off(BattleEvents.FALSE_STARTED);
            this.game.currentBattle.off(BattleEvents.DRAW);
        };

        this.game.currentBattle.on(BattleEvents.SUCCEED_ATTACK, (winner) => {
            offEvents();
            play(SoundIds.SOUND_ATTACK);
            this.to<ResultStateEnterParams>(InnerStates.RESULT, {winner});
        });
        this.game.currentBattle.on(BattleEvents.FALSE_STARTED, (winner) => {
            offEvents();
            play(SoundIds.SOUND_FALSE_START);
            this.to<ResultStateEnterParams>(InnerStates.RESULT, {winner, falseStarter: attacker});
        });
        this.game.currentBattle.on(BattleEvents.DRAW, () => {
            offEvents();
            play(SoundIds.SOUND_DRAW);
            this.to<ResultStateEnterParams>(InnerStates.RESULT);
        });

        this.game.currentBattle.attack(attacker, attackTime);
    };

    /**
     *
     *
     * @param {string} stateTag
     * @param {T} params
     * @private
     */
    protected to = <T>(stateTag: string, params?: T): void => {
        this.gameStateMachine.change(stateTag, params);
        this.applicationLayer.removeChildren();
        this.applicationLayer.addChild(this.gameStateMachine.current);
    }
}

export default GameView;
