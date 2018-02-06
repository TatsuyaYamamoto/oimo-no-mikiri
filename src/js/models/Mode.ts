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

    private constructor(numberOfPlayer: NumberOfPlayer,
                        level?: Level) {
        this._numberOfPlayer = numberOfPlayer;
        this._level = level;
    }

    static asOnePlayer(level: Level): Mode {
        return new Mode(1, level);
    }

    static asTwoPlayer(): Mode {
        return new Mode(2);
    }
    
    get level(): Level {
        return this._level;
    }

    get numberOfPlayer(): number {
        return this._numberOfPlayer;
    }
}

export default Mode;
