import {addEvents, dispatchEvent, removeEvents} from '../../../framework/EventUtils';
import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";
import AssetLoader from "../../../framework/AssetLoader";

import {Events as ApplicationEvents} from "../ApplicationState";

import LoadingAnimationContainer from "../../texture/containers/LoadingAnimationContainer";

import imageManifest from '../../resources/image';
import {SKIP_BRAND_LOGO_ANIMATION} from "../../Constants";

export enum Events {
    COMPLETE_PRELOAD = "InitialViewState@COMPLETE_LOAD",
    COMPLETE_LOGO_ANIMATION = "InitialViewState@COMPLETE_LOGO_ANIMATION",
}

class InitialViewState extends ViewContainer {
    public static TAG = InitialViewState.name;

    private _loader: AssetLoader;

    private _loadingAnimation: LoadingAnimationContainer;

    private _isLoadComplete: boolean;
    private _isLogoAnimationComplete: boolean;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        addEvents({
            [Events.COMPLETE_PRELOAD]: this._handleLoadCompleteEvent,
            [Events.COMPLETE_LOGO_ANIMATION]: this._handleLogoAnimCompleteEvent,
        });

        // TODO: check logged-in.
        // TODO: check device is iOS.

        this._isLoadComplete = false;
        this._isLogoAnimationComplete = SKIP_BRAND_LOGO_ANIMATION ? true : false;

        this._loadingAnimation = new LoadingAnimationContainer(this.viewWidth, this.viewHeight);
        this._loadingAnimation.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.applicationLayer.addChild(
            this._loadingAnimation,
        );

        this._loader = new AssetLoader();
        this._loader.setImageManifest(imageManifest);
        // this._loader.setSoundManifest(soundManifest);
        this._loader.onProgress.add(this._onLoadProgress);
        this._loader.load(() => dispatchEvent(Events.COMPLETE_PRELOAD));

        this._loadingAnimation
            .start()
            .then(() => !SKIP_BRAND_LOGO_ANIMATION && dispatchEvent(Events.COMPLETE_LOGO_ANIMATION));
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();

        removeEvents([
            Events.COMPLETE_PRELOAD,
            Events.COMPLETE_LOGO_ANIMATION,
        ]);
    }

    /**
     *
     * @param {AssetLoader} event
     * @private
     */
    private _onLoadProgress = (event: AssetLoader): void => {
        const percentage = event.progress;
        this._loadingAnimation.progress(percentage);
    };

    /**
     *
     * @private
     */
    private _handleLoadCompleteEvent = () => {
        this._isLoadComplete = true;

        if (this._isLoadComplete && this._isLogoAnimationComplete) {
            dispatchEvent(ApplicationEvents.INITIALIZED);
        }
    };

    /**
     *
     * @private
     */
    private _handleLogoAnimCompleteEvent = () => {
        this._isLogoAnimationComplete = true;

        if (this._isLoadComplete && this._isLogoAnimationComplete) {
            dispatchEvent(ApplicationEvents.INITIALIZED);
        }
    };
}

export default InitialViewState;
