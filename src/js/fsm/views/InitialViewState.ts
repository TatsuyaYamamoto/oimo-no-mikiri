import {dispatchEvent} from '../../../framework/EventUtils';
import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import AssetLoader, {Asset} from "../../../framework/AssetLoader";

import {Events as ApplicationEvents} from "../ApplicationState";

import imageManifest from '../../resources/image';

export enum Events {
}

class InitialViewState extends ViewContainer {
    public static TAG = InitialViewState.name;

    private _loader: AssetLoader;

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

        this._loader = new AssetLoader();
        this._loader.setImageManifest(imageManifest);
        // this._loader.setSoundManifest(soundManifest);
        // this._loader.onProgress.add(this._onLoadProgress);
        this._loader.load(this._onLoadComplete);
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }

    /**
     *
     * @private
     */
    private _onLoadComplete = (loader: AssetLoader, resources: { string: Asset }): void => {
        console.log(`Complete to load [${Object.keys(resources).length}] resources.`);

        dispatchEvent(ApplicationEvents.INITIALIZED);
    };
}

export default InitialViewState;
