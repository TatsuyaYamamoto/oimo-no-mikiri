export const Ids = {
    HOW_TO_PLAY_INFORMATION: 'HOW_TO_PLAY_INFORMATION',

    ONE_PLAYER: 'string@one_player',
    TWO_PLAYERS: 'string@two_players',
    BEGINNER: 'string@beginner',
    NOVICE: 'string@novice',
    EXPERT: 'string@expert',

    CREDIT_T28: "CREDIT_T28",
    CREDIT_SANZASHI: "CREDIT_SANZASHI",
    CREDIT_ON_JIN: "CREDIT_ON_JIN",
    CREDIT_LOVELIVE: "CREDIT_LOVELIVE"
};

export default {
    en: {
        translation: {
            [Ids.HOW_TO_PLAY_INFORMATION]: `An oimo, sweet potato, has baked, zura!.
...No! Someone is coming close to take them!

It’s not going to work that way, zura!
Tap display or click any key immediately when you see "!".`,

            [Ids.ONE_PLAYER]: '1P',
            [Ids.TWO_PLAYERS]: '2P',

            [Ids.BEGINNER]: 'Beginner',
            [Ids.NOVICE]: 'Novice',
            [Ids.EXPERT]: 'Expert',

            [Ids.CREDIT_T28]: 'Planning, Program, Music: T28',
            [Ids.CREDIT_SANZASHI]: 'Illustration: Sanzashi',
            [Ids.CREDIT_ON_JIN]: 'Sound effect: On-Jin ～音人～',
            [Ids.CREDIT_LOVELIVE]: 'PROJECT Lovelive!'
        }
    },
    ja: {
        translation: {
            [Ids.HOW_TO_PLAY_INFORMATION]: `おいもやけたずら〜！
...大変！まるのお芋を狙ってる子達が次々とやってくるずら！

そうはいかないずら！
"!"マークが現れたら、すかさずタップ、またはキーを押そう！`,

            [Ids.BEGINNER]: '易',
            [Ids.NOVICE]: '中',
            [Ids.EXPERT]: '難',

            [Ids.CREDIT_T28]: '思いつき, プラグラム, 音楽: T28',
            [Ids.CREDIT_SANZASHI]: 'イラスト: さんざし',
            [Ids.CREDIT_ON_JIN]: '効果音: On-Jin ～音人～',
            [Ids.CREDIT_LOVELIVE]: 'プロジェクト ラブライブ！'
        }
    }
}
