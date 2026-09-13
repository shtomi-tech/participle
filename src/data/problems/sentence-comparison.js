export const sentenceComparisonProblems = [
  {
    id: 'PART-L1-P004-COMPARE',
    type: 'sentence-comparison',
    lessonId: 'PART-L1',
    requirements: ['LR-PART-001', 'LR-PART-002'],
    sourceEvidence: {
      source: 'chapter14-ocr.md',
      section: '14-1-1 形容詞の意識と2種類の形',
    },
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
    requirements: ['LR-PART-002', 'LR-PART-003'],
    sourceEvidence: {
      source: 'chapter14-ocr.md',
      section: '14-1-3 -ingとp.p.の判別',
    },
    prompt: '分詞の形を時制名で決めず、名詞との関係の違いを確認してください。',
    sentences: [
      { id: 'a', text: 'a smiling child', chunks: [{ id: 'l2c-a-article', text: 'a', matchKey: 'article' }, { id: 'l2c-a-form', text: 'smiling', differenceId: 'voice-axis' }, { id: 'l2c-a-noun', text: 'child', matchKey: 'noun' }] },
      { id: 'b', text: 'a surprised child', chunks: [{ id: 'l2c-b-article', text: 'a', matchKey: 'article' }, { id: 'l2c-b-form', text: 'surprised', differenceId: 'voice-axis' }, { id: 'l2c-b-noun', text: 'child', matchKey: 'noun' }] },
    ],
    differences: [
      { id: 'voice-axis', leftChunkId: 'l2c-a-form', rightChunkId: 'l2c-b-form', label: 'smiling / surprised', explanation: 'smiling は child が smile する側、surprised は child が surprise を受ける側です。「現在／過去」だけの差ではありません。', meaningLeft: 'ほほえんでいる子ども。', meaningRight: '驚かされた子ども。' },
    ],
    explanation: '現在分詞・過去分詞という名称は、ここでの意味関係や時制をそのまま表すわけではありません。',
  },
  {
    id: 'PART-L2-P004-COMPARE',
    type: 'sentence-comparison',
    lessonId: 'PART-L2',
    requirements: ['LR-PART-003', 'LR-PART-010'],
    sourceEvidence: {
      source: 'chapter14-ocr.md',
      section: '14-1-3 -ingとp.p.の判別',
    },
    prompt: '過去分詞が受動とは限らないことを、完了の例と比較してください。',
    sentences: [
      { id: 'a', text: 'The leaves have fallen.', chunks: [{ id: 'l2c2-a-subject', text: 'The leaves', matchKey: 'subject' }, { id: 'l2c2-a-verb', text: 'have fallen', differenceId: 'completion-passive' }] },
      { id: 'b', text: 'The leaves are carried by the wind.', chunks: [{ id: 'l2c2-b-subject', text: 'The leaves', matchKey: 'subject' }, { id: 'l2c2-b-verb', text: 'are carried by the wind', differenceId: 'completion-passive' }] },
    ],
    differences: [
      { id: 'completion-passive', leftChunkId: 'l2c2-a-verb', rightChunkId: 'l2c2-b-verb', label: 'have fallen / are carried', explanation: 'fallen は leaves 自身の変化が完了した状態、carried は leaves が風に運ばれる受動です。', meaningLeft: '葉が落ちた。', meaningRight: '葉が風に運ばれる。' },
    ],
    explanation: '自動詞由来の過去分詞は、受動ではなく完了した状態を表すことがあります。',
  },
  {
    id: 'PART-L3-P004-COMPARE',
    type: 'sentence-comparison',
    lessonId: 'PART-L3',
    requirements: ['LR-PART-005', 'LR-PART-006'],
    sourceEvidence: {
      source: 'chapter14-ocr.md',
      section: '14-1-2 分詞の位置（分詞の前置修飾・後置修飾）',
    },
    prompt: '分詞1語と分詞を中心とする語句の位置を比較してください。',
    sentences: [
      { id: 'a', text: 'the glowing lamp', chunks: [{ id: 'l3c-a-article', text: 'the', matchKey: 'article' }, { id: 'l3c-a-modifier', text: 'glowing', differenceId: 'position-length' }, { id: 'l3c-a-noun', text: 'lamp', matchKey: 'noun' }] },
      { id: 'b', text: 'the lamp glowing near the window', chunks: [{ id: 'l3c-b-article', text: 'the', matchKey: 'article' }, { id: 'l3c-b-noun', text: 'lamp', matchKey: 'noun' }, { id: 'l3c-b-modifier', text: 'glowing near the window', differenceId: 'position-length' }] },
    ],
    differences: [
      { id: 'position-length', leftChunkId: 'l3c-a-modifier', rightChunkId: 'l3c-b-modifier', label: '1語 / 分詞句', explanation: '分詞1語は名詞の前、分詞を中心とする語句は名詞の後ろに置くのが基本です。', meaningLeft: '光っているランプ。', meaningRight: '窓の近くで光っているランプ。' },
    ],
    explanation: '位置は語数だけで機械的に決めず、どの名詞を説明するかと合わせて確認します。',
  },
];

export const sentenceComparisonProblem = sentenceComparisonProblems[0];
