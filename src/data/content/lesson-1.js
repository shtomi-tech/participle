export const lesson1Content = {
  lessonId: 'PART-L1',
  introduction: '分詞は、動詞から生まれた形でありながら、今回の中心用法では形容詞のように名詞を説明します。まずは「分詞を見たら、何を説明しているかを見る」という読み方を身につけます。',
  sections: [
    {
      id: 'PART-L1-EXPLAIN-01',
      title: '分詞とは何か',
      paragraphs: [
        '分詞は「動詞から分かれた詞」という名前のとおり、動詞由来の形です。ただし、名詞を説明しているときは、文の中心動詞として時制を示すのではなく、動詞の意味を残した形容詞的な要素として働きます。まず「これは何形か」と急いで決めず、「どの名詞の説明か」を探してください。',
        '形容詞の基本的な仕事は、名詞の性質を説明することです。分詞も同じように名詞の前後へ置かれ、動作や状態を名詞に結び付けます。分詞を読むときは、分詞だけの訳を覚えるより、分詞と名詞を小さな組として見る方が安定します。',
      ],
      examples: [
        { id: 'L1-EX-01', english: 'a cute baby', translation: 'かわいらしい赤ちゃん', structure: 'cute → baby', point: 'cute は一般の形容詞ですが、baby の性質を説明しています。' },
        { id: 'L1-EX-02', english: 'a smiling baby', translation: 'ほほえんでいる赤ちゃん', structure: 'smiling → smile 由来 → baby', point: 'smiling は動詞 smile 由来の分詞で、baby を説明します。' },
      ],
      callouts: [
        { kind: 'POINT', text: '分詞は動詞由来ですが、名詞を説明するときは形容詞のように働きます。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '100-108', concept: '分詞の定義と形容詞的用法' },
      ],
    },
    {
      id: 'PART-L1-EXPLAIN-02',
      title: '形容詞と同じ場所で働く',
      paragraphs: [
        '形容詞は名詞を修飾するだけでなく、be動詞の後ろで主語を説明する補語にもなります。分詞にもこの働きがあります。たとえば dancing は girl の状態を説明します。ただし is dancing 全体を一つの動詞として見る方が簡単な場合もあり、ここでは細かい文型名より「何を説明しているか」を優先します。',
        '名詞修飾では、分詞が名詞の前に置かれる形から始めます。a smiling baby では smiling が baby を説明しています。分詞の位置や -ing / p.p. の選び方は次のLessonで扱いますが、どのLessonでも最初に説明対象を確認する習慣は変わりません。',
      ],
      examples: [
        { id: 'L1-EX-03', english: 'The girl is dancing.', translation: 'その少女は踊っています。', structure: 'The girl → is dancing', point: 'dancing は主語 girl の状態を説明する位置にあります。' },
        { id: 'L1-EX-04', english: 'Look at the glowing lamp.', translation: '光っているランプを見て。', structure: 'glowing → lamp', point: 'glowing は glow 由来で、lamp を説明する分詞です。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '108-119', concept: '補語と名詞修飾の働き' },
      ],
    },
    {
      id: 'PART-L1-EXPLAIN-03',
      title: '今回扱う範囲',
      paragraphs: [
        '分詞には副詞のように働く分詞構文もありますが、今回は深く扱いません。分詞の形容詞的用法と分詞構文を最初から一つにすると、分詞がどの名詞を説明しているのかが見えにくくなるからです。今は名詞修飾と補語を中心に、分詞を形容詞的に読む練習をします。',
        'このLessonのゴールは、分詞を見つけたときに「動詞の一部」とだけ考えず、説明対象の名詞を言えることです。たとえば smiling baby なら、smiling の意味を baby に結び付けます。次のLesson以降では、そこから能動・受動や位置を判断します。',
      ],
      examples: [
        { id: 'L1-EX-05', english: 'The child smiling by the window waved.', translation: '窓のそばでほほえんでいる子どもが手を振りました。', structure: 'smiling by the window → the child', point: '長い分詞のまとまりでも、まず説明される名詞を探します。' },
      ],
      callouts: [
        { kind: 'CAUTION', text: '分詞構文の詳しい副詞用法は今回の範囲外です。まず名詞を説明する分詞に集中します。' },
      ],
      sourceEvidence: [
        { source: 'chapter14-ocr.md', section: '100-123', concept: '分詞の形容詞的用法と今回扱う範囲' },
      ],
    },
  ],
  keyRules: [
    '分詞は動詞由来だが、名詞を説明するときは形容詞的に働く。',
    '分詞を見たら、最初に「どの名詞を説明しているか」を探す。',
    '形容詞と分詞は、名詞修飾や補語という働きを共有する。',
  ],
  commonMistakes: [
    '分詞をいつでも文の中心動詞だと考える。',
    '-ing を見た瞬間に進行形だと決める。',
    '分詞と分詞構文を同じ用法として読む。',
  ],
  examPoints: [
    '空所の形より先に、分詞が説明している名詞を確認する。',
    '分詞の訳だけでなく、名詞とのまとまりを見て判断する。',
  ],
  summary: [
    '分詞は動詞由来の形容詞的要素。',
    '分詞と名詞を一つの組として読む。',
    '今回の中心は名詞修飾と補語。',
  ],
  detailedReview: [
    { title: '判断の振り返り', paragraphs: ['分詞を見つけたら、まず説明対象の名詞を囲みます。smiling → baby のように関係を作れたら、形や位置の判断へ進めます。'] },
  ],
  sourceEvidence: [
    { source: 'chapter14-ocr.md', section: '100-123', concept: '分詞の形容詞的用法と現在分詞・過去分詞の導入' },
    { source: 'chapter14-ocr.md', section: '108-119', concept: '補語と名詞修飾の働き' },
  ],
};
