import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";

class TitleState extends ViewContainer {
    public static TAG = TitleState.name;

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

export default TitleState;
