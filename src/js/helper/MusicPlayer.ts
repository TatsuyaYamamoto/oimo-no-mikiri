/**
 * @fileOverview convenient methods to play {@link Sound}s.
 * Sound resources provided from {@link loadSound} is one instance only.
 * Because of that, load a sound from cache of loader each time before invoking them.
 */
import PixiSound from 'pixi-sound/lib';
import Sound from "pixi-sound/lib/Sound";

import {loadSound} from "../../framework/AssetLoader";

export function play(soundId: string) {
    loadSound(soundId).play();
}

export function playOnLoop(soundId: string) {
    loadSound(soundId).play({loop: true});
}

export function stop(soundId: string) {
    loadSound(soundId).stop();
}

/**
 * Toggle muted property for all sounds.
 *
 * @return {boolean} if all sounds are muted.
 */
export function toggleMute(): boolean {
    if (PixiSound.context.muted) {
        PixiSound.unmuteAll();
    } else {
        PixiSound.muteAll();
    }

    return PixiSound.context.muted;
}
