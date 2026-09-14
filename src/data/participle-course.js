export const PARTICIPLE_PROGRESS_KEY = 'participle.lesson-progress.v1';

export const participleStageLabels = ['LOOK', 'NOTICE', 'TRY', 'CHECK', 'SUMMARY'];

const choice = (id, text) => ({ id, text });

export const participleLessons = [
  {
    id: 'PART-L1',
    slug: 'participle-basics',
    label: 'Lesson 1',
    title: '分詞は「形容詞」',
    shortTitle: '分詞は形容詞',
    goal: '形容詞が入る位置に分詞を置けることを知る。',
    summary: '分詞は、名詞を説明したり補語になったりする「形容詞」の仲間。',
    stages: [
      {
        id: 'look',
        title: '分詞と分詞構文は、別もの。',
        description: 'このLessonで扱うのは「分詞」。分詞は、名詞を説明する「形容詞」の仲間です。',
        kind: 'intro',
        lookSentences: ['The girl is tall.', 'The girl is dancing.'],
        cards: [
          { id: 'participle', title: '分詞', detail: '形容詞として働く', badge: 'TODAY' },
          { id: 'participle-clause', title: '分詞構文', detail: '副詞として働く', badge: 'NOT TODAY' },
          { id: 'svoc', title: 'SVOCのC', detail: 'OとCの関係', badge: 'NOT TODAY' },
        ],
      },
      {
        id: 'notice',
        title: '形容詞があった場所に入る',
        description: 'CHANGEを押して、tall と dancing が同じ場所に入ることを見ます。',
        kind: 'change',
      },
      {
        id: 'try',
        title: '名詞を説明する働きに気づく',
        description: 'cute と smiling の共通点を確認し、Lesson 5への伏線にも触れます。',
        kind: 'try-intro',
        rule: ['分詞は', '名詞を説明する', '「形容詞」の仲間'],
        callback: { prompt: 'surprise = ?', answerText: '驚かせる', explanation: 'なぜ surprise が「驚かせる」なのかは、Lesson 5で解明します。' },
        question: {
          id: 'l1-surprise',
          prompt: 'surprise = ?',
          choices: [choice('surprise-feel', '驚く'), choice('surprise-cause', '驚かせる')],
          answer: 'surprise-cause',
          explanation: '正解は「驚かせる」。なぜ surprise がこういう意味になるのかは、Lesson 5で解明します。',
        },
      },
      {
        id: 'check',
        title: 'Lesson 1 確認問題',
        description: '分詞が形容詞の仲間として働くことを、2問で確認します。',
        kind: 'quiz',
        questions: [
          { id: 'l1-q1', prompt: 'Look at the smiling baby.\nsmiling は何を説明していますか？', choices: [choice('baby', 'baby'), choice('look', 'look'), choice('sentence', '文全体')], answer: 'baby', reason: 'smiling は baby がどんなものかを説明しています。' },
          { id: 'l1-q2', prompt: 'the broken window\nbroken は何を説明していますか？', choices: [choice('window', 'window'), choice('the', 'the'), choice('sentence', '文全体')], answer: 'window', reason: 'broken は window がどんなものかを説明しています。' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '分詞を見たときの最初の見方を一行で覚えます。', kind: 'summary' },
    ],
  },
  {
    id: 'PART-L2',
    slug: 'ing-vs-pp',
    label: 'Lesson 2',
    title: '-ing と p.p. — する側 / される側',
    shortTitle: '-ing / p.p.',
    goal: '名称ではなく、名詞が動作をするか・されるかで考える。',
    summary: '-ing＝する側。p.p.＝される側。',
    stages: [
      { id: 'look', title: '「現在」「過去」はいったん忘れよう', description: '見るべきなのは、その名詞が動作をするのか、されるのかです。', kind: 'contrast' },
      { id: 'notice', title: '動作の矢印を見る', description: 'boy と ball のどちらが動作をする側か、矢印で確かめます。', kind: 'active-passive' },
      {
        id: 'try', title: 'p.p.の根にあるイメージ', description: '語源イメージをカードで確認します。全暗記が目的ではありません。', kind: 'word-cards',
        cards: [
          { id: 'used', word: 'used', gloss: '使われた → 中古の' },
          { id: 'frozen', word: 'frozen', gloss: '凍らされた → 凍った' },
          { id: 'lost', word: 'lost', gloss: '失われた → 迷った' },
          { id: 'scheduled', word: 'scheduled', gloss: '予定された' },
          { id: 'complicated', word: 'complicated', gloss: '複雑にされた → 複雑な' },
          { id: 'sophisticated', word: 'sophisticated', gloss: '洗練された' },
        ],
        advanced: { title: 'ADVANCED：p.p.なのに「〜された」ではない？', body: 'fallen leaves の fall は自動詞です。leaves が fall されるのではなく、fall が終わった結果の「落ち葉」になります。' },
      },
      {
        id: 'check', title: 'Lesson 2 確認問題', description: 'する側・される側を3問で確認します。', kind: 'quiz',
        questions: [
          { id: 'l2-q1', prompt: 'the dog running in the park\ndog と run の関係は？', choices: [choice('active', 'dog が run する'), choice('passive', 'dog が run される')], answer: 'active', reason: 'dog が run する側なので running です。' },
          { id: 'l2-q2', prompt: 'the car used by Jun\ncar と use の関係は？', choices: [choice('active', 'car が use する'), choice('passive', 'car が use される')], answer: 'passive', reason: 'car は Jun に use される側なので used です。' },
          { id: 'l2-q3', kind: 'drag-rule', prompt: 'カードを正しい関係へ移動してください。', dragItems: [{ id: 'ing', text: '-ing' }, { id: 'pp', text: 'p.p.' }], dragTargets: [{ id: 'active', text: '能動・する側' }, { id: 'passive', text: '受動・される側' }], answer: 'active-passive', reason: '-ing はする側、p.p. はされる側です。' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '語尾ではなく、動作の向きを思い出します。', kind: 'summary' },
    ],
  },
  {
    id: 'PART-L3',
    slug: 'modifier-position',
    label: 'Lesson 3',
    title: '分詞はどこに置く？',
    shortTitle: '分詞の位置',
    goal: '1語なら前、説明が長ければ後ろという基本位置を体験する。',
    summary: '原則：\n1語なら前\n2語以上なら後ろ',
    stages: [
      { id: 'look', title: '1語の分詞は名詞の前', description: 'laughing だけなら1語。原則として名詞の前に置きます。', kind: 'one-word' },
      { id: 'notice', title: '説明が長くなったら後ろへ', description: 'at the clown を laughing に追加して、分詞句を作ります。', kind: 'build-phrase' },
      { id: 'try', title: '長い説明は後ろから', description: '分詞以外にも、長い説明を後ろに置く例があります。', kind: 'position-compare', advanced: { title: 'ADVANCED：1語でも後ろに置くことがあります。', body: '前：一般的・特徴として説明することがあります。\n後ろ：その場の具体的な様子を表すことがあります。\nthe dancing girl / the girl dancing' } },
      {
        id: 'check', title: 'Lesson 3 確認問題', description: '語数と位置の関係を3問で確認します。', kind: 'quiz',
        questions: [
          { id: 'l3-q1', prompt: 'smiling / baby\n正しい順番は？', choices: [choice('front', 'the smiling baby'), choice('back', 'the baby smiling')], answer: 'front', reason: 'smiling は1語なので名詞 baby の前に置きます。' },
          { id: 'l3-q2', prompt: 'smiling at her mother / baby\n正しい順番は？', choices: [choice('back', 'the baby smiling at her mother'), choice('front', 'the smiling at her mother baby')], answer: 'back', reason: '分詞に情報が続く2語以上の分詞句なので後ろに置きます。' },
          { id: 'l3-q3', prompt: 'used / car\n正しい順番は？', choices: [choice('used', 'the used car'), choice('used-by-jun', 'the car used by Jun')], answer: 'used', reason: 'used だけなら1語なので the used car と前置できます。' },
          { id: 'l3-q4', prompt: 'used by Jun / car\n正しい順番は？', choices: [choice('used-by-jun', 'the car used by Jun'), choice('used', 'the used by Jun car')], answer: 'used-by-jun', reason: 'used by Jun は2語以上の分詞句なので the car used by Jun と後置します。' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '分詞の長さを見て、置き場所を決めます。', kind: 'summary' },
    ],
  },
  {
    id: 'PART-L4',
    slug: 'hidden-sv',
    label: 'Lesson 4',
    title: '-ing か p.p. か？ — SV関係で判別',
    shortTitle: 'SV関係で判別',
    goal: '日本語訳ではなく、修飾される名詞と元動詞の関係から形を選ぶ。',
    summary: '迷ったら日本語訳ではなく、「名詞がする / される」を見る。',
    stages: [
      { id: 'look', title: 'WHO DOES IT?', description: '-ing か p.p. か迷ったら、まず「誰がその動作をする？」と考えます。', kind: 'sv-flow' },
      {
        id: 'notice', title: '関係を先に決める', description: '形を選ぶ前に、名詞と元動詞をクリックして関係を作ります。', kind: 'sv-cases',
        cases: [
          { id: 'l4-case-1', sentence: 'the baby ___ at her mother', noun: 'baby', verb: 'smile', relationAnswer: 'active', relationSentence: 'baby smiles.', forms: [choice('smiling', 'smiling'), choice('smiled', 'smiled')], formAnswer: 'smiling', relationReason: 'baby が smile する' },
          { id: 'l4-case-2', sentence: 'the language ___ in that country', noun: 'language', verb: 'speak', relationAnswer: 'passive', relationSentence: 'language is spoken.', forms: [choice('speaking', 'speaking'), choice('spoken', 'spoken')], formAnswer: 'spoken', relationReason: 'language が speak される' },
        ],
      },
      { id: 'try', title: '関係判定 → 形選択', description: '2段階で判断する練習です。BONUSでは例外も確認できます。', kind: 'rapid-judge', rapid: { sentence: 'the dog ___ in the park', noun: 'dog', verb: 'run', relationAnswer: 'active', forms: [choice('running', 'running'), choice('run', 'run')], formAnswer: 'running' } },
      {
        id: 'check', title: 'Lesson 4 確認問題', description: '各問題で、SV関係と分詞の形を両方答えます。', kind: 'relation-quiz',
        questions: [
          { id: 'l4-q1', sentence: 'English is the language (speaking / spoken) in many countries.', noun: 'language', verb: 'speak', relationAnswer: 'passive', formChoices: [choice('speaking', 'speaking'), choice('spoken', 'spoken')], formAnswer: 'spoken', relationReason: 'speak → language', reason: 'language が speak されるので spoken です。' },
          { id: 'l4-q2', sentence: 'Look at the dog (running / run) in the park.', noun: 'dog', verb: 'run', relationAnswer: 'active', formChoices: [choice('running', 'running'), choice('run', 'run')], formAnswer: 'running', relationReason: 'dog → run', reason: 'dog が run するので running です。' },
          { id: 'l4-q3', sentence: 'the car (using / used) by Jun', noun: 'car', verb: 'use', relationAnswer: 'passive', formChoices: [choice('using', 'using'), choice('used', 'used')], formAnswer: 'used', relationReason: 'use → car', reason: 'car は use されるので used です。' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '名詞と動詞の関係を形の根拠にします。', kind: 'summary' },
    ],
  },
  {
    id: 'PART-L5',
    slug: 'emotion-verbs',
    label: 'Lesson 5',
    title: '感情動詞 — 感情を与える側 / 与えられる側',
    shortTitle: '感情動詞',
    goal: '感情を与える側なら -ing、与えられる側なら p.p. と判断する。',
    summary: '感情を与える側なら -ing、感情を受ける側なら p.p.。',
    stages: [
      { id: 'look', title: 'surprise は「驚かせる」', description: '感情動詞を「人を〜させる」という他動詞として捉えます。', kind: 'emotion-intro', question: { id: 'l5-surprise', prompt: 'surprise = ?', choices: [choice('feel', '驚く'), choice('cause', '驚かせる')], answer: 'cause', explanation: 'surprise 人 = 人を驚かせる。He surprised his wife by giving her flowers.' } },
      { id: 'notice', title: '感情の矢印を切り替える', description: '感情を与える側と、感情を与えられる側を見比べます。', kind: 'emotion-switch' },
      {
        id: 'try', title: '感情動詞を仲間分けする', description: 'Vocabulary Drawerは、暗記テストではなく語の方向を眺める場所です。', kind: 'emotion-vocabulary',
        categories: [
          { id: 'joy', title: 'ワクワク・喜び', words: ['amuse', 'excite', 'thrill', 'please', 'delight', 'satisfy', 'relieve'] },
          { id: 'charm', title: '感動・魅了', words: ['move', 'touch', 'impress', 'attract', 'fascinate', 'absorb'] },
          { id: 'surprise', title: '驚き・疲れ・失望', words: ['surprise', 'amaze', 'bore', 'exhaust', 'embarrass', 'disappoint'] },
          { id: 'fear', title: '怒り・恐怖', words: ['annoy', 'irritate', 'offend', 'upset', 'scare', 'frighten', 'alarm'] },
        ],
        advanced: { title: 'ADVANCED：別の形容詞を使うこともある', body: 'attract → attractive / impress → impressive / scare → scary / satisfy → satisfactory' },
      },
      {
        id: 'check', title: 'Lesson 5 最終確認問題', description: '5問中4問以上の正解で COMPLETE です。', kind: 'final-quiz',
        questions: [
          { id: 'l5-q1', prompt: 'English is the language (speaking / spoken) in many countries.', noun: 'language', verb: 'speak', relationAnswer: 'passive', choices: [choice('speaking', 'speaking'), choice('spoken', 'spoken')], answer: 'spoken', reason: 'language が speak されるので spoken です。', review: 'Lesson 4「SV関係で判別」' },
          { id: 'l5-q2', prompt: 'Look at the dog (running / run) in the park.', noun: 'dog', verb: 'run', relationAnswer: 'active', choices: [choice('running', 'running'), choice('run', 'run')], answer: 'running', reason: 'dog が run するので running です。', review: 'Lesson 4「SV関係で判別」' },
          { id: 'l5-q3', prompt: 'The movie was so (boring / bored) that I fell asleep.', noun: 'movie', verb: 'bore', relationAnswer: 'active', choices: [choice('boring', 'boring'), choice('bored', 'bored')], answer: 'boring', reason: 'movie が人を退屈させるので boring です。', review: 'Lesson 5「感情を与える側 / 与えられる側」' },
          { id: 'l5-q4', prompt: 'I was (exciting / excited) to hear the news.', noun: 'I', verb: 'excite', relationAnswer: 'passive', choices: [choice('exciting', 'exciting'), choice('excited', 'excited')], answer: 'excited', reason: 'I はワクワクさせられた側なので excited です。', review: 'Lesson 5「感情を与える側 / 与えられる側」' },
          { id: 'l5-q5', prompt: 'Tom is an (interesting / interested) person.', noun: 'Tom', verb: 'interest', relationAnswer: 'active', choices: [choice('interesting', 'interesting'), choice('interested', 'interested')], answer: 'interesting', reason: 'Tom は周りに興味を持たせる側なので interesting です。', review: 'Lesson 5「感情を与える側 / 与えられる側」' },
        ],
      },
      { id: 'summary', title: 'COMPLETE', description: '分詞の基本ルールを、次の英文でも使ってみましょう。', kind: 'summary' },
    ],
  },
];

export function getParticipleLesson(id) {
  return participleLessons.find((lesson) => lesson.id === id) ?? null;
}

export function getParticipleLessonBySlug(slug) {
  return participleLessons.find((lesson) => lesson.slug === slug) ?? null;
}
