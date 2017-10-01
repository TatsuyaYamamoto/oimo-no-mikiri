import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import {dispatchEvent} from "../../../framework/EventUtils";
import {Events} from "../views/GameViewState";

class GameOverState extends ViewContainer {
    public static TAG = GameOverState.name;

    /**
     * @override
     */
    update(elapsedTimeMillis: number): void {
    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
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
