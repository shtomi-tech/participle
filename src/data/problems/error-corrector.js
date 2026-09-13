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
  {
    id: 'PART-L5-P003-ERROR',
    type: 'error-corrector',
    lessonId: 'PART-L5',
    requirements: ['LR-PART-009', 'LR-PART-012'],
    sourceEvidence: {
      source: 'chapter14-ocr.md',
      section: '14-2 感情動詞の分詞化',
    },
    prompt: '文脈で伝えたい意味に合うように、感情動詞の分詞を訂正してください。',
    context: 'The writer is describing what the science show did and how the visitors felt. 形ではなく、感情の向きを確認します。',
    tokens: [
      { id: 'l5e-the', text: 'The' },
      { id: 'l5e-show', text: 'science show' },
      { id: 'l5e-was', text: 'was' },
      { id: 'l5e-excited', text: 'excited', correctionId: 'l5e-cause' },
      { id: 'l5e-so', text: 'so' },
      { id: 'l5e-visitors', text: 'the visitors' },
      { id: 'l5e-were', text: 'were' },
      { id: 'l5e-exciting', text: 'exciting', correctionId: 'l5e-experiencer' },
      { id: 'l5e-period', text: '.' },
    ],
    corrections: [
      {
        id: 'l5e-cause',
        tokenId: 'l5e-excited',
        options: [
          { id: 'l5e-opt-cause-excited', text: 'excited' },
          { id: 'l5e-opt-cause-exciting', text: 'exciting' },
          { id: 'l5e-opt-cause-surprising', text: 'surprising' },
        ],
        acceptedOptionIds: ['l5e-opt-cause-exciting'],
        ruleLabel: 'Who causes the emotion?',
        explanation: 'The science show causes the feeling: the show excites the visitors. だから show は感情を与える側で、exciting です。人・物という種類では決めません。',
      },
      {
        id: 'l5e-experiencer',
        tokenId: 'l5e-exciting',
        options: [
          { id: 'l5e-opt-receiver-exciting', text: 'exciting' },
          { id: 'l5e-opt-receiver-excited', text: 'excited' },
          { id: 'l5e-opt-receiver-surprised', text: 'surprised' },
        ],
        acceptedOptionIds: ['l5e-opt-receiver-excited'],
        ruleLabel: 'Who experiences the emotion?',
        explanation: 'The visitors receive and feel the excitement: the visitors are excited. 「人だから」ではなく、感情を受ける側だから -ed です。',
      },
    ],
    explanation: 'exciting は感情を起こす側、excited はその感情を受ける側です。She is exciting. のように、人でも周囲をワクワクさせる意味なら -ing が成立します。',
  },
];

export const errorCorrectorProblem = errorCorrectorProblems[0];
