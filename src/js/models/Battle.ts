import Actor from './Actor';

export default class Battle {
    private _isSignaled: boolean;
    private _winner: Actor;
    private _winnerAttackTime: number;
    private _falseStartMap: Map<Actor, boolean>;

    constructor() {
        this._winner = null;
        this._isSignaled = false;
        this._falseStartMap = new Map();
        this._falseStartMap.set(Actor.PLAYER, false);
        this._falseStartMap.set(Actor.OPPONENT, false);
    }

    public get winner(): Actor {
        return this._winner;
    }

    public get winnerAttackTime(): number {
        return this._winnerAttackTime;
    }

    public isSignaled(): boolean {
        return this._isSignaled;
    }

    public isFalseStarted(actor: Actor): boolean {
        return this._falseStartMap.get(actor);
    }

    public isFixed(): boolean {
        return !!this._winner;
    }

    public start(): void {
        if (this.isFixed()) {
            console.error('The battle is already fixed.');
            return;
        }

        this._isSignaled = false;
    }

    public signal(): void {
        this._isSignaled = true;
    }

    public attack(actor: Actor, time: number): void {
        if (this.isFixed()) {
            console.error('The battle is already fixed.');
            return;
        }

        this._winner = actor;
        this._winnerAttackTime = time;
        console.info(`Attack! => winner actor: ${actor}, time: ${time}`);
    }

    public falseStart(actor: Actor): void {
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
