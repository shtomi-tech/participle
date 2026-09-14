export const lesson1Content = {
  lessonId: 'PART-L1',
  introduction: '分詞は動詞から生まれた形ですが、今回の中心用法では形容詞のように名詞を説明します。まずは「分詞を見たら、何を説明しているかを確かめる」という読み方を身につけましょう。',
  sections: [
    {
      id: 'PART-L1-EXPLAIN-01',
      title: '分詞とは何か',
      paragraphs: [
        '分詞は「動詞から分かれた詞」という名前のとおり、動詞からできた形です。ただし名詞を説明するときは、文の動詞として時制を示すのではなく、形容詞のように働きます。まずは「何形か」と焦らず、「どの名詞を説明しているか」を探してください。',
        '形容詞の基本的な役割は、名詞の性質を説明することです。分詞も同じように名詞の前後に置かれ、動作や状態を名詞に結びつけます。分詞を読むときは、単独の訳を覚えるのではなく、分詞と名詞をひとまとまりのセットとして捉えるとスムーズです。',
      ],
      examples: [
        { id: 'L1-EX-01', english: 'a cute baby', translation: 'かわいらしい赤ちゃん', structure: 'cute → baby', point: 'cute はふつうの形容詞で、baby の性質を説明しています。' },
        { id: 'L1-EX-02', english: 'a smiling baby', translation: 'ほほえんでいる赤ちゃん', structure: 'smiling → smile 由来 → baby', point: 'smiling は動詞 smile からできた分詞で、baby を説明しています。' },
      ],
      callouts: [
        { kind: 'POINT', text: '分詞は動詞からできた形ですが、名詞を説明するときは形容詞のように働きます。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 100, lineEnd: 108, concept: '分詞の定義と形容詞的用法' },
      ],
    },
    {
      id: 'PART-L1-EXPLAIN-02',
      title: '形容詞と同じ場所で働く',
      paragraphs: [
        '形容詞は名詞を修飾するだけでなく、be動詞の後ろで主語を説明する補語にもなります。分詞も同様です。ただし The girl is dancing. の dancing は be + -ing の進行形と考えるのが自然で、このLessonで扱う名詞修飾の典型ではありません。ここでは細かい文法用語よりも「何を説明しているか」を優先しましょう。',
        '名詞修飾では、分詞が名詞の前に置かれる形から始めます。a smiling baby では smiling が baby を説明しています。分詞の位置や -ing / p.p. の選び方は次のLessonで扱いますが、どのLessonでも最初に説明対象を確認する習慣は変わりません。',
      ],
      examples: [
        { id: 'L1-EX-03', english: 'The girl is tired.', translation: 'その少女は疲れています。', structure: 'The girl → is tired', point: 'tired は be動詞の後ろで主語 girl を説明する形容詞です。-ing を見ても、まずは文全体の動詞なのか名詞修飾なのかを確かめましょう。' },
        { id: 'L1-EX-04', english: 'Look at the glowing lamp.', translation: '光っているランプを見て。', structure: 'glowing → lamp', point: 'glowing は glow からできた形で、lamp を説明する分詞です。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 108, lineEnd: 119, concept: '補語と名詞修飾の働き' },
      ],
    },
    {
      id: 'PART-L1-EXPLAIN-03',
      title: '今回扱う範囲',
      paragraphs: [
        '分詞には副詞のように働く分詞構文もありますが、今回は深く扱いません。最初から両方を混ぜると、分詞がどの名詞を説明しているか見えにくくなるからです。まずは名詞修飾と補語を中心に、分詞を形容詞として読む練習をしましょう。',
        'このLessonのゴールは、分詞を見つけたときに「動詞の一部」とだけ考えず、説明対象の名詞を言えるようになることです。たとえば smiling baby なら、smiling の意味を baby に結びつけます。次のLesson以降で、能動・受動の違いや位置を判断していきましょう。',
      ],
      examples: [
        { id: 'L1-EX-05', english: 'The child smiling by the window waved.', translation: '窓のそばでほほえんでいる子どもが手を振りました。', structure: 'smiling by the window → the child', point: '分詞のまとまりが長くても、まずは説明される名詞を探します。' },
      ],
      callouts: [
        { kind: 'CAUTION', text: '分詞構文の詳しい副詞用法は今回の範囲外です。まずは名詞を説明する分詞に集中しましょう。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 100, lineEnd: 123, concept: '分詞の形容詞的用法と今回扱う範囲' },
      ],
    },
  ],
  keyRules: [
    '分詞は動詞由来だが、名詞を説明するときは形容詞のように働く。',
    '分詞を見たら、まず「どの名詞を説明しているか」を探す。',
    '形容詞と分詞は、名詞を修飾したり補語になったりする働きが共通している。',
  ],
  commonMistakes: [
    '分詞をいつでも文の動詞だと考えてしまう。',
    '-ing を見た瞬間に進行形だと決めつける。',
    '分詞と分詞構文を区別せずに読んでしまう。',
  ],
  examPoints: [
    '空所の形を考える前に、まず分詞が説明している名詞を確認する。',
    '分詞の訳だけで判断せず、名詞とのセットで意味を捉える。',
  ],
  summary: [
    '分詞は動詞からできた形容詞のような要素。',
    '分詞と名詞を一つのセットとして読む。',
    '今回の中心は名詞修飾と補語。',
  ],
  detailedReview: [
    { title: '判断の振り返り', paragraphs: ['分詞を見つけたら、まずは説明対象の名詞を丸で囲みましょう。smiling → baby のような関係をつかめれば、形や位置もスムーズに判断できます。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 100, lineEnd: 123, concept: '分詞の形容詞的用法と現在分詞・過去分詞の導入' },
    { source: 'chapter14-ocr.md', heading: '14-1-1', lineStart: 108, lineEnd: 119, concept: '補語と名詞修飾の働き' },
  ],
};
