export const lesson2Content = {
  lessonId: 'PART-L2',
  introduction: '-ing と p.p. は、名前に「現在」「過去」とついていても、時制を表すわけではありません。修飾される名詞が元の動詞を「する」のか、「される」のか、あるいは「変化が完了した状態」なのかを順に考えます。',
  sections: [
    {
      id: 'PART-L2-EXPLAIN-01',
      title: '現在分詞・過去分詞という名前',
      paragraphs: [
        '-ing を現在分詞、p.p.を過去分詞と呼びます。しかし、「現在分詞だから現在」「過去分詞だから過去」と考えてはいけません。現在・過去という名前は形の呼び名であり、時制を直接決めるものではないからです。',
        '名詞を修飾するとき、まず見るべきなのは名詞と分詞の意味関係です。名詞が動作をする側なら能動、受ける側なら受動になります。時間の情報が必要なときだけ、進行中なのか、完了した状態なのかを追加で確認します。',
      ],
      examples: [
        { id: 'L2-EX-01', english: 'a barking dog', translation: 'ほえている犬', structure: 'the dog barks → active → barking', point: 'dog が bark する側なので -ing です。' },
        { id: 'L2-EX-02', english: 'a broken window', translation: '壊された窓／壊れた窓', structure: 'someone broke the window → the window was broken', point: 'window は壊す動作を受ける側なので p.p. です。' },
      ],
      callouts: [
        { kind: 'RULE', text: '現在分詞 ≠ 現在時制、過去分詞 ≠ 過去時制。まずは名詞と元の動詞の関係を確認します。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 120, lineEnd: 123, concept: '現在分詞・過去分詞という名称' },
      ],
    },
    {
      id: 'PART-L2-EXPLAIN-02',
      title: '能動・受動で形を選ぶ',
      paragraphs: [
        '「名詞が動詞をする」という文を作って自然なら、能動の関係なので -ing を使います。barking dog なら the dog barks と言えます。一方、「名詞が動詞をされる」となるなら受動の関係なので p.p.を使います。broken window なら the window was broken です。',
        '日本語で「〜している」と訳せても、英語の関係が受動なら p.p.になります。たとえば「その国で話されている言語」は、language が speak するのではなく speak される側なので spoken です。日本語の訳の語尾だけで形を決めないことが重要です。',
      ],
      examples: [
        { id: 'L2-EX-03', english: 'the language spoken in that country', translation: 'その国で話されている言語', structure: 'the language is spoken → passive → spoken', point: '「話している」という日本語の印象にとらわれず、language が話される関係を見ます。' },
        { id: 'L2-EX-04', english: 'students coming from abroad', translation: '海外から来る学生たち', structure: 'students come → active → coming', point: 'students が come する側なので coming です。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 120, lineEnd: 140, concept: '能動・受動関係による-ing / p.p.の選択' },
      ],
    },
    {
      id: 'PART-L2-EXPLAIN-03',
      title: 'p.p.の完了・結果状態',
      paragraphs: [
        'p.p.だからといって、必ず受動になるとは限りません。自動詞は目的語をとらないため、ふつう受動態にできません。そうした動詞の p.p.が名詞を修飾するときは、動作や変化が完了した「結果の状態」を表すことがあります。',
        'fallen leaves は「落とされた葉」ではなく、落ちる変化が終わった「落ち葉」です。grown children も「成長させられた子ども」という受動ではなく、「成長した後の子どもたち」を表します。まずは能動・受動の基本を押さえ、その上で完了・結果状態も候補に加えます。',
      ],
      examples: [
        { id: 'L2-EX-05', english: 'fallen leaves', translation: '落ち葉', structure: 'leaves fall → change completed → fallen', point: 'fall は自動詞なので、ここでは受動ではなく完了・結果状態です。' },
        { id: 'L2-EX-06', english: 'grown children', translation: '成長した子どもたち', structure: 'children grow → growth completed → grown', point: 'grown は成長後の状態を表します。' },
        { id: 'L2-EX-07', english: 'a retired teacher', translation: '退職した教師', structure: 'the teacher retired → change completed → retired', point: 'retire の変化が完了した結果の状態を表します。' },
      ],
      callouts: [
        { kind: 'CAUTION', text: '自動詞の p.p.は、受動ではなく完了・結果状態を表すことがあります。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 170, lineEnd: 180, concept: '自動詞由来のp.p.と完了・結果状態' },
      ],
    },
  ],
  keyRules: [
    '現在分詞・過去分詞という名称を、現在時制・過去時制と混同しない。',
    '名詞がする → 能動 → -ing。名詞がされる → 受動 → p.p.。',
    '自動詞の p.p.は、完了・結果状態を表すことがある。',
  ],
  commonMistakes: [
    '現在分詞は現在、過去分詞は過去だと思い込む。',
    'p.p.を見たら必ず受動だと思い込む。',
    '「〜している」という訳だけで -ing を選ぶ。',
  ],
  examPoints: [
    '空所では、名詞が元の動詞を「する／される」のどちらなのか、短い英文に戻して考える。',
    '自動詞なら受動にできるかを確認し、完了・結果状態も候補に入れる。',
  ],
  summary: [
    '名称と時制を分ける。',
    'する → -ing、される → p.p.。',
    'p.p.には完了・結果状態もある。',
  ],
  detailedReview: [
    { title: '形を決める順序', paragraphs: ['名詞を主語にして元の動詞へ戻し、能動か受動かを確認します。受動にできない自動詞なら、変化が完了した状態という読みを検討します。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 120, lineEnd: 180, concept: '-ing / p.p.の意味軸と自動詞p.p.の完了・結果状態' },
    { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: '名詞と分詞の能動・受動関係' },
  ],
};
