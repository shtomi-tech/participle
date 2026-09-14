export const lesson5Content = {
  lessonId: 'PART-L5',
  introduction: '感情動詞は、日本語の「驚く」「興味を持つ」の感覚だけで覚えると方向を逆にしやすい単元です。まず「〜させる」という元動詞を押さえ、感情を与える側か受ける側かで -ing / -ed を選びます。',
  sections: [
    {
      id: 'PART-L5-EXPLAIN-01',
      title: '感情動詞は「〜させる」',
      paragraphs: [
        'surprise は「驚く」ではなく「驚かせる」です。誰かを驚かせる側と、驚かされる側では立場が反対なので、ここを取り違えると後の分詞の形も逆になります。同じように interest は「興味を持たせる」、excite は「ワクワクさせる」、bore は「退屈させる」と、原因から受け手へ向かう動詞として捉えます。',
        '感情動詞を見たら、まず目的語を置いて短い文を作ります。The movie excited me. では movie が原因、me が感情を受ける人です。英語ではこの向きが文の形に反映されるため、単語の日本語訳を一つ覚えるより、誰が誰に何を起こすかを確認します。',
      ],
      examples: [
        { id: 'L5-EX-01', english: 'surprise = make someone feel surprised', translation: 'surprise = 人を驚かせる', structure: 'someone/something → surprise → someone', point: 'surprise は感情を起こす側の動詞です。' },
        { id: 'L5-EX-02', english: 'The movie excited me.', translation: 'その映画は私をワクワクさせました。', structure: 'the movie → excite → me', point: 'movie が与え手、me が受け手です。' },
      ],
      callouts: [
        { kind: 'POINT', text: '感情動詞は「感情を持つ」ではなく、まず「人をその感情にさせる」と考えます。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '350-382', concept: '感情動詞を「〜させる」と捉える' },
      ],
    },
    {
      id: 'PART-L5-EXPLAIN-02',
      title: '感情を与える側・受ける側',
      paragraphs: [
        '感情を与える側を分詞にすると -ing です。The movie was exciting. は、映画が見た人をワクワクさせる内容だった、という意味です。反対に感情を受ける側を分詞にすると p.p. / -ed です。I was excited. は、私がワクワクさせられ、その感情を感じたという意味になります。',
        'この違いは、物か人かでは決まりません。人でも周囲を退屈させるなら He is boring. と言えますし、人が退屈を感じているなら He is bored. です。判断基準は主語の種類ではなく、感情を与える側か受ける側かです。',
      ],
      examples: [
        { id: 'L5-EX-03', english: 'The movie was exciting.', translation: 'その映画はワクワクするものでした。', structure: 'movie → excite people → exciting', point: 'movie は感情を与える側です。' },
        { id: 'L5-EX-04', english: 'I was excited.', translation: '私はワクワクしました。', structure: 'I receive excitement → excited', point: 'I は感情を受ける側です。' },
        { id: 'L5-EX-05', english: 'He is boring.', translation: '彼は人を退屈させる人です。', structure: 'he → bore others → boring', point: '人でも与える側なら -ing です。' },
        { id: 'L5-EX-06', english: 'He is bored.', translation: '彼は退屈しています。', structure: 'he receives boredom → bored', point: '人でも受ける側なら -ed です。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '388-400', concept: '感情の与え手・受け手と-ing / -ed' },
      ],
    },
    {
      id: 'PART-L5-EXPLAIN-03',
      title: '語彙を広げても同じ判断',
      paragraphs: [
        '感情動詞には amaze、interest、impress、annoy、confuse などもあります。すべてを別々の語尾ルールとして暗記する必要はありません。元動詞が「感情を起こす」向きかを確認し、その原因を説明するなら -ing、感じた人を説明するなら -ed と考えます。',
        'ただし、語によっては形容詞として定着した使い方もあります。入試では、選択肢の人・物だけを見て決めると誤りやすいので、主語が原因か経験者か、文脈が何を言いたいのかを最後まで確認します。',
      ],
      examples: [
        { id: 'L5-EX-07', english: 'The audience was impressed by her performance.', translation: '観客は彼女の演技に感銘を受けました。', structure: 'audience receives impression → impressed', point: '観客は感情を受ける側です。' },
      ],
      callouts: [
        { kind: 'CAUTION', text: '「人なら -ed、物なら -ing」は使えません。与える側・受ける側で判断します。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '388-414', concept: '人・物ではなく感情の方向で判定する' },
      ],
    },
  ],
  keyRules: [
    'surprise / interest / excite などは、まず「〜させる」という方向で捉える。',
    '感情を与える側 → -ing。感情を受ける側 → p.p. / -ed。',
    '人・物ではなく、感情の原因と経験者の関係を見る。',
  ],
  commonMistakes: [
    'surprise を「驚く」とだけ覚える。',
    '人なら -ed、物なら -ing と決める。',
    'exciting / excited を語尾の暗記だけで使い分ける。',
  ],
  examPoints: [
    '主語が感情を起こす側か、受ける側かを確認する。',
    'The movie excited me. のように、原因 → 感情 → 受け手を作る。',
    '人が主語でも、周囲に感情を与えるなら -ing が成立する。',
  ],
  summary: [
    '感情動詞は「〜させる」。',
    '与える側 → -ing、受ける側 → -ed。',
    '人・物ではなく感情の方向を見る。',
  ],
  detailedReview: [
    { title: '感情の方向の振り返り', paragraphs: ['The movie → excite → me のように、原因と受け手を分けます。原因を説明する形が exciting、受け手を説明する形が excited です。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', section: '350-414', concept: '感情動詞の「〜させる」用法と-ing / p.p.の使い分け' },
    { source: 'chapter14-ocr.md', section: '388-400', concept: 'boreを使った感情の与え手・受け手' },
  ],
};
