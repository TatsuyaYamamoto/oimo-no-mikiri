import Actor from './Actor';
import EventEmitter from "./online/EventEmitter";

export enum BattleEvents {
    FIXED = "fixed",
    SUCCEED_ATTACK = "succeed_attack",
    FALSE_STARTED = "false_started",
    DRAW = "draw",
}

abstract class Battle extends EventEmitter {
    protected _winner: Actor;
    protected _winnerAttackTime: number;
    protected _signalTime: number;
    protected _falseStartMap: Map<Actor, boolean>;

    constructor() {
        super();

        this._falseStartMap = new Map();
    }

    get winner(): Actor {
        return this._winner;
    };

    get winnerAttackTime(): number {
        return this._winnerAttackTime;
    };

    get signalTime(): number {
        return this._signalTime;
    };

    public isFalseStarted(actor: Actor): boolean {
        return this._falseStartMap.get(actor);
    }

    abstract isFixed(): boolean;

    abstract attack(actor: string, attackTime: number): void;
}

export default Battle;
