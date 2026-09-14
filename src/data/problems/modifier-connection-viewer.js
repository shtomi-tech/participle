const shared = {
  type: 'modifier-connection-viewer',
  lessonId: 'PART-L4',
};

export const modifierConnectionProblems = [
  {
    ...shared,
    id: 'PART-L4-P001-REL',
    contentRefs: ['PART-L4-EXPLAIN-01', 'PART-L4-EXPLAIN-02'],
    requirements: ['LR-PART-004', 'LR-PART-007'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-3 -ingとp.p.の判別' },
    sentence: 'The baby smiling at her mother is my sister.',
    targetNoun: 'the baby',
    baseVerb: 'smile',
    semanticVoice: 'active',
    participleForm: '-ing',
    prompt: '関係を選び、名詞と元動詞のHidden S-Vを確認してください。',
    chunks: [
      { id: 'p1-rel-baby', text: 'the baby', kind: 'core' },
      { id: 'p1-rel-smiling', text: 'smiling at her mother', kind: 'modifier' },
      { id: 'p1-rel-rest', text: 'is my sister', kind: 'core' },
    ],
    relations: [
      { id: 'p1-rel-1', modifierId: 'p1-rel-smiling', targetId: 'p1-rel-baby', relationType: 'modifies', label: 'Hidden S-V: active · the baby → smile · result: smiling', explanation: 'The baby smiles. 名詞 baby が元動詞 smile をする関係なので能動。したがって分詞は smiling です。' },
    ],
    explanation: '修飾語から対象名詞へ進み、名詞が元動詞をするかを確認します。',
  },
  {
    ...shared,
    id: 'PART-L4-P002-REL',
    contentRefs: ['PART-L4-EXPLAIN-01', 'PART-L4-EXPLAIN-02'],
    requirements: ['LR-PART-004', 'LR-PART-008'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-3 -ingとp.p.の判別' },
    sentence: 'The language spoken in that country is widely understood.',
    targetNoun: 'the language',
    baseVerb: 'speak',
    semanticVoice: 'passive',
    participleForm: 'p.p.',
    prompt: '関係を選び、名詞と元動詞のHidden S-Vを確認してください。',
    chunks: [
      { id: 'p2-rel-language', text: 'the language', kind: 'core' },
      { id: 'p2-rel-spoken', text: 'spoken in that country', kind: 'modifier' },
      { id: 'p2-rel-rest', text: 'is widely understood', kind: 'core' },
    ],
    relations: [
      { id: 'p2-rel-1', modifierId: 'p2-rel-spoken', targetId: 'p2-rel-language', relationType: 'modifies', label: 'Hidden S-V: passive · the language ← speak · result: spoken', explanation: 'The language is spoken in that country. 名詞 language が元動詞 speak をされる関係なので受動。したがって spoken です。' },
    ],
    explanation: '過去分詞を見たら、受動だけでなく、どの名詞が何をされるかを確認します。',
  },
  {
    ...shared,
    id: 'PART-L4-P003-REL',
    contentRefs: ['PART-L4-EXPLAIN-01', 'PART-L4-EXPLAIN-03'],
    requirements: ['LR-PART-004', 'LR-PART-007', 'LR-PART-009'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-1-2 分詞の位置（分詞の前置修飾・後置修飾）' },
    sentence: 'The students in the front row reading quietly are ready.',
    targetNoun: 'the students',
    baseVerb: 'read',
    semanticVoice: 'active',
    participleForm: '-ing',
    prompt: '隣の語ではなく、意味上の修飾関係を選んでください。',
    chunks: [
      { id: 'p3-rel-students', text: 'the students', kind: 'core' },
      { id: 'p3-rel-front-row', text: 'in the front row', kind: 'core' },
      { id: 'p3-rel-reading', text: 'reading quietly', kind: 'modifier' },
      { id: 'p3-rel-rest', text: 'are ready', kind: 'core' },
    ],
    relations: [
      { id: 'p3-rel-1', modifierId: 'p3-rel-reading', targetId: 'p3-rel-students', relationType: 'modifies', label: 'Hidden S-V: active · the students → read · result: reading', explanation: 'The students read quietly. reading quietly は隣の front row ではなく、the students が read する関係を表します。' },
    ],
    explanation: '分詞の直前の語をそのまま対象にせず、意味上のS-V関係を選びます。',
  },
];
