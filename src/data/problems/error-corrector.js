export const errorCorrectorProblems = [
  {
    id: 'PART-L2-P003-ERROR',
    type: 'error-corrector',
    lessonId: 'PART-L2',
    requirements: ['LR-PART-008', 'LR-PART-009'],
    sourceEvidence: {
      source: 'chapter14-ocr.md',
      section: '14-1-3 -ingとp.p.の判別',
    },
    prompt: '誤っている分詞の形を選び、名詞との関係に合う形へ直してください。',
    tokens: [
      { id: 'l2e-the', text: 'The' },
      { id: 'l2e-language', text: 'language' },
      { id: 'l2e-speak', text: 'speak', correctionId: 'l2e-voice' },
      { id: 'l2e-in-country', text: 'in that country' },
      { id: 'l2e-is-understood', text: 'is widely understood.' },
    ],
    corrections: [
      {
        id: 'l2e-voice',
        tokenId: 'l2e-speak',
        options: [
          { id: 'l2e-opt-speak', text: 'speak' },
          { id: 'l2e-opt-spoken', text: 'spoken' },
          { id: 'l2e-opt-speaking', text: 'speaking' },
        ],
        acceptedOptionIds: ['l2e-opt-spoken'],
        ruleLabel: 'Active / passive relation',
        explanation: 'language は speak する側ではなく、speak される側なので spoken です。訳の表面だけでなく、名詞が何をされるかを確認します。',
      },
    ],
    explanation: '正しい形は、target noun・base verb・active / passiveの関係から説明します。',
  },
];

export const errorCorrectorProblem = errorCorrectorProblems[0];
