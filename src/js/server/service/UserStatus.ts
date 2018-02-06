enum UserStatus {
    /**
     * 1. Wait to start game.
     */
    WAITING_GAME_READY = "waiting_game_ready",

    /**
     * 2. Player and opponent are ready.
     *
     */
    GAME_READY = "on_game_ready",

    ATTACK_SUCCESS = "attack_success",
    FALSE_START = "false_start",
    DRAW = "draw",
    GAME_RESULT_FIXED = "game_result_fixed",

    OPPONENT_DISCONNECTED = "opponent_disconnected"
}

export default UserStatus;
