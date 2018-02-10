import Actor from '../Actor';
import Battle from '../Battle';

class LocalBattle implements Battle {
    private _winner: Actor;
    private _winnerAttackTime: number;
    private _falseStartMap: Map<Actor, boolean>;

    constructor() {
        this._winner = null;
        this._falseStartMap = new Map();
        this._falseStartMap.set(Actor.PLAYER, false);
        this._falseStartMap.set(Actor.OPPONENT, false);
    }

    public get winner(): Actor | null {
        return this._winner;
    }

    public get winnerAttackTime(): number {
        if (!this.isFixed()) console.error("The battle is not fixed.");

        return this._winnerAttackTime;
    }

    public get signalTime(): number {
        // TODO implements
        return 0;
    }

    public isFalseStarted(actor: Actor): boolean {
        return this._falseStartMap.get(actor);
    }

    public isFixed(): boolean {
        return !!this._winner;
    }

    public win(actor: Actor, time: number): void {
        if (this.isFixed()) {
            console.error('The battle is already fixed.');
            return;
        }

        this._winner = actor;
        this._winnerAttackTime = time;
    }

    public falseStart(actor: Actor): void {
        if (this.isFixed()) {
            console.error('The battle is already fixed.');
            return;
        }

        if (this._falseStartMap.get(actor)) {
            this._winner = actor === Actor.PLAYER ? Actor.OPPONENT : Actor.PLAYER;
            return;
        }

        this._falseStartMap.set(actor, true);
    }

    public draw(): void {
        // do nothing.
    }
}

export default LocalBattle;
