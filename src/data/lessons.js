export const lessons = [
  {
    id: 'PART-L1',
    slug: 'participle-basics',
    label: 'Lesson 1',
    title: '分詞とは何か',
    description: '分詞は動詞由来で、名詞を説明する形容詞的な働きを持つことを確認します。',
    learningGoal: '分詞を見たら、元の動詞と、説明される名詞を見つけられるようにする。',
    steps: [
      { id: 'PART-L1-STEP-01', interactionType: 'mark-parts', problemId: 'PART-L1-P001-MARK', title: '分詞が説明する名詞を見つける', instruction: 'glowing が説明している名詞を選びます。' },
      { id: 'PART-L1-STEP-02', interactionType: 'grammar-classifier', problemId: 'PART-L1-P002-CLASS', title: '語句の役割を分類する', instruction: '一般の形容詞、分詞、名詞、動詞を分類します。' },
      { id: 'PART-L1-STEP-03', interactionType: 'word-order', problemId: 'PART-L1-P003-WORD', title: '分詞と名詞を並べる', instruction: '分詞が名詞を説明する前置修飾の句を組み立てます。' },
      { id: 'PART-L1-STEP-04', interactionType: 'sentence-comparison', problemId: 'PART-L1-P004-COMPARE', title: '形容詞と分詞を比べる', instruction: '形は違っても、どちらも名詞を説明できることを確認します。' },
    ],
  },
  {
    id: 'PART-L2',
    slug: 'ing-vs-pp',
    label: 'Lesson 2',
    title: '-ing / p.p. の基本',
    description: '分詞の名前を時制と同一視せず、能動・受動・完了の意味軸を確認します。',
    learningGoal: '-ing / p.p. を見たら、名詞がするのか、されるのか、変化が完了したのかを考えられるようにする。',
    steps: [
      { id: 'PART-L2-STEP-01', interactionType: 'sentence-comparison', problemId: 'PART-L2-P001-COMPARE', title: '能動と受動を比べる', instruction: 'smiling と surprised の意味関係を比較します。' },
      { id: 'PART-L2-STEP-02', interactionType: 'grammar-classifier', problemId: 'PART-L2-P002-CLASS', title: '意味軸で分類する', instruction: '能動・受動・完了のどれにあたるかを分類します。' },
      { id: 'PART-L2-STEP-03', interactionType: 'error-corrector', problemId: 'PART-L2-P003-ERROR', title: '受動の形を訂正する', instruction: 'language が speak される関係に合う形を選びます。' },
      { id: 'PART-L2-STEP-04', interactionType: 'sentence-comparison', problemId: 'PART-L2-P004-COMPARE', title: '完了と受動を区別する', instruction: 'fallen が機械的な受動ではない例を比較します。' },
    ],
  },
  {
    id: 'PART-L3',
    slug: 'modifier-position',
    label: 'Lesson 3',
    title: '前置修飾・後置修飾',
    description: '分詞1語と分詞句の置かれる位置、そして修飾する名詞との関係を確認します。',
    learningGoal: '分詞の長さと意味上の修飾先を見て、前置・後置の基本を説明できるようにする。',
    steps: [
      { id: 'PART-L3-STEP-01', interactionType: 'modifier-positioner', problemId: 'PART-L3-P001-POSITION', title: '分詞1語を前に置く', instruction: 'glowing を lamp の前に置きます。' },
      { id: 'PART-L3-STEP-02', interactionType: 'modifier-positioner', problemId: 'PART-L3-P002-POSITION', title: '分詞句を後ろに置く', instruction: 'glowing near the window を lamp の後ろに置きます。' },
      { id: 'PART-L3-STEP-03', interactionType: 'modifier-connection-viewer', problemId: 'PART-L3-P003-REL', title: '位置が変わっても関係を見る', instruction: '後置された分詞句と target noun の関係を確認します。' },
      { id: 'PART-L3-STEP-04', interactionType: 'sentence-comparison', problemId: 'PART-L3-P004-COMPARE', title: '1語と分詞句を比べる', instruction: '語数と位置の基本を比較し、絶対規則にしないことを確認します。' },
    ],
  },
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
