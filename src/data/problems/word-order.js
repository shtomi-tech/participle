export const wordOrderProblems = [
  {
    id: 'PART-L1-P003-WORD',
    type: 'word-order',
    lessonId: 'PART-L1',
    requirements: ['LR-PART-001', 'LR-PART-005'],
    sourceEvidence: {
      source: 'chapter14-ocr.md',
      section: '14-1-2 分詞の位置（分詞の前置修飾・後置修飾）',
    },
    prompt: '単語カードを並べ替えて、名詞の前にある分詞を含む句を作ってください。',
    words: [
      { id: 'l1-a', text: 'a' },
      { id: 'l1-smiling', text: 'smiling' },
      { id: 'l1-baby', text: 'baby' },
    ],
    acceptedAnswers: [['l1-a', 'l1-smiling', 'l1-baby']],
    explanation: 'smiling は smile 由来ですが、この句では baby の前に置かれて baby を説明しています。',
  },
];

export const wordOrderProblem = wordOrderProblems[0];
