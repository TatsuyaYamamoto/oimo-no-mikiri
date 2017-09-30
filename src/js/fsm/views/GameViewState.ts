import ViewContainer from "../../../framework/ViewContainer";
import StateMachine from "../../../framework/StateMachine";
import ReadyState from "../game/ReadyState";

class GameViewState extends ViewContainer {
    public static TAG = GameViewState.name;

    private _gameStateMachine: StateMachine;
    private _readyState: ReadyState;

    /**
     * @override
     */
    update(elapsedTime: number): void {
        this._gameStateMachine.update(elapsedTime);
    }

    /**
     * @override
     */
    onEnter(): void {
        super.onEnter();

        this._readyState = new ReadyState();
        this._gameStateMachine = new StateMachine({
            [ReadyState.TAG]: this._readyState,
        });

        this._gameStateMachine.init(ReadyState.TAG);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default GameViewState;
