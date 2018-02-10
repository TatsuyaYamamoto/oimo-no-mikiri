import Battle from "./local/LocalBattle";
import Actor from './Actor';
import Mode from "./Mode";

interface Game {
    mode: Mode;

    roundSize: number;

    currentRound: number;

    currentBattle: Battle;

    winner: Actor;

    bestTime: number;

    straightWins: number;

    constructor(mode: Mode, roundSize?: number);

    isSingleMode(): boolean;

    isMultiMode(): boolean;

    getWins(actor: Actor): number;

    start(): void;

    next(): void;

    isFixed(): boolean;
}

export default Game;
