export enum Ids {
    TAP_DISPLAY_INFO,
    HOW_TO_PLAY_INFORMATION,

    ONE_PLAYER,
    TWO_PLAYERS,
    BEGINNER,
    NOVICE,
    EXPERT,

    LABEL_WINNER,
    LABEL_FALSE_START,
    LABEL_DRAW,
    LABEL_STRAIGHT_WINS,
    LABEL_TOP_TIME,
    LABEL_WINS,
    LABEL_BATTLE_LEFT,

    CHARA_NAME_HANAMARU,
    CHARA_NAME_RUBY,

    CHARA_NAME_SHITAKE,
    CHARA_NAME_LITTLE_DAEMON,
    CHARA_NAME_UCHICCHI,
    CHARA_NAME_WATAAME,
    CHARA_NAME_ENEMY_RUBY,

    CREDIT_T28,
    CREDIT_SANZASHI,
    CREDIT_ON_JIN,
    CREDIT_LOVELIVE,
    CREDIT_KIRBY,

    GAME_RESULT_TWEET1,
    GAME_RESULT_TWEET2,
    GAME_RESULT_TWEET_COMPLETE,
    GAME_RESULT_TWEET_ZERO_POINT,
    MULTI_GAME_RESULT_TWEET_HANAMARU_WIN,
    MULTI_GAME_RESULT_TWEET_RUBY_WIN,
export default {
    en: {
        translation: {
            [Ids.TAP_DISPLAY_INFO]: "- Please tap on the display! -",
            [Ids.HOW_TO_PLAY_INFORMATION]: `An oimo, sweet potato, has baked, zura!.
...No! Someone is coming close to take it!

It’s not going to work that way, zura!
Tap display or click "A" key immediately when you see "!".

In multi play mode,
1Player taps left half of display or clicks "A" key and 2Player taps right half or clicks "L" key! `,

            [Ids.ONE_PLAYER]: '1P',
            [Ids.TWO_PLAYERS]: '2P',

            [Ids.BEGINNER]: 'Beginner',
            [Ids.NOVICE]: 'Novice',
            [Ids.EXPERT]: 'Expert',

            [Ids.LABEL_WINNER]: 'Winner',
            [Ids.LABEL_FALSE_START]: 'False start',
            [Ids.LABEL_DRAW]: 'Tie',
            [Ids.LABEL_STRAIGHT_WINS]: 'straight wins',
            [Ids.LABEL_TOP_TIME]: 'Top time',
            [Ids.LABEL_WINS]: 'Wins',
            [Ids.LABEL_BATTLE_LEFT]: 'Left',

            [Ids.CHARA_NAME_HANAMARU]: 'Hanamaru',
            [Ids.CHARA_NAME_RUBY]: 'Ruby',

            [Ids.CHARA_NAME_SHITAKE]: 'Shitake',
            [Ids.CHARA_NAME_LITTLE_DAEMON]: 'Little deamond',
            [Ids.CHARA_NAME_UCHICCHI]: 'Uchicchi',
            [Ids.CHARA_NAME_WATAAME]: 'Wataame',
            [Ids.CHARA_NAME_ENEMY_RUBY]: 'Ruby',

            [Ids.CREDIT_T28]: 'Planning, Program, Music: T28',
            [Ids.CREDIT_SANZASHI]: 'Illustration: Sanzashi',
            [Ids.CREDIT_ON_JIN]: 'Sound effect: On-Jin ～音人～',
            [Ids.CREDIT_LOVELIVE]: 'PROJECT Lovelive!',
            [Ids.CREDIT_KIRBY]: 'Memory: Kirby Super Star',

            [Ids.GAME_RESULT_TWEET1]: `はなまる「おいも焼けたず、、、まるのおいもが！」ベストタイム {{bestTime}}、{{wins}}人抜き！`,
            [Ids.GAME_RESULT_TWEET2]: `???「はなまるちゃんのおいも、おいしいね。    うゆ。」 ベストタイム {{bestTime}}、{{wins}}人抜き！`,
            [Ids.GAME_RESULT_TWEET_COMPLETE]: `はなまる「素敵な人生(おいも)ずら〜」ベストタイム {{bestTime}}、{{wins}}人抜き！`,
            [Ids.GAME_RESULT_TWEET_ZERO_POINT]: `はなまる「もういいずら、ぴよこ万十食べるずら」{{wins}}人抜き、、、、`,
            [Ids.MULTI_GAME_RESULT_TWEET_HANAMARU_WIN]: `はなまる「{{winnerWins}}対{{loserWins}}で、まるの勝ちずら！」`,
            [Ids.MULTI_GAME_RESULT_TWEET_RUBY_WIN]: `るびぃ「{{winnerWins}}対{{loserWins}}で、ルビィの勝ち！」`,
        }
    },
    ja: {
        translation: {
            [Ids.HOW_TO_PLAY_INFORMATION]: `おいもやけたずら〜！
...大変！まるのお芋を狙ってる子達が次々とやってくるずら！

そうはいかないずら！
"!"マークが現れたら、すかさず画面をタップ、または"A"キーを押そう！

2人で遊ぶときは、
1Pが画面左半分または"A"キー、2Pが画面右半分または"L"キーだ！`,

            [Ids.BEGINNER]: '易',
            [Ids.NOVICE]: '中',
            [Ids.EXPERT]: '難',

            [Ids.LABEL_WINNER]: '勝者',
            [Ids.LABEL_FALSE_START]: '仕切り直し',
            [Ids.LABEL_DRAW]: '仕切り直し',
            [Ids.LABEL_STRAIGHT_WINS]: '人ぬき',
            [Ids.LABEL_TOP_TIME]: '最速タイム',
            [Ids.LABEL_WINS]: '勝',
            [Ids.LABEL_BATTLE_LEFT]: '残',

            [Ids.CHARA_NAME_HANAMARU]: 'はなまる',
            [Ids.CHARA_NAME_RUBY]: 'るびぃ',

            [Ids.CHARA_NAME_SHITAKE]: 'しいたけ',
            [Ids.CHARA_NAME_LITTLE_DAEMON]: 'リトルデーモン',
            [Ids.CHARA_NAME_UCHICCHI]: 'うちっちー',
            [Ids.CHARA_NAME_WATAAME]: 'わたあめ',
            [Ids.CHARA_NAME_ENEMY_RUBY]: 'るびぃ',

            [Ids.CREDIT_T28]: '思いつき, プラグラム, 音楽: T28',
            [Ids.CREDIT_SANZASHI]: 'イラスト: さんざし',
            [Ids.CREDIT_ON_JIN]: '効果音: On-Jin ～音人～',
            [Ids.CREDIT_LOVELIVE]: 'プロジェクト ラブライブ！',
            [Ids.CREDIT_KIRBY]: '思い出: 星のカービィ',
        }
    }
}
