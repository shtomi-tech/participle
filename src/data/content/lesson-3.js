export const lesson3Content = {
  lessonId: 'PART-L3',
  introduction: '分詞を名詞の前と後ろのどちらに置くかは、語数だけで機械的に決めないようにします。分詞1語か、まとまり（句）かを比べながら、修飾する相手と意味のまとまりで判断しましょう。',
  sections: [
    {
      id: 'PART-L3-EXPLAIN-01',
      title: '分詞1語の前置修飾',
      paragraphs: [
        '分詞が単独で名詞を説明する場合、名詞の前に置く形が基本です。a sleeping baby では sleeping が baby の前に置かれ、短い性質や状態を表しています。分詞だけを先に訳すのではなく、分詞と名詞を一つの名詞句として読みます。',
        '前置修飾は、一般的な性質や、その名詞を見分ける目印のように働くことがあります。ただし、「前置＝永久的」「後置＝一時的」と決めつける必要はありません。位置は意味や文脈をつかむ手がかりの一つです。',
      ],
      examples: [
        { id: 'L3-EX-01', english: 'a sleeping baby', translation: '眠っている赤ちゃん', structure: 'sleeping + baby', point: '分詞1語を名詞の前に置く基本の形です。' },
        { id: 'L3-EX-02', english: 'the used car', translation: 'その中古車', structure: 'used + car', point: 'used が car を前から修飾しています。' },
      ],
      callouts: [
        { kind: 'RULE', text: '分詞1語は、まず名詞の前から修飾する形を基本パターンとして読む。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 200, lineEnd: 215, concept: '分詞1語の前置修飾' },
      ],
    },
    {
      id: 'PART-L3-EXPLAIN-02',
      title: '分詞句の後置修飾',
      paragraphs: [
        '分詞がほかの語句を伴ってまとまりを作るときは、名詞の後ろに置くことが多くなります。a baby sleeping on the sofa では sleeping on the sofa 全体が baby を修飾します。名詞の後ろに置くことで、どんな場面でその動作が起きているのかを具体的に付け足せます。',
        '後置修飾では、分詞だけでなく、前置詞句や目的語まで含めた全体が修飾語になります。the car used by Jun なら used by Jun 全体が car にかかります。分詞の直後の語だけで区切らず、まとまりの終わりまで確認しましょう。',
      ],
      examples: [
        { id: 'L3-EX-03', english: 'a baby sleeping on the sofa', translation: 'ソファで眠っている赤ちゃん', structure: 'a baby ← sleeping on the sofa', point: 'sleeping on the sofa 全体が baby を後ろから修飾しています。' },
        { id: 'L3-EX-04', english: 'the car used by Jun', translation: 'ジュンが使う車', structure: 'the car ← used by Jun', point: 'used by Jun は car が使われる受動の関係を表しています。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 208, lineEnd: 243, concept: '分詞句の後置修飾と修飾対象' },
      ],
    },
    {
      id: 'PART-L3-EXPLAIN-03',
      title: '「1語なら必ず前」ではない',
      paragraphs: [
        '「1語なら前、2語以上なら後ろ」は便利な目安ですが、絶対のルールではありません。1語の分詞が名詞の後ろに来ることもあります。たとえば the girl dancing のように、今まさに踊っている女の子を文脈の中で特定する場合です。語数の目安を絶対視しないようにしましょう。',
        '大切なのは、分詞がどの名詞を修飾しているか、どんな具体的な場面か、文全体として自然かを確認することです。この考え方は次のHidden S-Vにもつながります。位置に迷ったら、分詞を元の動詞に戻し、名詞との関係を捉え直してみましょう。',
      ],
      examples: [
        { id: 'L3-EX-05', english: 'Hikaru is the girl dancing.', translation: 'ヒカルは、踊っている女の子です。', structure: 'the girl ← dancing', point: 'dancing は1語で後ろから修飾しています。over there や on the stage を足すと、分詞句全体が後ろに置かれます。' },
      ],
      callouts: [
        { kind: 'CAUTION', text: '「1語＝必ず前」は絶対の規則ではありません。語数はあくまで目安であり、修飾関係と文脈を優先します。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 222, lineEnd: 274, concept: '1語の分詞が後置される例と文脈' },
      ],
    },
  ],
  keyRules: [
    '分詞1語は、まず名詞の前に置く形を基本として読む。',
    '分詞を中心とするまとまりは、名詞の後ろから修飾することが多い。',
    '位置や語数は目安であり、修飾される名詞・意味・文脈を優先する。',
  ],
  commonMistakes: [
    '分詞はいつも名詞の後ろに置くと思い込む。',
    '1語なら必ず前、2語以上なら必ず後ろと機械的に暗記する。',
    '分詞句の一部だけを見て修飾対象を決めてしまう。',
  ],
  examPoints: [
    '分詞句の終わりまでを一つのまとまりとしてカッコで囲む。',
    '位置に迷ったら、修飾される名詞と元の動詞との関係に戻って考える。',
  ],
  summary: [
    '分詞1語 → 前置修飾が基本。',
    '分詞を含むまとまり → 後置修飾が基本。',
    '語数は目安、修飾関係が本体。',
  ],
  detailedReview: [
    { title: '位置の振り返り', paragraphs: ['前後の位置を決める前に、分詞を含むまとまりと修飾する名詞を確認します。語数の目安に合わない場合でも、文脈とHidden S-Vを意識すれば正しく判断できます。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 200, lineEnd: 274, concept: '分詞の前置修飾・後置修飾と1語の例外' },
    { source: 'chapter14-ocr.md', heading: '14-1-2', lineStart: 222, lineEnd: 243, concept: '後置位置による一時的・具体的な読み' },
  ],
};
