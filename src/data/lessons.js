export const lessons = [
  {
    id: 'PART-L1',
    slug: 'participle-basics',
    label: 'Lesson 1',
    title: '分詞とは何か',
    description: '分詞は動詞由来で、名詞を説明する形容詞的な働きを持つことを確認します。',
    learningGoal: '分詞を見たら、元の動詞と、説明される名詞を見つけられるようにする。',
    steps: [
      { id: 'PART-L1-STEP-01', interactionType: 'sentence-comparison', problemId: 'PART-L1-P004-COMPARE', title: '形容詞と分詞を比べる', instruction: 'quiet と smiling を比べ、どちらも child を説明することを確認します。' },
      { id: 'PART-L1-STEP-02', interactionType: 'mark-parts', problemId: 'PART-L1-P001-MARK', title: '分詞が説明する名詞を見つける', instruction: 'glowing が説明している名詞を選びます。' },
      { id: 'PART-L1-STEP-03', interactionType: 'grammar-classifier', problemId: 'PART-L1-P002-CLASS', title: '語句の役割を分類する', instruction: '一般の形容詞、分詞、名詞、動詞を分類します。' },
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
      { id: 'PART-L2-STEP-01', interactionType: 'sentence-comparison', problemId: 'PART-L2-P001-COMPARE', title: '能動と受動を比べる', instruction: 'barking dog と broken window の意味関係を比較します。' },
      { id: 'PART-L2-STEP-02', interactionType: 'grammar-classifier', problemId: 'PART-L2-P002-CLASS', title: '意味軸で分類する', instruction: '能動・受動・完了のどれにあたるかを分類します。' },
      { id: 'PART-L2-STEP-03', interactionType: 'error-corrector', problemId: 'PART-L2-P003-ERROR', title: '受動の形を訂正する', instruction: 'language が speak される関係に合う形を選びます。' },
      { id: 'PART-L2-STEP-04', interactionType: 'sentence-comparison', problemId: 'PART-L2-P004-COMPARE', title: '完了と受動を区別する', instruction: 'broken と fallen を名詞修飾の例として比べます。' },
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
      { id: 'PART-L3-STEP-03', interactionType: 'sentence-comparison', problemId: 'PART-L3-P004-COMPARE', title: '1語後置の可能性を比べる', instruction: 'the dancing girl と the girl dancing を比べ、1語後置も文脈次第で可能だと確認します。' },
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
      { id: 'PART-L4-STEP-01', interactionType: 'mark-parts', problemId: 'PART-L4-P001-MARK', title: '能動の分詞が説明する名詞を見つける', instruction: 'まず、smiling at her mother が説明している名詞を選びます。まだ形は決めません。' },
      { id: 'PART-L4-STEP-02', interactionType: 'modifier-connection-viewer', problemId: 'PART-L4-P001-REL', title: 'the baby → smile を確認する', instruction: '関係カードを選び、the baby が smile する能動関係と smiling を確認します。' },
      { id: 'PART-L4-STEP-03', interactionType: 'mark-parts', problemId: 'PART-L4-P002-MARK', title: '受動の分詞が説明する名詞を見つける', instruction: 'spoken in that country が説明している名詞を選びます。訳だけで形を決めません。' },
      { id: 'PART-L4-STEP-04', interactionType: 'modifier-connection-viewer', problemId: 'PART-L4-P002-REL', title: 'the language ← speak を確認する', instruction: '関係カードを選び、the language が speak される受動関係と spoken を確認します。' },
      { id: 'PART-L4-STEP-05', interactionType: 'mark-parts', problemId: 'PART-L4-P003-MARK', title: '隣の語に惑わされず対象を選ぶ', instruction: 'reading quietly のすぐ前にある語ではなく、意味上説明される名詞を選びます。' },
      { id: 'PART-L4-STEP-06', interactionType: 'modifier-connection-viewer', problemId: 'PART-L4-P003-REL', title: '長い名詞句のHidden S-Vを確認する', instruction: '関係カードを選び、the students → read が reading の根拠になることを確認します。' },
    ],
  },
  {
    id: 'PART-L5',
    slug: 'emotion-verbs',
    label: 'Lesson 5',
    title: '感情動詞',
    description: '感情動詞を「〜させる」という元の方向から捉え、-ing / -ed の意味を判断します。',
    learningGoal: '感情を与える側なら -ing、感情を受ける側なら -ed / p.p. と説明できるようにする。',
    steps: [
      { id: 'PART-L5-STEP-01', interactionType: 'sentence-comparison', problemId: 'PART-L5-P002-COMPARE', title: '感情を与える側・受ける側を比べる', instruction: 'exciting と excited を比べ、まず感情の向きを確認します。' },
      { id: 'PART-L5-STEP-02', interactionType: 'grammar-classifier', problemId: 'PART-L5-P001-GIVER-RECEIVER', title: '与え手と受け手を分類する', instruction: '人・物ではなく、感情を起こす側か受ける側かで分類します。' },
      { id: 'PART-L5-STEP-03', interactionType: 'sentence-comparison', problemId: 'PART-L5-P003-COMPARE-BORING', title: '人が主語の-ingを確認する', instruction: 'He is boring と He is bored を比べ、主語が人でも与え手なら -ing になることを確認します。' },
      { id: 'PART-L5-STEP-04', interactionType: 'context-grammar', problemId: 'PART-L5-P004-CONTEXT', title: '会話の中で感情表現を選ぶ', instruction: '場面から与え手・受け手を判断し、会話を進めます。' },
    ],
  },
  {
    id: 'PART-L6',
    slug: 'integrated-judgment',
    label: 'Lesson 6',
    title: '総合判断',
    description: '同じ初見英文を、説明対象・元動詞・関係・形・位置の順に最後まで処理します。',
    learningGoal: '分詞を見たら、名詞と動詞の関係を中心に、形と位置の判断理由を短く説明できるようにする。',
    steps: [
      { id: 'PART-L6-STEP-01', interactionType: 'mark-parts', problemId: 'PART-L6-IC-001-MARK', title: 'Target nounを特定する', instruction: 'prepared for new staff が説明している名詞を選びます。まだ形は判断しません。' },
      { id: 'PART-L6-STEP-02', interactionType: 'modifier-connection-viewer', problemId: 'PART-L6-IC-002-REL', title: 'Hidden S-Vを確認する', instruction: 'report と prepare の関係を作り、report is prepared という受動を確認します。' },
      { id: 'PART-L6-STEP-03', interactionType: 'error-corrector', problemId: 'PART-L6-IC-003-FORM', title: '分詞の形を決める', instruction: 'report が prepare される関係から、preparing を prepared に直します。' },
      { id: 'PART-L6-STEP-04', interactionType: 'modifier-positioner', problemId: 'PART-L6-IC-004-POSITION', title: '分詞句の位置を決める', instruction: 'prepared for new staff という分詞句を report の後ろに置きます。' },
    ],
  },
];

export function getLessonBySlug(slug) {
  return lessons.find((lesson) => lesson.slug === slug);
}
