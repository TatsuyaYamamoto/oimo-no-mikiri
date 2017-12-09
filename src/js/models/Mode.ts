export enum Level {
    BEGINNER = 'beginner',
    NOVICE = 'novice',
    EXPERT = 'expert',
}

export type RoundSize = number;

export type NumberOfPlayer = number;

class Mode {
    private _numberOfPlayer: NumberOfPlayer;
    private _level: Level;
    private _roundSize: RoundSize;

    private constructor(numberOfPlayer: NumberOfPlayer,
                        roundSize: RoundSize,
                        level?: Level) {
        this._numberOfPlayer = numberOfPlayer;
        this._roundSize = roundSize;
        this._level = level;
    }

    static asOnePlayer(level: Level): Mode {
        return new Mode(1, 5, level);
    }

    static asTwoPlayer(): Mode {
        return new Mode(2, 5);
    }

    get level(): Level {
        return this._level;
    }

    get numberOfPlayer(): number {
        return this._numberOfPlayer;
    }

    get roundSize(): RoundSize {
        return this._roundSize;
    }
}

export default Mode;
