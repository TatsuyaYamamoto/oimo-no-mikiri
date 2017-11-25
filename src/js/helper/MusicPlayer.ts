/**
 * @fileOverview convenient methods to play {@link Sound}s.
 * Sound resources provided from {@link loadSound} is one instance only.
 * Because of that, load a sound from cache of loader each time before invoking them.
 */
import PixiSound from 'pixi-sound/lib';
import Sound from "pixi-sound/lib/Sound";

import {loadSound} from "../../framework/AssetLoader";

export function play(soundId: string, volume?: number) {
    const sound = loadSound(soundId);
    const v = sound.volume;
    const completed = () => {
        sound.volume = v;
    };

    if (volume) {
        sound.volume = volume;
    }

    sound.play(completed);
}

export function playOnLoop(soundId: string, volume?: number) {
    const sound = loadSound(soundId);
    const v = sound.volume;
    const completed = () => {
        sound.volume = v;
    };

    if (volume) {
        sound.volume = volume;
    }

    sound.play({loop: true}, completed);
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

export function isMute():boolean{
    return PixiSound.context.muted;
}
