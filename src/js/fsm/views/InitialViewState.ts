import {dispatchEvent} from '../../../framework/EventUtils';
import ViewContainer from "../../../framework/ViewContainer";

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
    onEnter(): void {
        super.onEnter();

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
