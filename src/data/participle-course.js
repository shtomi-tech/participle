export const PARTICIPLE_PROGRESS_KEY = 'participle.lesson-progress.v1';

export const participleStageLabels = ['LOOK', 'NOTICE', 'TRY', 'CHECK', 'SUMMARY'];

const choice = (id, text) => ({ id, text });

export const participleLessons = [
  {
    id: 'PART-L1',
    source: 'ppt',
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
          { id: 'l1-q2', prompt: 'the smiling baby\nsmiling の働きは？', choices: [choice('noun', '名詞を説明する'), choice('tense', '動詞の時制を決める'), choice('sentence', '文全体を説明する')], answer: 'noun', reason: 'smiling は名詞 baby を説明する形容詞の働きをしています。' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '分詞を見たときの最初の見方を一行で覚えます。', kind: 'summary' },
    ],
  },
  {
    id: 'PART-L2',
    source: 'ppt',
    slug: 'ing-vs-pp',
    label: 'Lesson 2',
    title: '-ing と p.p. — する側 / される側',
    shortTitle: '-ing / p.p.',
    goal: '名称ではなく、名詞が動作をするか・されるかで考える。',
    summary: '-ing＝する側。p.p.＝される側。',
    stages: [
      { id: 'look', title: '「現在」「過去」はいったん忘れよう', description: '見るべきなのは、その名詞が動作をするのか、されるのかです。', kind: 'contrast', source: 'ppt' },
      {
        id: 'notice', title: '動作の矢印を見る', description: 'PPTの2例で、名詞がする側か、される側かを確かめます。', kind: 'active-passive', source: 'ppt',
        examples: {
          active: { sentence: 'the baby smiling at her mother', noun: 'baby', verb: 'smile', form: 'smiling', relationText: 'baby が smile する' },
          passive: { sentence: 'the language spoken in that country', noun: 'language', verb: 'speak', form: 'spoken', relationText: 'language が speak される' },
        },
      },
      {
        id: 'try', title: 'p.p.の根にあるイメージ', description: '語源イメージをカードで確認します。全暗記が目的ではありません。', kind: 'word-cards',
        cards: [
          { id: 'used', word: 'used', gloss: '使われた → 中古の' },
          { id: 'crowded', word: 'crowded', gloss: '混んだ' },
          { id: 'frozen', word: 'frozen', gloss: '凍らされた → 凍った' },
          { id: 'lost', word: 'lost', gloss: '失われた → 行方不明の' },
          { id: 'experienced', word: 'experienced', gloss: '経験のある' },
          { id: 'qualified', word: 'qualified', gloss: '資格がある・適任の' },
          { id: 'scheduled', word: 'scheduled', gloss: '予定された' },
          { id: 'complicated', word: 'complicated', gloss: '複雑にされた → 複雑な' },
          { id: 'sophisticated', word: 'sophisticated', gloss: '洗練された' },
          { id: 'civilized', word: 'civilized', gloss: '文明化した' },
          { id: 'organized', word: 'organized', gloss: '組織的な' },
          { id: 'noted', word: 'noted', gloss: '有名な' },
          { id: 'marked', word: 'marked', gloss: '著しい・目立つ' },
        ],
        advanced: { title: 'ADVANCED：p.p.なのに「〜された」ではない？', body: 'fallen leaves\nleaves が fall される？ → NO\nfall は自動詞なので受動になりません。fallen は「落ちた」という完了の意味です。\n\ngone / fallen / grown / retired / advanced / learned' },
      },
      {
        id: 'check', title: 'Lesson 2 確認問題', description: 'SV関係を決めてから、分詞の形を選びます。', kind: 'relation-quiz', source: 'ppt',
        questions: [
          { id: 'l2-q1', sentence: 'the baby ___ at her mother', noun: 'baby', verb: 'smile', relationAnswer: 'active', formChoices: [choice('smiling', 'smiling'), choice('smiled', 'smiled')], formAnswer: 'smiling', relationReason: 'baby が smile する', reason: 'baby が smile するので、能動の -ing形 smiling です。', source: 'ppt' },
          { id: 'l2-q2', sentence: 'the language ___ in that country', noun: 'language', verb: 'speak', relationAnswer: 'passive', formChoices: [choice('speaking', 'speaking'), choice('spoken', 'spoken')], formAnswer: 'spoken', relationReason: 'language が speak される', reason: 'language が speak されるので、受動の p.p. spoken です。', source: 'ppt' },
          { id: 'l2-q3', kind: 'drag-rule', prompt: 'カードを正しい関係へ移動してください。', dragItems: [{ id: 'ing', text: '-ing' }, { id: 'pp', text: 'p.p.' }], dragTargets: [{ id: 'active', text: '能動・する側' }, { id: 'passive', text: '受動・される側' }], answer: 'active-passive', reason: '-ing はする側、p.p. はされる側です。', source: 'ppt' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '語尾ではなく、動作の向きを思い出します。', kind: 'summary', summary: '基本：\n-ing\n→ 能動\n→ 「する」\np.p.\n→ 受動\n→ 「される」', source: 'ppt' },
    ],
  },
  {
    id: 'PART-L3',
    source: 'ppt',
    slug: 'modifier-position',
    label: 'Lesson 3',
    title: '分詞はどこに置く？',
    shortTitle: '分詞の位置',
    goal: '1語なら前、説明が長ければ後ろという基本位置を体験する。',
    summary: '原則：\n1語なら前\n2語以上なら後ろ',
    stages: [
      { id: 'look', title: '1語の分詞は名詞の前', description: 'laughing だけなら1語。原則として名詞の前に置きます。', kind: 'one-word', sentence: 'Look at the laughing children.', source: 'ppt' },
      { id: 'notice', title: '説明が長くなったら後ろへ', description: 'at the clown を laughing に追加して、分詞句を作ります。', kind: 'build-phrase' },
      {
        id: 'try', title: '長い説明は後ろから', description: '分詞以外にも、長い説明を後ろに置く例があります。', kind: 'position-compare', source: 'ppt',
        bigRule: [
          { label: '形容詞', before: 'the tall boy', after: 'the boy so tall that his feet stick out past the end of the bed' },
          { label: '前置詞', before: '', after: 'the pen on the desk' },
          { label: '不定詞', before: '', after: 'time to study' },
          { label: '-ing', before: 'the smiling baby', after: 'the baby smiling at her mother' },
          { label: 'p.p.', before: 'the used car', after: 'the car used by Jun' },
          { label: '関係詞', before: '', after: 'the boy who is tall' },
        ],
        advanced: { title: 'ADVANCED：1語でも後ろに置くことがあります。', body: 'Hikaru is the girl dancing.\n\n前：恒常的・一般的な特徴になりやすい\n後ろ：一時的・具体的な状態を表すことがある\n\n細かい違いを気にしすぎず、1語でも後置できると覚えます。' },
      },
      {
        id: 'check', title: 'Lesson 3 確認問題', description: '語句を組み立てて、前置・後置を確認します。', kind: 'position-quiz', source: 'ppt',
        questions: [
          { id: 'l3-q1', kind: 'position-builder', prompt: 'smiling + baby', noun: 'baby', modifier: 'smiling', positionAnswer: 'front', output: 'the smiling baby', reason: 'smiling は1語なので、原則として名詞 baby の前に置きます。', source: 'ppt' },
          { id: 'l3-q2', kind: 'position-builder', prompt: 'smiling at her mother + baby', noun: 'baby', modifier: 'smiling', extra: 'at her mother', positionAnswer: 'back', output: 'the baby smiling at her mother', reason: 'smiling at her mother は2語以上の分詞句なので、名詞の後ろに置きます。', source: 'ppt' },
          { id: 'l3-q3-a', kind: 'position-builder', prompt: 'used + car', noun: 'car', modifier: 'used', positionAnswer: 'front', output: 'the used car', reason: 'used だけなら1語なので、原則として名詞 car の前に置きます。', source: 'ppt' },
          { id: 'l3-q3-b', kind: 'position-builder', prompt: 'used by Jun + car', noun: 'car', modifier: 'used', extra: 'by Jun', positionAnswer: 'back', output: 'the car used by Jun', reason: 'used by Jun は2語以上の分詞句なので、名詞の後ろに置きます。', source: 'ppt' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '分詞の長さを見て、置き場所を決めます。', kind: 'summary' },
    ],
  },
  {
    id: 'PART-L4',
    source: 'ppt',
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
          { id: 'l4-case-1', sentence: 'the baby ___ at her mother', noun: 'baby', verb: 'smile', relationAnswer: 'active', relationSentence: 'baby smiles.', forms: [choice('smiling', 'smiling'), choice('smiled', 'smiled')], formAnswer: 'smiling', correctAnswer: 'smiling', relationReason: 'baby が smile する', source: 'ppt' },
          { id: 'l4-case-2', sentence: 'the language ___ in that country', noun: 'language', verb: 'speak', relationAnswer: 'passive', relationSentence: 'language is spoken.', forms: [choice('speaking', 'speaking'), choice('spoken', 'spoken')], formAnswer: 'spoken', correctAnswer: 'spoken', relationReason: 'language が speak される', source: 'ppt' },
        ],
      },
      {
        id: 'try', title: '関係判定 → 形選択', description: '3問すべて、①SV関係、②分詞の形の順で判断します。BONUSでは発展事項も確認できます。', kind: 'rapid-judge', source: 'ppt',
        rapid: [
          { id: 'l4-rapid-1', sentence: 'the dog ___ in the park', noun: 'dog', verb: 'run', relationAnswer: 'active', forms: [choice('running', 'running'), choice('run', 'run')], formAnswer: 'running', source: 'ppt' },
          { id: 'l4-rapid-2', sentence: 'the language ___ in that country', noun: 'language', verb: 'speak', relationAnswer: 'passive', forms: [choice('speaking', 'speaking'), choice('spoken', 'spoken')], formAnswer: 'spoken', source: 'ppt' },
          { id: 'l4-rapid-3', sentence: 'the baby ___ at her mother', noun: 'baby', verb: 'smile', relationAnswer: 'active', forms: [choice('smiling', 'smiling'), choice('smiled', 'smiled')], formAnswer: 'smiling', source: 'ppt' },
        ],
      },
      {
        id: 'check', title: 'Lesson 4 確認問題', description: '各問題で、SV関係と分詞の形を両方答えます。', kind: 'relation-quiz',
        questions: [
          { id: 'l4-q1', sentence: 'English is the language (speaking / spoken) in many countries.', noun: 'language', verb: 'speak', relationAnswer: 'passive', formChoices: [choice('speaking', 'speaking'), choice('spoken', 'spoken')], formAnswer: 'spoken', relationReason: 'language が speak される', reason: 'language が speak されるので spoken です。', source: 'ppt' },
          { id: 'l4-q2', sentence: 'Look at the dog (running / run) in the park.', noun: 'dog', verb: 'run', relationAnswer: 'active', formChoices: [choice('running', 'running'), choice('run', 'run')], formAnswer: 'running', relationReason: 'dog が run する', reason: 'dog が run するので running です。', source: 'ppt' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '名詞と動詞の関係を形の根拠にします。', kind: 'summary', summary: '迷ったら日本語訳ではなく、\n名詞が「する」？\n名詞が「される」？\nを見る。', source: 'ppt' },
    ],
  },
  {
    id: 'PART-L5',
    source: 'ppt',
    slug: 'emotion-verbs',
    label: 'Lesson 5',
    title: '感情動詞 — 感情を与える側 / 与えられる側',
    shortTitle: '感情動詞',
    goal: '感情を与える側なら -ing、与えられる側なら p.p. と判断する。',
    summary: '感情を与える側なら -ing、感情を受ける側なら p.p.。',
    stages: [
      { id: 'look', title: 'surprise は「驚かせる」', description: '感情動詞を「人を〜させる」という他動詞として捉えます。', kind: 'emotion-intro', source: 'ppt', question: { id: 'l5-surprise', prompt: 'surprise = ?', choices: [choice('feel', '驚く'), choice('cause', '驚かせる')], answer: 'cause', explanation: 'surprise 人 = 人を驚かせる。He surprised his wife by giving her flowers.' } },
      { id: 'notice', title: '感情の矢印を切り替える', description: '感情を与える側と、感情を与えられる側を見比べます。', kind: 'emotion-switch', source: 'ppt' },
      {
        id: 'try', title: '感情動詞を仲間分けする', description: 'Vocabulary Drawerは、暗記テストではなく語の方向を眺める場所です。', kind: 'emotion-vocabulary', source: 'ppt',
        categories: [
          { id: 'joy', title: 'ワクワク・喜び', words: ['amuse', 'excite', 'thrill', 'please', 'delight', 'satisfy', 'relieve'] },
          { id: 'charm', title: '感動・魅了', words: ['move', 'touch', 'impress', 'attract', 'fascinate', 'absorb'] },
          { id: 'surprise', title: '驚き・疲れ・失望', words: ['surprise', 'amaze', 'bore', 'exhaust', 'embarrass', 'disappoint'] },
          { id: 'fear', title: '怒り・恐怖', words: ['annoy', 'irritate', 'offend', 'upset', 'scare', 'frighten', 'alarm'] },
        ],
        advanced: { title: 'ADVANCED：別の形容詞を使うこともある', body: 'attract → attractive\ndelight / please → delightful / pleasant\nimpress → impressive\noffend → offensive\nscare → scary\nsatisfy → satisfactory\n\n自動詞の例外：marvel / relax / bother / fear' },
      },
      {
        id: 'check', title: 'Lesson 5 最終確認問題', description: '関係と形の両方を確認します。', kind: 'final-quiz', source: 'ppt',
        questions: [
          { id: 'l5-q1', prompt: 'English is the language (speaking / spoken) in many countries.', noun: 'language', verb: 'speak', relationAnswer: 'passive', relationLabels: { active: 'language が speak する', passive: 'language が speak される' }, choices: [choice('speaking', 'speaking'), choice('spoken', 'spoken')], answer: 'spoken', reason: 'language が speak されるので spoken です。', review: 'Lesson 4「SV関係で判別」', source: 'ppt' },
          { id: 'l5-q2', prompt: 'Look at the dog (running / run) in the park.', noun: 'dog', verb: 'run', relationAnswer: 'active', relationLabels: { active: 'dog が run する', passive: 'dog が run される' }, choices: [choice('running', 'running'), choice('run', 'run')], answer: 'running', reason: 'dog が run するので running です。', review: 'Lesson 4「SV関係で判別」', source: 'ppt' },
          { id: 'l5-q3', prompt: 'The movie was so (boring / bored) that I fell asleep.', noun: 'movie', verb: 'bore', relationAnswer: 'active', relationLabels: { active: 'movie が人を退屈させる', passive: 'movie が退屈させられる' }, choices: [choice('boring', 'boring'), choice('bored', 'bored')], answer: 'boring', reason: 'movie が人を退屈させるので boring です。', review: 'Lesson 5「感情を与える側 / 与えられる側」', source: 'ppt' },
          { id: 'l5-q4', prompt: 'I was (exciting / excited) to hear the news.', noun: 'I', verb: 'excite', relationAnswer: 'passive', relationLabels: { active: 'I が人をワクワクさせる', passive: 'I がワクワクさせられる' }, choices: [choice('exciting', 'exciting'), choice('excited', 'excited')], answer: 'excited', reason: 'I はワクワクさせられる側なので excited です。', review: 'Lesson 5「感情を与える側 / 与えられる側」', source: 'ppt' },
          { id: 'l5-q5', prompt: 'Tom is an (interesting / interested) person.', noun: 'Tom', verb: 'interest', relationAnswer: 'active', relationLabels: { active: 'Tom が周囲に興味を持たせる', passive: 'Tom が興味を持たされる' }, choices: [choice('interesting', 'interesting'), choice('interested', 'interested')], answer: 'interesting', reason: 'Tom は周囲に興味を持たせる側なので interesting です。', review: 'Lesson 5「感情を与える側 / 与えられる側」', source: 'ppt' },
        ],
      },
      { id: 'summary', title: '今日のまとめ', description: '分詞の基本ルールを、次の英文でも使ってみましょう。', kind: 'summary', source: 'ppt' },
    ],
  },
];

export function getParticipleLesson(id) {
  return participleLessons.find((lesson) => lesson.id === id) ?? null;
}

export function getParticipleLessonBySlug(slug) {
  return participleLessons.find((lesson) => lesson.slug === slug) ?? null;
}
