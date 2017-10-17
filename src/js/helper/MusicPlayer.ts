/**
 * @fileOverview convenient methods to play {@link Sound}s.
 * Sound resources provided from {@link loadSound} is one instance only.
 * Because of that, load a sound from cache of loader each time before invoking them.
 */
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
