export const lesson6Content = {
  lessonId: 'PART-L6',
  introduction: '最後は新しい文法事項を増やさず、ここまでの判断手順を初見の英文にあてはめます。分詞、説明対象、元の動詞、関係、位置、文脈を順に確認し、形だけでなく理由まで短く説明できるようにします。',
  sections: [
    {
      id: 'PART-L6-EXPLAIN-01',
      title: '8段階の最終判断',
      paragraphs: [
        '初見の英文では、次の8段階を順番に使います。①分詞を見つける。②説明される名詞を探す。③分詞を元の動詞に戻す。④名詞が「する／される」かを考える。⑤能動／受動／完了を決める。⑥ -ing / p.p.を選ぶ。⑦前置／後置を確認する。⑧文脈を確認する。',
        'この手順は、すべてを一度に推測するためのものではありません。まずは名詞と動詞の関係を捉え、必要なら完了や感情の向きを考えます。位置や訳の確認を最後に回せば、直前の語や語尾に惑わされにくくなります。',
      ],
      examples: [
        { id: 'L6-EX-01', english: 'The fallen branches blocked the path after the storm.', translation: '落ちた枝が嵐の後で道をふさいだ。', structure: 'branches → fall → completion → fallen', point: 'fall は自動詞で、落下が完了した状態を表します。fallen は branches を前から説明します。' },
        { id: 'L6-EX-02', english: 'The report prepared for new staff explains the safety rules.', translation: '新しい職員向けに用意された報告書が安全規則を説明する。', structure: 'report → prepare → passive → prepared', point: 'report は prepare される側です。' },
      ],
      callouts: [
        { kind: 'RULE', text: '①分詞 → ②名詞 → ③元動詞 → ④関係 → ⑤意味軸 → ⑥形 → ⑦位置 → ⑧文脈。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: '分詞判断の手順とHidden S-V' },
      ],
    },
    {
      id: 'PART-L6-EXPLAIN-02',
      title: '構造と文脈をつなぐ',
      paragraphs: [
        '同じ -ing / p.p.でも、名詞と動詞の関係が変われば働きも変わります。The athlete running near the finish line なら athlete が run する能動関係です。The painting displayed in the hallway なら painting が display される受動関係です。形を見てから理由を後づけするのではなく、関係から形を導きます。',
        '感情動詞では、文全体の意味も確認します。The lecture was interesting は講義が感情を与える側、The students were interested は学生が感情を受ける側です。初見問題で大切なのは、正解の語尾を当てることだけでなく、どの名詞がどの動詞とどんな関係にあるかを言えることです。',
      ],
      examples: [
        { id: 'L6-EX-03', english: 'The athlete running near the finish line received help.', translation: 'ゴール付近を走っている選手は助けを受けた。', structure: 'athlete → run → active → running', point: 'athlete が run する側です。' },
        { id: 'L6-EX-04', english: 'The painting displayed in the hallway attracts visitors.', translation: '廊下に展示された絵が訪問者を引きつける。', structure: 'painting → display → passive → displayed', point: 'painting は display される側です。' },
        { id: 'L6-EX-05', english: 'The lecture was interesting, and the students were interested.', translation: 'その講義は興味深く、学生たちは興味を持った。', structure: 'lecture → give interest / students → receive interest', point: '同じ interest でも、与える側か受ける側かで形が変わります。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: '構造から能動・受動を判定する' },
        { source: 'chapter14-ocr.md', heading: '14-2-1', lineStart: 350, lineEnd: 414, concept: '感情動詞の与える・受ける関係' },
      ],
    },
    {
      id: 'PART-L6-EXPLAIN-03',
      title: '初見英文で理由まで答える',
      paragraphs: [
        '選択問題では、空所の直前だけを見てはいけません。分詞が修飾する名詞を見つけ、元の動詞に戻し、能動・受動・完了のどれかを決めます。分詞句の位置や文脈に違和感があれば、もう一度名詞との関係に戻って考え直します。',
        '最後に「何が何をする／されるから、この形になる」と一文で言えれば、他の問題にも応用できます。間違えた問題も、選択肢ごとの解説を読んで思い込みを一つ修正すれば、次の初見英文に生かせます。',
      ],
      examples: [
        { id: 'L6-EX-06', english: 'The visitors were amazed by the carefully designed exhibit.', translation: '訪問者は丁寧に設計された展示に驚いた。', structure: 'visitors → receive amazement / exhibit → design → passive', point: '感情の受け手と、展示を説明する受動の分詞を区別して読みます。' },
      ],
      callouts: [
        { kind: 'POINT', text: '答えの形だけで終わらせず、target noun・base verb・関係・理由を短く言い直します。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: '初見英文で説明対象と元動詞を特定する' },
      ],
    },
  ],
  keyRules: [
    '分詞 → 説明対象 → 元動詞 → 「する／される・完了」の関係を順に確認する。',
    '関係から -ing / p.p.を選び、前置／後置と文脈を最後に確認する。',
    '正答だけでなく、名詞・動詞・関係・理由を説明できる状態を目指す。',
  ],
  commonMistakes: [
    '空所の直前の語だけを見て判断する。',
    '訳や「人・物」、語尾などの一つの条件だけで形を決める。',
    '正解を選んだだけで、名詞と元動詞の関係まで説明しない。',
  ],
  examPoints: [
    '8段階を飛ばさず、特に説明対象と元動詞を先に確定する。',
    '自動詞の p.p.は完了・結果状態を確認する。',
    '感情動詞は与える側・受ける側を文脈で決める。',
  ],
  summary: [
    '名詞と元動詞の関係を中心に判断する。',
    '能動／受動／完了を分けて形を選ぶ。',
    '初見の英文でも判断理由を一文で説明する。',
  ],
  detailedReview: [
    { title: '総合判断の振り返り', paragraphs: ['問題ごとに、target noun、base verb、active / passive / completion、position、context を確認します。間違えた場合も、名詞と動詞の正しい関係を言葉にできれば復習になります。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', heading: '14-1-3', lineStart: 281, lineEnd: 312, concept: 'Hidden S-Vを使った能動・受動の判断' },
    { source: 'chapter14-ocr.md', heading: '14-2-1', lineStart: 350, lineEnd: 414, concept: '感情動詞の与える・受ける関係' },
    { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 170, lineEnd: 180, concept: '自動詞p.p.の完了・結果状態' },
  ],
};
