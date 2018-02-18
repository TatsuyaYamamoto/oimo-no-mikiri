import ActionState, { EnterParams as ActionEnterParams } from "./ActionState";
import * as Mousetrap from "mousetrap";
import BattleStatusBoard from "../../../../texture/containers/label/BattleStatusBoard";
import Actor from "../../../../models/Actor";

export interface EnterParams extends ActionEnterParams {
    battleLeft: number,
    wins: { onePlayer: number, twoPlayer: number }
    isFalseStarted?: { player?: boolean, opponent?: boolean }
}

class OnlineActionState extends ActionState {
    private _battleStatusBoard: BattleStatusBoard;
    private _playerAttachAreaRange: number;

    protected get battleStatusBoard(): BattleStatusBoard {
        return this._battleStatusBoard;
    }

    protected get playerAttachAreaRange(): number {
        return this._playerAttachAreaRange;
    }

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

        this._playerAttachAreaRange = window.innerWidth / 2;

        this._battleStatusBoard = new BattleStatusBoard(this.viewWidth, this.viewHeight);
        this._battleStatusBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.12);
        this._battleStatusBoard.battleLeft = params.battleLeft;
        this._battleStatusBoard.onePlayerWins = params.wins.onePlayer;
        this._battleStatusBoard.twoPlayerWins = params.wins.twoPlayer;

        this.backGroundLayer.addChild(
            this.background,
        );
        this.applicationLayer.addChild(
            this.oimo,
            this.player,
            this.opponent,
            this.playerFalseStartCheck,
            this.opponentFalseStartCheck,
            this.signalSprite,
            this.battleStatusBoard,
        );

        Mousetrap.bind('a', () => {
            this.onAttacked(Actor.PLAYER);
        });
    }

    /**
     * @override
     */
    bindKeyboardEvents() {
        Mousetrap.bind('a', () => {
            this.onAttacked(Actor.PLAYER);
        });
    }

    /**
     * @override
     */
    unbindKeyboardEvents() {
        Mousetrap.unbind('a');
    }

    /**
     *
     * @param e
     * @override
     */
    onWindowTaped(e: MouseEvent | TouchEvent): void {
        this.onAttacked(Actor.PLAYER);
    }
}

export default OnlineActionState;
