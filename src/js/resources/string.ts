export const Ids = {
    ONE_PLAYER: 'string@one_player',
    TWO_PLAYERS: 'string@two_players',
    BEGINNER: 'string@beginner',
    NOVICE: 'string@novice',
    EXPERT: 'string@expert',
};

export default {
    en: {
        translation: {
            [Ids.ONE_PLAYER]: '1P',
            [Ids.TWO_PLAYERS]: '2P',

            [Ids.BEGINNER]: 'Beginner',
            [Ids.NOVICE]: 'Novice',
            [Ids.EXPERT]: 'Expert',
        }
    },
    ja: {
        translation: {
            [Ids.BEGINNER]: '易',
            [Ids.NOVICE]: '中',
            [Ids.EXPERT]: '難',
        }
    }
}
