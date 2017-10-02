import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";
import {Events} from "../views/GameViewState";

export interface EnterParams extends Deliverable {
    bestTime: number,
    round: number,
}

class GameOverState extends ViewContainer {
    public static TAG = GameOverState.name;

    /**
     * @override
     */
    update(elapsedMS: number): void {
    }

    /**
     * @override
     */
    onEnter(params: EnterParams): void {
        super.onEnter(params);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default GameOverState;
