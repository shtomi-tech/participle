export const modifierPositionerProblems = [
  {
    id: 'PART-L3-P001-POSITION',
    type: 'modifier-positioner',
    lessonId: 'PART-L3',
    contentRefs: ['PART-L3-EXPLAIN-01'],
    requirements: ['LR-PART-005'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-2 分詞の位置（分詞の前置修飾・後置修飾）' },
    prompt: 'glowing を The lamp の前に置き、名詞を説明する句を作ってください。',
    goal: { description: 'glowing が lamp を説明する前置修飾を確認する。' },
    chunks: [
      { id: 'l3p1-the', text: 'The' },
      { id: 'l3p1-lamp', text: 'lamp' },
      { id: 'l3p1-lit-desk', text: 'lit the desk' },
    ],
    modifier: { id: 'l3p1-glowing', text: 'glowing' },
    placements: [
      { id: 'l3p1-before-noun', position: 1, label: 'Before “lamp”', grammatical: true, matchesGoal: true, relation: { modifierId: 'l3p1-glowing', targetId: 'l3p1-lamp', relationType: 'modifies', label: 'glowing → lamp', explanation: 'glowing は lamp を説明する分詞です。' }, meaning: '光っているランプが机を照らした。' },
      { id: 'l3p1-sentence-end', position: 3, label: 'Sentence end', grammatical: false, matchesGoal: false, relation: { modifierId: 'l3p1-glowing', targetId: 'l3p1-lit-desk', relationType: 'modifies', label: 'glowing → lit the desk', explanation: 'この位置では、問題の文で lamp を直接説明する形になりません。' }, meaning: 'この問題では自然な配置になりません。' },
    ],
    punctuation: '.',
    explanation: '分詞1語は名詞の前に置く前置修飾を基本として確認します。',
  },
  {
    id: 'PART-L3-P002-POSITION',
    type: 'modifier-positioner',
    lessonId: 'PART-L3',
    contentRefs: ['PART-L3-EXPLAIN-02'],
    requirements: ['LR-PART-006'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-2 分詞の位置（分詞の前置修飾・後置修飾）' },
    prompt: 'glowing near the window を The lamp の後ろに置き、分詞句の後置修飾を作ってください。',
    goal: { description: '長い分詞句が lamp を説明する後置修飾を確認する。' },
    chunks: [
      { id: 'l3p2-lamp', text: 'The lamp' },
      { id: 'l3p2-lit-desk', text: 'lit the desk' },
    ],
    modifier: { id: 'l3p2-glowing', text: 'glowing near the window' },
    placements: [
      { id: 'l3p2-after-subject', position: 1, label: 'After “The lamp”', grammatical: true, matchesGoal: true, relation: { modifierId: 'l3p2-glowing', targetId: 'l3p2-lamp', relationType: 'modifies', label: 'glowing near the window → The lamp', explanation: '分詞を中心とする語句が The lamp の後ろから説明しています。' }, meaning: '窓の近くで光っているランプが机を照らした。' },
      { id: 'l3p2-sentence-end', position: 2, label: 'Sentence end', grammatical: true, matchesGoal: false, relation: { modifierId: 'l3p2-glowing', targetId: 'l3p2-lit-desk', relationType: 'modifies', label: 'glowing near the window → lit the desk', explanation: '文末では、机を照らす動作に付随する情報のように読めます。' }, meaning: 'ランプは、窓の近くで光りながら机を照らした。' },
    ],
    punctuation: '.',
    explanation: '分詞句は名詞の後ろに置いて、直前の名詞を説明するのが基本です。',
  },
  {
    id: 'PART-L6-IC-004-POSITION',
    type: 'modifier-positioner',
    lessonId: 'PART-L6',
    contentRefs: ['PART-L6-EXPLAIN-01', 'PART-L6-EXPLAIN-03'],
    requirements: ['LR-PART-004', 'LR-PART-006', 'LR-PART-013'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-2 分詞の位置（分詞の前置修飾・後置修飾）' },
    prompt: '同じ英文で、prepared for new staff を report の後ろに置いてください。',
    goal: { description: 'prepared for new staff は分詞句なので report の後ろから説明することを確認する。' },
    chunks: [
      { id: 'l6ic-pos-the', text: 'The' },
      { id: 'l6ic-pos-report', text: 'report' },
      { id: 'l6ic-pos-explains', text: 'explains the safety rules' },
    ],
    modifier: { id: 'l6ic-pos-prepared', text: 'prepared for new staff' },
    placements: [
      { id: 'l6ic-pos-after-report', position: 2, label: 'After “report” · phrase', modifierText: 'prepared for new staff', grammatical: true, matchesGoal: true, relation: { modifierId: 'l6ic-pos-prepared', targetId: 'l6ic-pos-report', relationType: 'modifies', label: 'prepared for new staff → report', explanation: 'prepared for new staff は分詞句なので report の後ろから説明します。' }, meaning: '新しい職員向けに用意されたレポートは安全規則を説明する。' },
      { id: 'l6ic-pos-before-report', position: 1, label: 'Before “report” · phrase', modifierText: 'prepared for new staff', grammatical: false, matchesGoal: false, relation: { modifierId: 'l6ic-pos-prepared', targetId: 'l6ic-pos-report', relationType: 'modifies', label: 'prepared for new staff → report', explanation: 'この長い分詞句は、今回の基本配置では report の後ろに置きます。' }, meaning: 'この問題では自然な基本配置になりません。' },
    ],
    punctuation: '.',
    explanation: 'prepared for new staff は分詞を中心とする語句です。report の後ろに置き、同じIntegrated Caseを最後まで完成させます。',
  },
];

export const modifierPositionerProblem = modifierPositionerProblems[0];
