import Game, {
    isMultiMode,
    isOnlineMode,
    isSingleMode
} from "../Game";
import Battle from "./LocalBattle";
import Actor from '../Actor';
import Mode from "../Mode";

import { GAME_PARAMETERS, DEFAULT_ROUND_SIZE } from "../../Constants";


class LocalGame implements Game {
    private _mode: Mode;
    private _roundSize: number;
    private _currentRound: number;
    private _battles: Map<number, Battle>;

    constructor(mode: Mode, roundSize?: number) {
        this._mode = mode;
        this._roundSize = roundSize || DEFAULT_ROUND_SIZE;
    }

    public get mode() {
        return this._mode;
    }

    public get roundSize(): number {
        return this._roundSize;
    }

    public get currentRound(): number {
        return this._currentRound;
    }

    public get currentBattle(): Battle {
        return this._battles.get(this._currentRound);
    }

    /**
     * Get NPC attack time in according to the current mode and round.
     *
     * @return {number}
     */
    public get npcAttackIntervalMillis(): number {
        if (!isSingleMode(this.mode)) {
            console.error("The game is not one player mode, then an opponent won't attack automatically.");
            return;
        }

        const {
            reaction_rate,
            reaction_rate_tuning
        } = GAME_PARAMETERS;

        const {
            mode,
            currentRound
        } = this;

        return reaction_rate[mode][currentRound] * reaction_rate_tuning * 1000;
    }

    public getWins(actor: Actor): number {
        let wins = 0;

        this._battles.forEach((b) => {
            if (b.winner === actor) {
                wins++;
            }
        });

        return wins;
    }

    public get winner(): Actor {
        let playerWins = this.getWins(Actor.PLAYER);
        let opponentWins = this.getWins(Actor.OPPONENT);

        return playerWins > opponentWins ?
            Actor.PLAYER :
            Actor.OPPONENT;
    }

    public get bestTime(): number {
        let time = 99999;

        this._battles.forEach((b) => {
            if (isSingleMode(this.mode)) {
                if (b.winnerAttackTime < time && b.winner === Actor.PLAYER) {
                    time = b.winnerAttackTime;
                }
            } else {
                if (b.winnerAttackTime < time) {
                    time = b.winnerAttackTime;
                }
            }

        });
        return Math.round(time);
    }

    public get straightWins(): number {
        if (!isSingleMode(this.mode)) {
            console.error('This variable is not supported outside of one player mode.');
            return;
        }

        let wins = 0;
        this._battles.forEach((b) => {
            if (b.winner === Actor.PLAYER) {
                wins++;
            }
        });
        return wins;
    }

    public start(): void {
        this._battles = new Map();
        new Array(this.roundSize).forEach((ignore, round) => {
            this._battles.set(round, new Battle());
        });

        this._currentRound = 1;
        this._battles.set(this._currentRound, new Battle());
    }

    public next(): void {
        if (this.currentRound >= this.roundSize) {
            console.error('Round of the game is already fulfilled.');
            return;
        }
        this._currentRound++;
        this._battles.set(this._currentRound, new Battle());
    }

    public isFixed(): boolean {
        // Is already lost on 1player-mode?
        if (isSingleMode(this.mode)) {
            let isLost = false;

            this._battles.forEach((b) => {
                if (b.winner === Actor.OPPONENT) {
                    isLost = true;
                }
            });

            return isLost;
        }

        // Player or opponent won required time?
        const requiredWins = Math.ceil(this.roundSize / 2);
        return this.getWins(Actor.PLAYER) >= requiredWins
            || this.getWins(Actor.OPPONENT) >= requiredWins;
    }
}

export default LocalGame;