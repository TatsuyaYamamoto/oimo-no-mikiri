import Battle from "./Battle";
import Actor from './Actor';

import {GAME_PARAMETERS} from "../Constants";

class Game {
    private _mode: 'beginner' | 'novice' | 'expert' | 'two-players';
    private _roundSize: number;

    private _currentRound: number;
    private _battles: Map<number, Battle>;

    constructor(mode, roundSize: number) {
        this._mode = mode;
        this._roundSize = roundSize;
    }

    public static asOnePlayer(mode: 'beginner' | 'novice' | 'expert'): Game {
        return new Game(mode, 5);
    }

    public get isOnePlayerMode(): boolean {
        return this._mode !== 'two-players';
    }

    public get isTwoPlayerMode(): boolean {
        return this._mode === 'two-players';
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

    public get npcAttackIntervalMillis(): number {
        if (!this.isOnePlayerMode) {
            console.error("The game is not one player mode, then an opponent won't attack automatically.");
            return;
        }

        const {
            reaction_rate,
            reaction_rate_tuning
        } = GAME_PARAMETERS;

        return reaction_rate[this.mode][this.currentRound] * reaction_rate_tuning * 1000;
    }

    public get winner(): Actor {
        let wins = 0;
        let lose = 0;

        this._battles.forEach((b) => {
            b.winner === Actor.PLAYER ? wins++ : lose++;
        });

        if (this.isOnePlayerMode) {
            return wins >= 5 ? Actor.PLAYER : Actor.OPPONENT;
        } else {
            return wins > lose ? Actor.PLAYER : Actor.OPPONENT;
        }
    }

    public get bestTime(): number {
        let time = 99999;

        this._battles.forEach((b) => {
            if (this.isOnePlayerMode) {
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
        if (!this.isOnePlayerMode) {
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
        new Array(this._roundSize).forEach((ignore, round) => {
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
        if (this.isOnePlayerMode) {
            let isLost = false;

            this._battles.forEach((b) => {
                if (b.winner === Actor.OPPONENT) {
                    isLost = true;
                }
            });

            if (isLost) {
                return true;
            }
        }

        // Is last round battle fixed?
        const lastBattle = this._battles.get(this._roundSize);
        if (lastBattle && lastBattle.isFixed()) {
            return true;
        }

        return false;
    }
}

export default Game;
