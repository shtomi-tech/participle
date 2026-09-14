export const lesson3Content = {
  lessonId: 'PART-L3',
  introduction: '分詞が名詞の前にあるか、後ろにあるかを、語数だけで機械的に決めないようにします。分詞1語と分詞を中心とするまとまりを比べ、最後は説明対象と意味のまとまりで判断します。',
  sections: [
    {
      id: 'PART-L3-EXPLAIN-01',
      title: '分詞1語の前置修飾',
      paragraphs: [
        '分詞が単独で名詞を説明する場合、まず名詞の前に置く形を基本パターンとして覚えます。a sleeping baby では sleeping が baby の前にあり、短い性質や状態を名詞へ付けています。分詞の形を先に訳すのではなく、分詞と名詞を一つの名詞句として読みます。',
        '前置修飾は、一般的な性質や、その名詞を見分ける目印のように感じられることがあります。ただし、前置だからいつも永久的、後置だからいつも一時的、と固定する必要はありません。位置は意味と文脈を読む手がかりの一つです。',
      ],
      examples: [
        { id: 'L3-EX-01', english: 'a sleeping baby', translation: '眠っている赤ちゃん', structure: 'sleeping + baby', point: '分詞1語を名詞の前に置く基本例です。' },
        { id: 'L3-EX-02', english: 'the used car', translation: 'その中古車', structure: 'used + car', point: 'used は car を前から説明しています。' },
      ],
      callouts: [
        { kind: 'RULE', text: '分詞1語は、まず名詞の前から修飾する基本パターンとして読む。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 200, lineEnd: 215, concept: '分詞1語の前置修飾' },
      ],
    },
    {
      id: 'PART-L3-EXPLAIN-02',
      title: '分詞句の後置修飾',
      paragraphs: [
        '分詞がほかの語句を伴って長いまとまりになると、そのまとまりを名詞の後ろへ置くことが多くなります。a baby sleeping on the sofa では sleeping on the sofa 全体が baby を説明します。名詞の後ろに置くことで、どのような場面でその動作が起きているのかを具体的に追加できます。',
        '後置修飾では、分詞だけでなく、前置詞句や目的語などを含む全体が修飾語です。the car used by Jun なら used by Jun が car にかかります。分詞のすぐ隣の語だけを対象にせず、まとまりの終わりまで見ます。',
      ],
      examples: [
        { id: 'L3-EX-03', english: 'a baby sleeping on the sofa', translation: 'ソファで眠っている赤ちゃん', structure: 'a baby ← sleeping on the sofa', point: 'sleeping on the sofa 全体が baby を後ろから説明します。' },
        { id: 'L3-EX-04', english: 'the car used by Jun', translation: 'ジュンが使う車', structure: 'the car ← used by Jun', point: 'used by Jun は car が使われる受動関係です。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 208, lineEnd: 243, concept: '分詞句の後置修飾と修飾対象' },
      ],
    },
    {
      id: 'PART-L3-EXPLAIN-03',
      title: '「1語なら必ず前」ではない',
      paragraphs: [
        '「1語なら前、2語以上なら後ろ」は、最初に読むための便利な目安です。しかし、1語の分詞が名詞の後ろに来ることもあります。the girl dancing のように、今まさに踊っている女の子を文脈で特定する場合です。語数の目安を絶対規則にしないでください。',
        '最終的には、分詞がどの名詞を説明しているか、どんな一時的・具体的な場面か、文全体が自然かを確認します。この確認は次のHidden S-Vへつながります。位置だけで迷ったら、分詞を元動詞へ戻し、名詞との関係を作り直します。',
      ],
      examples: [
        { id: 'L3-EX-05', english: 'Hikaru is the girl dancing.', translation: 'ヒカルは、踊っている女の子です。', structure: 'the girl ← dancing', point: 'dancing は1語の後置修飾です。over there や on the stage を足すと、分詞句全体が後置されます。' },
      ],
      callouts: [
        { kind: 'CAUTION', text: '「1語 = 必ず前」は絶対規則ではありません。語数は入口の目安で、修飾関係と文脈が優先です。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 222, lineEnd: 274, concept: '1語の分詞が後置される例と文脈' },
      ],
    },
  ],
  keyRules: [
    '分詞1語は、まず名詞の前に置く基本パターンで読む。',
    '分詞を中心とするまとまりは、名詞の後ろから修飾することが多い。',
    '位置と語数は目安であり、説明対象・意味・文脈を優先する。',
  ],
  commonMistakes: [
    '分詞はいつも名詞の後ろに置く。',
    '1語なら必ず前、2語以上なら必ず後ろと暗記する。',
    '分詞句の一部だけを見て修飾対象を決める。',
  ],
  examPoints: [
    '分詞句の終わりまでを一つのまとまりとして囲む。',
    '位置に迷ったら、説明対象の名詞と元動詞の関係へ戻る。',
  ],
  summary: [
    '分詞1語 → 前置修飾が基本。',
    '分詞を含むまとまり → 後置修飾が基本。',
    '語数は目安、修飾関係が本体。',
  ],
  detailedReview: [
    { title: '位置の振り返り', paragraphs: ['前後の位置を決める前に、分詞を含むまとまりと説明対象を確認します。語数の目安に合わないときも、文脈とHidden S-Vで説明できれば判断できます。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 200, lineEnd: 274, concept: '分詞の前置修飾・後置修飾と1語の例外' },
    { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 222, lineEnd: 243, concept: '後置位置による一時的・具体的な読み' },
  ],
};
