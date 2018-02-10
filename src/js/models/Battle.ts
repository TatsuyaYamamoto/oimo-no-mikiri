import Actor from './Actor';

interface Battle {
    winner: Actor | null;

    winnerAttackTime: number;

    signalTime: number;

    isFalseStarted(actor: Actor): boolean;

    isFixed(): boolean;

    win(actor: Actor, time: number): void;

    falseStart(actor: Actor): void;

    draw(): void;
}

export default Battle;
