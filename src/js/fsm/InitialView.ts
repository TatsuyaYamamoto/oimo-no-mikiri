import {addEvents, dispatchEvent, removeEvents} from '../../framework/EventUtils';
import ViewContainer from "../../framework/ViewContainer";
import Deliverable from "../../framework/Deliverable";
import AssetLoader from "../../framework/AssetLoader";
import {t} from "../../framework/i18n";

import {Events as ApplicationEvents} from "./ApplicationState";

import LoadingAnimationContainer from "../texture/containers/LoadingAnimationContainer";
import Text from "../texture/internal/Text";

import imageManifest from '../resources/image';
import soundManifest from '../resources/sound';
import {Ids as StringIds} from '../resources/string';

import {SKIP_BRAND_LOGO_ANIMATION} from "../Constants";

import {Category, TimingVariable, trackPageView, trackTiming, VirtualPageViews} from "../helper/tracker";
import {isIOS} from "../../framework/utils";
import { resumeContext } from '../../framework/MusicPlayer';

export enum Events {
    COMPLETE_PRELOAD = "InitialViewState@COMPLETE_LOAD",
    COMPLETE_LOGO_ANIMATION = "InitialViewState@COMPLETE_LOGO_ANIMATION",
}

class InitialViewState extends ViewContainer {
    private _loader: AssetLoader;

    private _loadingAnimation: LoadingAnimationContainer;
    private _tapInfoText: Text;

    private _isLoadComplete: boolean;
    private _isLogoAnimationComplete: boolean;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        // Tracking
        trackPageView(VirtualPageViews.INITIAL);

        addEvents({
            [Events.COMPLETE_PRELOAD]: this._handleLoadCompleteEvent,
            [Events.COMPLETE_LOGO_ANIMATION]: this._handleLogoAnimCompleteEvent,
        });

        // TODO: check logged-in.

        this.showUserGestureInfo();
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

    private showUserGestureInfo = () =>{
        this._tapInfoText = new Text(t(StringIds.TAP_DISPLAY_INFO), {
            fontSize: 40,
            stroke: '#ffffff',
            strokeThickness: 2,
        });
        this._tapInfoText.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
        this.addClickWindowEventListener(this.onClickedAsFirstUserGesture);

        this.applicationLayer.addChild(
            this._tapInfoText,
        );
    };

    private onClickedAsFirstUserGesture = () => {
        // For google chrome.
        // @see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
        resumeContext();

        this.removeClickWindowEventListener(this.onClickedAsFirstUserGesture);
        this.applicationLayer.removeChildren();

        this._startPreload();
    };

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

    private _startPreload = () => {
        this._isLoadComplete = false;
        this._isLogoAnimationComplete = SKIP_BRAND_LOGO_ANIMATION ? true : false;

        this._loadingAnimation = new LoadingAnimationContainer(this.viewWidth, this.viewHeight);
        this._loadingAnimation.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

        this.applicationLayer.addChild(
            this._loadingAnimation,
        );

        this._loader = new AssetLoader();
        this._loader.setImageManifest(imageManifest);
        this._loader.setSoundManifest(soundManifest);
        this._loader.onProgress.add(this._onLoadProgress);
        const loadStartTime = Date.now();
        this._loader.load(() => {
            this._trackPreloadPerformance(Date.now() - loadStartTime);
            dispatchEvent(Events.COMPLETE_PRELOAD)
        });

        this._loadingAnimation
            .start()
            .then(() => !SKIP_BRAND_LOGO_ANIMATION && dispatchEvent(Events.COMPLETE_LOGO_ANIMATION));
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

    private _trackPreloadPerformance = (timeMillis: number) => {
        trackTiming(
            Category.PERFORMANCE,
            TimingVariable.LOAD,
            timeMillis,
            "preload_resources");
    }
}

export default InitialViewState;
