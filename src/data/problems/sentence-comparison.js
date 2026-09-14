export const sentenceComparisonProblems = [
  {
    id: 'PART-L1-P004-COMPARE',
    type: 'sentence-comparison',
    lessonId: 'PART-L1',
    contentRefs: ['PART-L1-EXPLAIN-01', 'PART-L1-EXPLAIN-02'],
    requirements: ['LR-PART-001', 'LR-PART-002'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-1 形容詞の意識と2種類の形' },
    prompt: '2つの名詞句を比較し、名詞を説明する語の違いを確認してください。',
    sentences: [
      { id: 'a', text: 'a quiet child', chunks: [{ id: 'l1c-a-article', text: 'a', matchKey: 'article' }, { id: 'l1c-a-modifier', text: 'quiet', differenceId: 'adjective-participle' }, { id: 'l1c-a-noun', text: 'child', matchKey: 'noun' }] },
      { id: 'b', text: 'a smiling child', chunks: [{ id: 'l1c-b-article', text: 'a', matchKey: 'article' }, { id: 'l1c-b-modifier', text: 'smiling', differenceId: 'adjective-participle' }, { id: 'l1c-b-noun', text: 'child', matchKey: 'noun' }] },
    ],
    differences: [
      { id: 'adjective-participle', leftChunkId: 'l1c-a-modifier', rightChunkId: 'l1c-b-modifier', label: 'quiet / smiling', explanation: 'quiet は一般の形容詞、smiling は smile 由来の分詞です。どちらも child を説明します。', meaningLeft: '静かな子ども。', meaningRight: 'ほほえんでいる子ども。' },
    ],
    explanation: '分詞は動詞由来でも、名詞を説明する形容詞的な働きを持ちます。',
  },
  {
    id: 'PART-L2-P001-COMPARE',
    type: 'sentence-comparison',
    lessonId: 'PART-L2',
    contentRefs: ['PART-L2-EXPLAIN-01', 'PART-L2-EXPLAIN-02'],
    requirements: ['LR-PART-002', 'LR-PART-003'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-3 -ingとp.p.の判別' },
    prompt: '名詞がするか、されるかを比べ、-ing / p.p. の意味関係を確認してください。',
    sentences: [
      { id: 'a', text: 'a barking dog', chunks: [{ id: 'l2c-a-article', text: 'a', matchKey: 'article' }, { id: 'l2c-a-form', text: 'barking', differenceId: 'active-passive' }, { id: 'l2c-a-noun', text: 'dog', matchKey: 'noun' }] },
      { id: 'b', text: 'a broken window', chunks: [{ id: 'l2c-b-article', text: 'a', matchKey: 'article' }, { id: 'l2c-b-form', text: 'broken', differenceId: 'active-passive' }, { id: 'l2c-b-noun', text: 'window', matchKey: 'noun' }] },
    ],
    differences: [
      { id: 'active-passive', leftChunkId: 'l2c-a-form', rightChunkId: 'l2c-b-form', label: 'barking / broken', explanation: 'dog barks なので barking は能動、window is broken なので broken は受動です。名詞がするか、されるかを見ます。', meaningLeft: 'ほえている犬。', meaningRight: '壊された窓。' },
    ],
    explanation: 'dog barks → barking、window is broken → broken。形は名称や日本語だけでなく、名詞との関係で選びます。',
  },
  {
    id: 'PART-L2-P004-COMPARE',
    type: 'sentence-comparison',
    lessonId: 'PART-L2',
    contentRefs: ['PART-L2-EXPLAIN-02', 'PART-L2-EXPLAIN-03'],
    requirements: ['LR-PART-003', 'LR-PART-010'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-3 -ingとp.p.の判別' },
    prompt: '2つの名詞修飾を比較し、p.p. が必ず受動ではないことを確認してください。',
    sentences: [
      { id: 'a', text: 'a broken window', chunks: [{ id: 'l2c2-a-article', text: 'a', matchKey: 'article' }, { id: 'l2c2-a-form', text: 'broken', differenceId: 'passive-completion' }, { id: 'l2c2-a-noun', text: 'window', matchKey: 'noun' }] },
      { id: 'b', text: 'fallen leaves', chunks: [{ id: 'l2c2-b-form', text: 'fallen', differenceId: 'passive-completion' }, { id: 'l2c2-b-noun', text: 'leaves', matchKey: 'noun' }] },
    ],
    differences: [
      { id: 'passive-completion', leftChunkId: 'l2c2-a-form', rightChunkId: 'l2c2-b-form', label: 'broken / fallen', explanation: 'broken は window が壊される受動、fallen は leaves が落ちる変化を終えた完了・結果状態です。p.p. がいつも受動とは限りません。', meaningLeft: '壊された窓。', meaningRight: '落ちた葉。' },
    ],
    explanation: 'broken は受動、fallen は自動詞 fall の完了・結果状態です。過去分詞の形だけで受動と決めません。',
  },
  {
    id: 'PART-L3-P004-COMPARE',
    type: 'sentence-comparison',
    lessonId: 'PART-L3',
    contentRefs: ['PART-L3-EXPLAIN-01', 'PART-L3-EXPLAIN-03'],
    requirements: ['LR-PART-005', 'LR-PART-006'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-2 分詞の位置（分詞の前置修飾・後置修飾）' },
    prompt: '1語の分詞が前置・後置される2つの名詞句を比較してください。',
    sentences: [
      { id: 'a', text: 'the dancing girl', chunks: [{ id: 'l3c-a-article', text: 'the', matchKey: 'article' }, { id: 'l3c-a-modifier', text: 'dancing', differenceId: 'one-word-position' }, { id: 'l3c-a-noun', text: 'girl', matchKey: 'noun' }] },
      { id: 'b', text: 'the girl dancing', chunks: [{ id: 'l3c-b-article', text: 'the', matchKey: 'article' }, { id: 'l3c-b-noun', text: 'girl', matchKey: 'noun' }, { id: 'l3c-b-modifier', text: 'dancing', differenceId: 'one-word-position' }] },
    ],
    differences: [
      { id: 'one-word-position', leftChunkId: 'l3c-a-modifier', rightChunkId: 'l3c-b-modifier', label: 'the dancing girl / the girl dancing', explanation: 'どちらも可能です。1語の分詞は前置が基本ですが、後置には文脈や焦点が関係します。「1語なら必ず前」とは限りません。', meaningLeft: '踊っている女の子。', meaningRight: 'その女の子は踊っている。' },
    ],
    explanation: '基本配置は前置ですが、1語後置もあります。語数だけでなく、どの名詞を説明するかと文脈を見ます。',
  },
  {
    id: 'PART-L5-P002-COMPARE',
    type: 'sentence-comparison',
    lessonId: 'PART-L5',
    contentRefs: ['PART-L5-EXPLAIN-01', 'PART-L5-EXPLAIN-02'],
    requirements: ['LR-PART-012'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-2 感情動詞の分詞化' },
    prompt: '感情を与える側と受ける側を比較し、-ing / -ed の意味を確認してください。',
    comparisonAxes: ['base verb', 'role', 'direction', 'form', 'meaning'],
    sentences: [
      { id: 'a', text: 'The science demonstration was exciting.', chunks: [{ id: 'l5c-a-subject', text: 'The science demonstration', matchKey: 'cause' }, { id: 'l5c-a-form', text: 'was exciting', differenceId: 'emotion-direction' }] },
      { id: 'b', text: 'The visitors were excited.', chunks: [{ id: 'l5c-b-subject', text: 'The visitors', matchKey: 'experiencer' }, { id: 'l5c-b-form', text: 'were excited', differenceId: 'emotion-direction' }] },
    ],
    differences: [
      { id: 'emotion-direction', leftChunkId: 'l5c-a-form', rightChunkId: 'l5c-b-form', label: 'exciting / excited', explanation: 'base verb は excite。demonstration は感情を与える側なので -ing、visitors は感情を受ける側なので -ed です。人か物かではなく、誰・何が感情を起こすかを見ます。', meaningLeft: '科学の実演が人をワクワクさせる。', meaningRight: '訪問者がワクワクしている。' },
    ],
    explanation: 'The demonstration excites the visitors. という関係を作ると、原因には exciting、感情を受ける側には excited が対応します。',
  },
  {
    id: 'PART-L5-P003-COMPARE-BORING',
    type: 'sentence-comparison',
    lessonId: 'PART-L5',
    contentRefs: ['PART-L5-EXPLAIN-01', 'PART-L5-EXPLAIN-02'],
    requirements: ['LR-PART-011', 'LR-PART-012'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-2 感情動詞の分詞化' },
    prompt: '同じ人を主語にした2文を比べ、感情の向きで形が変わることを確認してください。',
    sentences: [
      { id: 'a', text: 'He is boring.', chunks: [{ id: 'l5c2-a-subject', text: 'He', matchKey: 'subject' }, { id: 'l5c2-a-form', text: 'is boring', differenceId: 'human-direction' }] },
      { id: 'b', text: 'He is bored.', chunks: [{ id: 'l5c2-b-subject', text: 'He', matchKey: 'subject' }, { id: 'l5c2-b-form', text: 'is bored', differenceId: 'human-direction' }] },
    ],
    differences: [
      { id: 'human-direction', leftChunkId: 'l5c2-a-form', rightChunkId: 'l5c2-b-form', label: 'boring / bored', explanation: 'boring は He が周囲を bore する感情の与え手、bored は He が退屈を受ける側です。人が主語でも -ing は成立します。', meaningLeft: '彼は人を退屈させる。', meaningRight: '彼は退屈している。' },
    ],
    explanation: '人か物かでは決めません。He causes boredom. なら boring、He receives boredom. なら bored です。',
  },
];

export const sentenceComparisonProblem = sentenceComparisonProblems[0];
