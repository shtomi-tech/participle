export const lessons = [
  {
    id: 'PART-L4',
    slug: 'hidden-sv',
    label: 'Lesson 4',
    title: '名詞と分詞のHidden S-V',
    description: '分詞が説明する名詞を特定し、名詞と元動詞の関係から形を判断します。',
    learningGoal: '分詞を見たら、説明対象の名詞、元動詞、能動・受動の関係を順に確認し、-ing / p.p. の根拠を説明できるようにする。',
    steps: [
      {
        id: 'PART-L4-STEP-01',
        interactionType: 'mark-parts',
        problemId: 'PART-L4-P001-MARK',
        title: '能動の分詞が説明する名詞を見つける',
        instruction: 'まず、smiling at her mother が説明している名詞を選びます。まだ形は決めません。',
      },
      {
        id: 'PART-L4-STEP-02',
        interactionType: 'modifier-connection-viewer',
        problemId: 'PART-L4-P001-REL',
        title: 'the baby → smile を確認する',
        instruction: '関係カードを選び、the baby が smile する能動関係と smiling を確認します。',
      },
      {
        id: 'PART-L4-STEP-03',
        interactionType: 'mark-parts',
        problemId: 'PART-L4-P002-MARK',
        title: '受動の分詞が説明する名詞を見つける',
        instruction: 'spoken in that country が説明している名詞を選びます。訳だけで形を決めません。',
      },
      {
        id: 'PART-L4-STEP-04',
        interactionType: 'modifier-connection-viewer',
        problemId: 'PART-L4-P002-REL',
        title: 'the language ← speak を確認する',
        instruction: '関係カードを選び、the language が speak される受動関係と spoken を確認します。',
      },
      {
        id: 'PART-L4-STEP-05',
        interactionType: 'mark-parts',
        problemId: 'PART-L4-P003-MARK',
        title: '隣の語に惑わされず対象を選ぶ',
        instruction: 'reading quietly のすぐ前にある語ではなく、意味上説明される名詞を選びます。',
      },
      {
        id: 'PART-L4-STEP-06',
        interactionType: 'modifier-connection-viewer',
        problemId: 'PART-L4-P003-REL',
        title: '長い名詞句のHidden S-Vを確認する',
        instruction: '関係カードを選び、the students → read が reading の根拠になることを確認します。',
      },
      {
        id: 'PART-L4-STEP-07',
        interactionType: 'mark-parts',
        problemId: 'PART-L4-P004-MARK',
        title: '訳に頼らず対象を選ぶ',
        instruction: '「流している」という訳の印象から離れ、played at the festival の対象名詞を選びます。',
      },
      {
        id: 'PART-L4-STEP-08',
        interactionType: 'modifier-connection-viewer',
        problemId: 'PART-L4-P004-REL',
        title: 'the songs ← play を確認する',
        instruction: '関係カードを選び、songs が play される受動関係なので played になることを確認します。',
      },
    ],
  },
];

export function getLessonBySlug(slug) {
  return lessons.find((lesson) => lesson.slug === slug);
}
