const sourceBase = {
  source: 'chapter14-ocr.md',
  section: '14-1-1 形容詞の意識と2種類の形',
};

export const grammarClassifierProblems = [
  {
    id: 'PART-L1-P002-CLASS',
    type: 'grammar-classifier',
    lessonId: 'PART-L1',
    requirements: ['LR-PART-001', 'LR-PART-002'],
    sourceEvidence: sourceBase,
    prompt: '語句カードを、文の中での役割ごとに分類してください。',
    sentence: 'A cheerful smiling child opened the door.',
    classificationAxis: 'Part of speech and phrase role',
    categories: [
      { id: 'noun', label: 'Noun', explanation: '人・ものの名前を表す名詞です。' },
      { id: 'ordinary-adjective', label: 'Ordinary adjective', explanation: '名詞の性質を表す一般の形容詞です。' },
      { id: 'participle-adjective', label: 'Participle used adjectivally', explanation: '動詞由来で、名詞を説明する分詞です。' },
      { id: 'verb', label: 'Verb', explanation: '動作や状態を表す動詞です。' },
    ],
    items: [
      { id: 'l1-cheerful', text: 'cheerful', answer: 'ordinary-adjective', explanation: 'cheerful は child の性質を説明します。' },
      { id: 'l1-smiling', text: 'smiling', answer: 'participle-adjective', explanation: 'smiling は smile 由来で、child を説明します。' },
      { id: 'l1-child', text: 'child', answer: 'noun', explanation: 'child は人を表す名詞です。' },
      { id: 'l1-opened', text: 'opened', answer: 'verb', explanation: 'opened は文の動作を表す動詞です。' },
    ],
    explanation: '分詞は動詞から作られますが、名詞を説明するときは形容詞のように働きます。',
  },
  {
    id: 'PART-L2-P002-CLASS',
    type: 'grammar-classifier',
    lessonId: 'PART-L2',
    requirements: ['LR-PART-003', 'LR-PART-010'],
    sourceEvidence: {
      source: 'chapter14-ocr.md',
      section: '14-1-3 -ingとp.p.の判別',
    },
    prompt: '分詞句を、名詞がする関係・される関係・完了の状態に分類してください。',
    sentence: 'smiling child / recommended book / fallen leaves / grown children',
    classificationAxis: 'Meaning axis',
    categories: [
      { id: 'active', label: 'Active', explanation: '名詞がその動作をする側です。' },
      { id: 'passive', label: 'Passive', explanation: '名詞がその動作をされる側です。' },
      { id: 'completion', label: 'Completion', explanation: '動作・変化が完了した状態です。' },
    ],
    items: [
      { id: 'l2-smiling-child', text: 'smiling child', answer: 'active', explanation: 'child が smile するので active です。' },
      { id: 'l2-recommended-book', text: 'recommended book', answer: 'passive', explanation: 'book は誰かに recommend されるので passive です。' },
      { id: 'l2-fallen-leaves', text: 'fallen leaves', answer: 'completion', explanation: 'leaves が落ちる変化を終えた状態です。' },
      { id: 'l2-grown-children', text: 'grown children', answer: 'completion', explanation: 'children が成長した後の状態です。' },
    ],
    explanation: '-ing / p.p. の名前や形だけでなく、名詞との意味関係と完了の有無を見ます。',
  },
];

export const grammarClassifierProblem = grammarClassifierProblems[0];
