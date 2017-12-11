import * as Mousetrap from 'mousetrap';

import Deliverable from "../../../../../framework/Deliverable";

import ActionState from "./ActionState";

import Actor from "../../../../models/Actor";


export interface EnterParams extends Deliverable {
    autoOpponentAttackInterval?: number,
    isFalseStarted?: { player?: boolean, opponent?: boolean }
}

class MultiPlayActionState extends ActionState {

    /**
     * @override
     */
    update(elapsedMS: number): void {
        super.update(elapsedMS);

        this.shouldSign() && this.onSignaled();
    }

    /**
     *
     * @param {EnterParams} params
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);

        this.backGroundLayer.addChild(
            this.background,
        );
        this.applicationLayer.addChild(
            this.oimo,
            this.player,
            this.opponent,
            this.playerFalseStartCheck,
            this.opponentFalseStartCheck,
            this.signalSprite
        );

        Mousetrap.bind('a', () => {
            this.onAttacked(Actor.PLAYER);
        });
        Mousetrap.bind('l', () => {
            this.onAttacked(Actor.OPPONENT);
        });
    }

    /**
     * @override
     */
    bindKeyboardEvents() {
        Mousetrap.bind('a', () => {
            this.onAttacked(Actor.PLAYER);
        });
        Mousetrap.bind('l', () => {
            this.onAttacked(Actor.OPPONENT);
        });
    }

    /**
     * @override
     */
    unbindKeyboardEvents() {
        Mousetrap.unbind('a');
        Mousetrap.unbind('l');
    }

    /**
     *
     * @param e
     * @override
     */
    onWindowTaped(e: MouseEvent): void {
        console.log(this);

        if (e.clientX < this.viewWidth / 2) {
            this.onAttacked(Actor.PLAYER);
        } else {
            this.onAttacked(Actor.OPPONENT);
        }
    }
}

export default MultiPlayActionState;
