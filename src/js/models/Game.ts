import Battle from "./local/LocalBattle";
import Actor from './Actor';
import Mode from "./Mode";

interface Game {
    mode: Mode;
    roundSize: number;
    currentRound: number;
    currentBattle: Battle;

    constructor(mode: Mode, roundSize?: number);

    isSingleMode(): boolean;

    isMultiMode(): boolean;

    getWins(actor: Actor): number;

    getWinner(): Actor;

    getBestTime(): number;

    getStraightWins(): number;

    start(): void;

    next(): void;

    isFixed(): boolean;
}

export default Game;
