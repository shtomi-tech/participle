export const lesson4Content = {
  lessonId: 'PART-L4',
  introduction: '分詞を選ぶときの中心は、名詞と元動詞の間にあるHidden S-Vです。表面には主語と動詞が並んでいなくても、名詞が動作をするのか、されるのかを復元すれば、-ing / p.p. の根拠を説明できます。',
  sections: [
    {
      id: 'PART-L4-EXPLAIN-01',
      title: '名詞と分詞の間にあるHidden S-V',
      paragraphs: [
        'the girl standing by the door の standing は、単に「立っている」と訳して終わる語ではありません。standing by the door が説明している名詞は the girl です。そこで、分詞を元の動詞 stand に戻し、the girl stands by the door という意味上のS-Vを作ります。',
        'このS-Vは、実際の文に独立した主語・動詞として書かれているわけではありません。だからHidden S-Vと呼びます。分詞を見たら、分詞と結び付く名詞を見つけ、その名詞を仮の主語にして短い文を作ることが判断の出発点です。',
      ],
      examples: [
        { id: 'L4-EX-01', english: 'the girl standing by the door', translation: 'ドアのそばに立っている少女', structure: 'the girl → stand → the girl stands', point: 'girl が stand するので能動関係です。' },
        { id: 'L4-EX-02', english: 'the language spoken in that country', translation: 'その国で話されている言語', structure: 'the language → speak → the language is spoken', point: 'language が speak されるので受動関係です。' },
      ],
      callouts: [
        { kind: 'POINT', text: '分詞の形を先に決めず、名詞を主語にしたHidden S-Vを復元します。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '281-295', concept: 'Hidden S-Vと修飾対象の復元' },
      ],
    },
    {
      id: 'PART-L4-EXPLAIN-02',
      title: '能動なら -ing、受動なら p.p.',
      paragraphs: [
        'Hidden S-Vが「名詞が元動詞をする」なら能動です。the baby smiling at her mother では、the baby smiles at her mother と作れるので smiling を使います。名詞が動作主であることが、-ing の理由です。',
        '一方、Hidden S-Vが「名詞が元動詞をされる」なら受動です。the language spoken in that country では、language が speak するのではなく、language is spoken です。「話している言語」のような訳の表面に引っ張られず、名詞を主語にした関係を確認します。',
      ],
      examples: [
        { id: 'L4-EX-03', english: 'the baby smiling at her mother', translation: '母親にほほえみかけている赤ちゃん', structure: 'the baby smiles → active → smiling', point: 'baby が smile する側です。' },
        { id: 'L4-EX-04', english: 'the songs played at the festival', translation: 'その祭りで演奏された曲', structure: 'the songs are played → passive → played', point: 'songs は play される側です。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '296-304', concept: 'Hidden S-Vによる能動・受動の判別' },
      ],
    },
    {
      id: 'PART-L4-EXPLAIN-03',
      title: 'Hidden S-Vの6ステップ',
      paragraphs: [
        '入試の空所では、次の順序を固定すると迷いにくくなります。STEP 1 分詞を見つける。STEP 2 その分詞が説明する名詞を探す。STEP 3 分詞を元動詞へ戻す。STEP 4 「名詞が〜する／される」を作る。STEP 5 自然にする側なら能動で -ing。STEP 6 される側なら受動で p.p.です。',
        '語順が長くなっても、判断の核は同じです。the students in the front row reading quietly なら、reading quietly の説明対象は直前の front row ではなく the students です。まず名詞句の中心を見つけ、students read quietly という関係を作ります。',
      ],
      examples: [
        { id: 'L4-EX-05', english: 'the students in the front row reading quietly', translation: '前列で静かに読んでいる生徒たち', structure: 'the students → read → active → reading', point: '隣の front row ではなく、意味上の主語 students と結び付けます。' },
      ],
      callouts: [
        { kind: 'RULE', text: 'STEP 1 分詞 → STEP 2 名詞 → STEP 3 元動詞 → STEP 4 S-V → STEP 5/6 能動・受動と形。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '281-312', concept: 'Hidden S-Vの判断手順' },
      ],
    },
  ],
  keyRules: [
    '分詞と説明対象の名詞の間には、意味上のS-V関係がある。',
    '名詞がする → 能動 → -ing。名詞がされる → 受動 → p.p.。',
    '分詞を見つける → 名詞を探す → 元動詞へ戻す → S-Vを作る。',
  ],
  commonMistakes: [
    '分詞の直前にある語を機械的に主語にする。',
    '日本語訳の「〜している」だけで -ing にする。',
    '分詞を元動詞へ戻さず、語尾だけで判断する。',
  ],
  examPoints: [
    '空所の前後だけでなく、分詞が説明する名詞まで戻って確認する。',
    '「名詞が〜する／される」の短い文を頭の中で作る。',
    '次のLesson以降でも、この6ステップを繰り返し使う。',
  ],
  summary: [
    '分詞と名詞の間にHidden S-Vがある。',
    'するなら -ing、されるなら p.p.。',
    '隣の語ではなく、意味上の主語を探す。',
  ],
  detailedReview: [
    { title: 'Hidden S-Vの振り返り', paragraphs: ['正解の形だけでなく、target noun と base verb を言えるか確認します。the songs → play → passive → played のように、関係を一行で説明できれば判断が安定しています。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', section: '281-312', concept: '名詞と分詞のHidden S-V、能動・受動による形の判別' },
    { source: 'chapter14-ocr.md', section: '208-215', concept: '分詞句と修飾対象の名詞' },
  ],
};
