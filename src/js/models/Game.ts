import Battle from "./Battle";
import Actor from './Actor';
import Mode from "./Mode";

interface Game {
    mode: Mode;

    roundSize: number;

    currentRound: number;

    currentBattle: Battle;

    battleLeft: number;

    winner: Actor;

    bestTime: number;

    straightWins: number;

    npcAttackIntervalMillis: number;

    getWins(actor: Actor): number;

    start(): void;

    next(): void;

    isFixed(): boolean;
}

export function isSingleMode(mode: Mode) {
    return [
        Mode.SINGLE_BEGINNER,
        Mode.SINGLE_NOVICE,
        Mode.SINGLE_EXPERT
    ].some((singleMode) => mode === singleMode);
}

export function isMultiMode(mode: Mode) {
    return [
        Mode.MULTI_LOCAL,
        Mode.MULTI_ONLINE,
    ].some((multiMode) => mode === multiMode);
}

export function isOnlineMode(mode: Mode) {
    return [
        Mode.MULTI_ONLINE,
    ].some((multiMode) => mode === multiMode);
}

export default Game;
