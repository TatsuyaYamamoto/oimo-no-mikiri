import { getRandomInteger } from "../../../framework/utils";

import Actor from '../Actor';
import Battle from '../Battle';

import { GAME_PARAMETERS } from "../../Constants";

class LocalBattle implements Battle {
    private _signalTime: number;
    private _winner: Actor;
    private _winnerAttackTime: number;
    private _falseStartMap: Map<Actor, boolean>;
    private _isJudging: boolean;

    constructor() {
        this._signalTime = this.createSignalTime();
        this._winner = null;
        this._falseStartMap = new Map();
        this._falseStartMap.set(Actor.PLAYER, false);
        this._falseStartMap.set(Actor.OPPONENT, false);
        this._isJudging = false;
    }

    public get winner(): Actor | null {
        return this._winner;
    }

    public get winnerAttackTime(): number {
        if (!this.isFixed()) console.error("The battle is not fixed.");

        return this._winnerAttackTime;
    }

    public get signalTime(): number {
        return this._signalTime;
    }

    public isFalseStarted(actor: Actor): boolean {
        return this._falseStartMap.get(actor);
    }

    public isFixed(): boolean {
        return !!this._winner;
    }

    public attack(actor: Actor, attackTime: number): Promise<[string, Actor]> {
        return new Promise((resolve, reject) => {
            if (this.isFixed()) {
                reject('The battle is already fixed.');
            }


            if (attackTime < 0) {
                if (this._falseStartMap.get(actor)) {
                    const winner = actor === Actor.PLAYER ? Actor.OPPONENT : Actor.PLAYER;
                    this._winner = winner;
                    this.fix(winner);
                    resolve(["falseStart", winner]);
                } else {
                    this._falseStartMap.set(actor, true);

                    // recreate for next battle.
                    this._signalTime = this.createSignalTime();

                    resolve(["falseStart", null]);
                }

            } else {

                if (this._isJudging) {
                    this._isJudging = false;
                    console.log(`Draw! End waiting for judging. Last attacker: ${actor}, time: ${attackTime}`);
                    resolve(["draw", null]);

                    // recreate for next battle.
                    this._signalTime = this.createSignalTime();

                    return;
                }

                this._isJudging = true;
                console.log(`Start waiting for judging. First attacker: ${actor}, time: ${attackTime}`);
                setTimeout(() => {
                    if (this._isJudging) {
                        this._isJudging = false;

                        console.log(`Succeed attack!`);
                        this.fix(actor, attackTime);
                        resolve(["success", actor]);
                    }
                }, GAME_PARAMETERS.acceptable_attack_time_distance)
            }
        });
    }

    protected fix(winner: Actor, winnerTime?: number): void {
        this._winner = winner;
        this._winnerAttackTime = winnerTime;
    }

    protected createSignalTime(): number {
        return getRandomInteger(3000, 5000);
    }
}

export default LocalBattle;
