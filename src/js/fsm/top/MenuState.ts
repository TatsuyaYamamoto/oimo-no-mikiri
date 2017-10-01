import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";

class MenuState extends ViewContainer {
    public static TAG = MenuState.name;

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

export default MenuState;
