import StateMachine from "../../../framework/StateMachine";
import ViewContainer from "../../../framework/ViewContainer";
import { addEvents, dispatchEvent } from "../../../framework/EventUtils";

import GameView, { EnterParams, Events, InnerStates } from "./GameView";

import ReadyState from "./internal/ReadyState";
import ResultState from "./internal/ResultState";
import OnlineActionState from "./internal/ActionState/OnlineActionState";
import OnlineOverState from "./internal/OverState/OnlineOverState";

export { EnterParams } from "./GameView";

class OnlineGameView extends GameView {
    private _gameStateMachine: StateMachine<ViewContainer>;

    /**
     *
     * @return {StateMachine<ViewContainer>}
     * @override
     */
    protected get gameStateMachine(): StateMachine<ViewContainer> {
        return this._gameStateMachine;
    }

    onEnter(params: EnterParams): void {
        super.onEnter(params);


        this._gameStateMachine = new StateMachine({
            [InnerStates.READY]: new ReadyState(this),
            [InnerStates.ACTION]: new OnlineActionState(this),
            [InnerStates.RESULT]: new ResultState(this),
            [InnerStates.OVER]: new OnlineOverState(this)
        });

        dispatchEvent(Events.REQUEST_READY);

        this.game.start();
    }

}

export default OnlineGameView;
