export const lesson6Content = {
  lessonId: 'PART-L6',
  introduction: 'Lesson 6では新しい文法事項を増やさず、Lesson 1〜5の判断方法を入試問題へ使います。文の中心と名詞を分け、分詞の形を理由つきで選びます。',
  strategy: {
    title: '分詞問題の6ステップ',
    steps: [
      { id: 'predicate', label: '① 文の述語動詞を探す' },
      { id: 'modifier', label: '② 修飾部分の範囲を見る' },
      { id: 'target', label: '③ 説明される名詞を探す' },
      { id: 'base', label: '④ 元動詞・語法に戻す' },
      { id: 'relation', label: '⑤ 能動・受動・完了を判断する' },
      { id: 'answer', label: '⑥ 答えを決める' },
    ],
  },
  sections: [
    {
      id: 'PART-L6-EXPLAIN-01',
      title: '実践問題の解き方',
      paragraphs: [
        '空所の近くに分詞があっても、まず文の述語動詞を探します。次に修飾部分の範囲と、説明される名詞を確定します。',
        'その名詞を主語にして元動詞へ戻すと、名詞が動作をするのか、されるのかが見えます。',
        'たとえば The steps described in this recipe seem difficult. では、seem が文の述語動詞です。described in this recipe は steps を後ろから説明する修飾部分であり、述語動詞ではありません。',
        'このように、空所の前後に動詞らしい語が複数あっても、文の中心と名詞修飾を分けます。最初に見つけた動詞をそのまま答えにしないことが出発点です。',
      ],
      examples: [
        { id: 'L6-EX-01', english: 'The steps described in this recipe seem difficult.', translation: 'このレシピで説明されたステップは難しそうだ。', structure: 'predicate: seem / target: The steps', point: 'described in this recipe は steps を説明します。' },
        { id: 'L6-EX-02', english: 'Employees working overseas are entitled to request additional health insurance.', translation: '海外で働いている従業員は追加の健康保険を要求できる。', structure: 'predicate: are / target: Employees', point: 'working overseas は Employees が work する能動の修飾部分です。' },
      ],
      callouts: [
        { kind: 'RULE', text: '述語動詞と名詞を説明する分詞を、同じ動詞として読まない。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: '分詞を含む文の中心動詞と修飾部分' },
      ],
    },
    {
      id: 'PART-L6-EXPLAIN-02',
      title: '-ing / p.p. を判断する',
      paragraphs: [
        '元動詞へ戻したら、名詞との関係を確認します。名詞がするなら -ing、されるなら p.p. です。自動詞の p.p. は完了や結果状態になることもあります。',
        '位置や日本語訳だけで決めず、名詞と動詞の関係を一文にしてから形を選びます。',
        'A drowning man なら man が drown する側なので drowning、anything planned なら anything が plan される側なので planned です。形を時制ではなく、意味上の関係から決めます。',
        '「人なら-ed、物なら-ing」のような近道も使いません。同じ人を表す名詞でも、感情を与える側なら -ing、受ける側なら -ed になるためです。',
      ],
      examples: [
        { id: 'L6-EX-03', english: 'A drowning man will grasp at a straw.', translation: '溺れる者はわらをもつかもうとする。', structure: 'man → drown → active → drowning', point: 'man が drown する途中なので drowning です。' },
        { id: 'L6-EX-04', english: 'Do you have anything planned for next weekend?', translation: '来週末に何か予定はありますか。', structure: 'anything → plan → passive → planned', point: 'anything が plan されるので planned です。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: '名詞と元動詞の能動・受動・完了関係' },
      ],
    },
    {
      id: 'PART-L6-EXPLAIN-03',
      title: '述語動詞と修飾部分を分ける',
      paragraphs: [
        '長い英文では、分詞を含む修飾部分の外側にある述語動詞を見落としやすくなります。述語動詞、修飾部分、対象名詞を分けて読みます。',
        '最後に、何が何をする・されるからその形になるのかを短く言えれば、初見問題にも同じ手順を使えます。',
        'The scientist known to be ... won ... では、won が文の中心です。known to be ... は scientist を説明し、scientist is known という受動の関係から known を選びます。',
        'consisting of five letters のように前置詞を含むまとまりも、途中で切らずに一つの修飾部分として読みます。最後まで構造を確認してから、答えと根拠を一文で言い直します。',
      ],
      examples: [
        { id: 'L6-EX-05', english: 'The scientist known to be the smartest person in our town won the Nobel Prize last year.', translation: '町で最も賢い人だと知られている科学者が昨年ノーベル賞を受賞した。', structure: 'predicate: won / answer: known', point: 'known to be ... は scientist を説明します。' },
        { id: 'L6-EX-06', english: 'Recently, a quiz to guess English words consisting of five letters has become popular online.', translation: '最近、5文字で構成された英単語を当てるクイズがオンラインで人気になっている。', structure: 'predicate: has / answer: consisting of', point: 'consisting of five letters は English words を説明します。' },
        { id: 'L6-EX-07', english: 'The loss of income resulting from the COVID-19 pandemic increased food insecurity.', translation: 'COVID-19パンデミックに起因する所得の減少が食糧不安を高めた。', structure: 'predicate: increased / answer: resulting', point: 'resulting from ... は loss of income を説明します。' },
      ],
      callouts: [
        { kind: 'POINT', text: '資料の問題では、sourceが示す述語動詞の見方を保ち、答えの形だけでなく分析の順序も確認する。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: '述語動詞と分詞修飾を分ける' },
      ],
    },
  ],
  keyRules: [
    '述語動詞、修飾部分、説明される名詞を分けて読む。',
    '元動詞に戻し、名詞がする・される・変化を終えた状態かを確認する。',
    '答えの形と、その理由を一文で言い直す。',
  ],
  commonMistakes: [
    '空所の直前の語だけを見て判断する。',
    '分詞を文の述語動詞として読む。',
    '「人なら-ed」のように一つの条件だけで形を決める。',
  ],
  examPoints: [
    '最初に文の述語動詞を見つけ、修飾部分の外側を確定する。',
    'target noun と base verb の関係から -ing / p.p. を選ぶ。',
    '正答だけでなく、分析の6ステップを短く説明する。',
  ],
  summary: [
    '文の中心と名詞修飾を分ける。',
    '名詞と元動詞の関係から形を選ぶ。',
    '根拠を一文で説明して次の初見問題へ移る。',
  ],
  detailedReview: [
    { title: '実践演習の振り返り', paragraphs: ['各問題で、述語動詞・修飾部分・target noun・base verb・関係・答えを確認します。正答を選べた問題も、理由まで言えれば復習は完了です。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: 'Hidden S-Vを使った能動・受動の判断' },
    { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 170, lineEnd: 180, concept: '自動詞p.p.の完了・結果状態' },
  ],
};
