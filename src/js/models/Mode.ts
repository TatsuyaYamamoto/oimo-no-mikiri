enum Mode {
    SINGLE_BEGINNER = "single_beginner",
    SINGLE_NOVICE = "single_novice",
    SINGLE_EXPERT = "single_expert",
    MULTI_LOCAL = "multi_local",
    MULTI_ONLINE = "multi_online",
}

export function isSingleMode(mode: Mode) {
    return mode === Mode.SINGLE_BEGINNER ||
        mode === Mode.SINGLE_NOVICE ||
        mode === Mode.SINGLE_EXPERT;
}

export function isMultiMode(mode: Mode) {
    return mode === Mode.MULTI_LOCAL ||
        mode === Mode.MULTI_ONLINE;
}

export default Mode;


