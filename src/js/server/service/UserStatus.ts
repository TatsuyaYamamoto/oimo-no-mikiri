enum UserStatus {
    /**
     * Wait member join room.
     */
    WAITING_ROOM_READY = "waiting_room_ready",

    /**
     * Room is ready.
     *
     */
    ROOM_READY = "room_ready",

    /**
     * Wait member request game start.
     */
    WAITING_GAME_READY = "waiting_game_ready",

    /**
     * Game is ready.
     * All member's request, game start, is accepted.
     *
     */
    GAME_READY = "game_ready",

    /**
     * Battle is ready.
     * After this status, members can get signal time.
     */
    BATTLE_READY = "battle_ready",

    WIN = "win",

    LOSE = "lose",

    FALSE_START = "false_start",

    DRAW = "draw",

    BATTLE_RESULT_FIX = "battle_result_fix",

    GAME_RESULT_FIX = "battle_result_fix",

    OPPONENT_DISCONNECTED = "opponent_disconnected"
}

export default UserStatus;
