export const errorCorrectorProblems = [
  {
    id: 'PART-L2-P003-ERROR',
    type: 'error-corrector',
    lessonId: 'PART-L2',
    contentRefs: ['PART-L2-EXPLAIN-01', 'PART-L2-EXPLAIN-02'],
    requirements: ['LR-PART-008', 'LR-PART-009'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-3 -ingとp.p.の判別' },
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
  {
    id: 'PART-L6-IC-003-FORM',
    type: 'error-corrector',
    lessonId: 'PART-L6',
    contentRefs: ['PART-L6-EXPLAIN-01', 'PART-L6-EXPLAIN-02'],
    requirements: ['LR-PART-008', 'LR-PART-013'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-3 -ingとp.p.の判別' },
    prompt: '同じ英文で、report と prepare の関係に合う分詞の形を選んでください。',
    tokens: [
      { id: 'l6ic-form-the', text: 'The' },
      { id: 'l6ic-form-report', text: 'report' },
      { id: 'l6ic-form-preparing', text: 'preparing', correctionId: 'l6ic-form-choice' },
      { id: 'l6ic-form-for-staff', text: 'for new staff' },
      { id: 'l6ic-form-explains', text: 'explains the safety rules.' },
    ],
    corrections: [
      {
        id: 'l6ic-form-choice',
        tokenId: 'l6ic-form-preparing',
        options: [
          { id: 'l6ic-opt-preparing', text: 'preparing' },
          { id: 'l6ic-opt-prepared', text: 'prepared' },
          { id: 'l6ic-opt-prepares', text: 'prepares' },
        ],
        acceptedOptionIds: ['l6ic-opt-prepared'],
        ruleLabel: 'Passive Hidden S-V',
        explanation: 'report が prepare される関係なので、passive の prepared です。report is prepared for new staff. と戻して確認します。',
      },
    ],
    explanation: '同じ report を最後まで処理します。report → prepare → report is prepared → passive → prepared の順です。',
  },
];
