import Actor from './Actor';

interface Battle {
    winner: Actor | null;

    winnerAttackTime: number;

    signalTime: number;

    isFalseStarted(actor: Actor): boolean;

    isFixed(): boolean;

    attack(actor: Actor, attackTime: number): Promise<[string, Actor]>;
}

export default Battle;
