import {dispatchEvent} from '../../../framework/EventUtils';
import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";

import {Events as ApplicationEvents} from "../ApplicationState";

export enum Events {
}

class InitialViewState extends ViewContainer {
    public static TAG = InitialViewState.name;

    /**
     * @override
     */
    update(elapsedTime: number): void {

    }

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        // TODO: check logged-in.
        // TODO: check device is iOS.
        // TODO: load resources.

        dispatchEvent(ApplicationEvents.INITIALIZED);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }
}

export default InitialViewState;
