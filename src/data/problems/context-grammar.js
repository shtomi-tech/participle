export const contextGrammarProblems = [
  {
    id: 'PART-L5-P004-CONTEXT',
    type: 'context-grammar',
    lessonId: 'PART-L5',
    contentRefs: ['PART-L5-EXPLAIN-01', 'PART-L5-EXPLAIN-02'],
    requirements: ['LR-PART-011', 'LR-PART-012'],
    sourceEvidence: { source: 'chapter14-ocr.md', section: '14-2 感情動詞の分詞化' },
    prompt: '場面と伝えたい意味に合う感情表現を選び、会話を進めてください。',
    scenario: {
      title: 'Talking about a science event',
      setting: '科学イベントについて友人と話し、イベントが与えた感情と自分の反応を伝える場面です。',
      learnerRole: 'Student',
      goal: '感情を起こす側と受ける側を区別して、-ing / -ed を選ぶ。',
    },
    context: '会話では、まず cause（感情を起こすもの）と experiencer（感情を感じる人）を分けて考えます。',
    steps: [
      {
        id: 'l5-context-step-1',
        speaker: 'Friend',
        line: 'How was the planetarium show?',
        instruction: 'ショーが周りに与えた感情を答えてください。',
        choices: [
          { id: 'l5-context-choice-1a', text: 'The planetarium show was exciting.', reply: 'It sounds like a great show. I want to see it too.', grammarLabel: '-ing: emotion giver', explanation: 'The show excites people. ショーが感情を起こす側なので exciting です。' },
          { id: 'l5-context-choice-1b', text: 'I was excited.', reply: 'That tells me your feeling, but I asked about the show itself.', grammarLabel: '-ed: emotion receiver', explanation: 'I was excited は文法的ですが、質問の焦点である show ではなく、受け手の feeling を答えています。' },
          { id: 'l5-context-choice-1c', text: 'The planetarium show was excited.', reply: 'A show usually causes the feeling; it does not receive it here.', grammarLabel: '-ed on the cause', explanation: 'この場面では show が感情を起こす側なので、excited ではなく exciting を使います。' },
        ],
        acceptedChoiceIds: ['l5-context-choice-1a'],
      },
      {
        id: 'l5-context-step-2',
        speaker: 'Friend',
        line: 'How did you feel during the long train ride home?',
        instruction: '自分が感じた気持ちを答えてください。',
        choices: [
          { id: 'l5-context-choice-2a', text: 'I was bored.', reply: 'I understand. A long ride can feel very slow.', grammarLabel: '-ed: emotion receiver', explanation: 'I receive the feeling caused by the long ride, so I was bored です。' },
          { id: 'l5-context-choice-2b', text: 'I was boring.', reply: 'That would mean you caused other people to feel bored.', grammarLabel: '-ing: emotion giver', explanation: 'I was boring は「私は周りを退屈させる人だった」という意味になり、今回の自分の feeling には合いません。' },
          { id: 'l5-context-choice-2c', text: 'The train ride was bored.', reply: 'The ride caused the feeling, so it needs the giver form.', grammarLabel: '-ed on the cause', explanation: 'train ride が感情を起こす側なら、The train ride was boring. のように -ing を使います。' },
        ],
        acceptedChoiceIds: ['l5-context-choice-2a'],
      },
      {
        id: 'l5-context-step-3',
        speaker: 'Friend',
        line: 'The announcement came earlier than expected. What was your reaction?',
        instruction: 'その知らせを受けた自分の反応を答えてください。',
        choices: [
          { id: 'l5-context-choice-3a', text: 'I was surprised.', reply: 'That makes sense. The early announcement surprised you.', grammarLabel: '-ed: emotion receiver', explanation: 'The announcement surprised me. 私は感情を受ける側なので surprised です。' },
          { id: 'l5-context-choice-3b', text: 'I was surprising.', reply: 'That would mean you surprised other people.', grammarLabel: '-ing: emotion giver', explanation: 'I was surprising は「私が他の人を驚かせた」という意味です。自分の反応なら surprised を使います。' },
          { id: 'l5-context-choice-3c', text: 'The announcement was surprised.', reply: 'The announcement caused the surprise; it did not feel it.', grammarLabel: '-ed on the cause', explanation: '知らせが感情を起こした原因なら、The announcement was surprising. とします。' },
        ],
        acceptedChoiceIds: ['l5-context-choice-3a'],
      },
    ],
    explanation: 'context → intended meaning → emotion giver / receiver → -ing / -ed の順に考えます。人か物かだけで形を決めないことがポイントです。',
  },
];
