# 分詞インタラクティブ教材 — Design

## Design status

この文書は、`PROJECT_GOAL.md` と `LEARNING_REQUIREMENTS.md` に基づく設計・実装の正本です。Phase 1〜4でLesson 1〜6と8種類の既存Interactionを実装し、Phase 5でExplanation-firstのLesson構造、汎用Explanation Renderer、Exam Multiple Choice、入試語句整序、検証・ブラウザ回帰を追加します。Phase 5の最終検証結果は末尾の実装更新に記録します。

Explanation is primary. Interaction is supportive. Assessment confirms transfer.

調査日は 2026-09-13。参照元 `C:\Users\shtom\dev\english-grammar-interactive-atlas` は調査時点で未コミット変更を含んでいたため、読み取り専用で扱いました。参照元にはGraft graphがなく、`graft check` は `NO GRAPH` でした。以下の記述は実ファイルの確認結果です。

## Source separation

| Responsibility | Source of truth |
| --- | --- |
| What to teach | `C:\Users\shtom\dev\participle\chapter14-ocr.md` / `chapter14-ocr.json` |
| Project goal | `PROJECT_GOAL.md` |
| Learning requirements | `LEARNING_REQUIREMENTS.md` |
| How to teach | `C:\Users\shtom\dev\english-grammar-interactive-atlas` の既存Component、Problem、Lesson、validator、CSS |
| Explanation content | `src/data/content/lesson-*.js`。本文・例文・ルール・誤り・入試POINT・出典をLesson単位で保持する |
| Explanation rendering | `src/components/explanation/explanationRenderer.js`。教材文をComponentへ直書きせず、共通Rendererで表示する |
| Explanation validation | `src/lib/validateLessonContent.js`。Lesson、section、例文、出典の必須契約を検証する |
| Future assessment | 分詞教材固有のProblem Data。Componentへ教材文を埋め込まない |

参照Atlasのコード・教材文・外部出典をそのままコピーすることは、この設計の承認を意味しません。実装時は既存の契約と操作パターンを参考にし、分詞用の教材文とデータは一次資料を根拠に作成します。

## Existing Interaction Inventory

参照Atlasは `src/data/interactions.js` と `src/data/interactions-additional.js` に41件のカタログ項目を持ち、`src/components/demos/registry.js` には12種類の実働Demoがあります。`demoType` が付いていない項目はカタログ上の候補であり、実働Componentとしては扱いません。

| Interaction ID | 既存機能 | 所在 | 現在の用途 / 状態 | 分詞教材への適用可能性 |
| --- | --- | --- | --- | --- |
| INT-EXIST-001 | Word Order Builder (`GRAM-INT-001`) | `src/data/interactions.js`; `src/components/demos/wordOrderBuilder.js`; `word-order` | 単語カードをタップして語順を組み立てる。実働 | 高 |
| INT-EXIST-002 | Drag into Blank (`GRAM-INT-002`) | `src/data/interactions.js`; Demo未登録 | 空欄への語句配置。カタログのみ | 中 |
| INT-EXIST-003 | Mark the Parts (`GRAM-INT-003`) | `src/data/interactions.js`; `src/components/demos/markTheParts.js`; `mark-parts` | トークンを選択し、役割を正誤判定する。実働 | 高 |
| INT-EXIST-004 | Grammar Classifier (`GRAM-INT-004`) | `src/data/interactions.js`; `src/components/demos/grammarClassifier.js`; `grammar-classifier` | 語句カードをカテゴリへ分類する。実働 | 高 |
| INT-EXIST-005 | Sentence Transformer (`GRAM-INT-005`) | `src/data/interactions.js`; `src/components/demos/sentenceTransformer.js`; `sentence-transformer` | subject / tense / modal / voice等を切り替え、文を生成・観察する。実働 | 中 |
| INT-EXIST-006 | Syntax Visualizer (`GRAM-INT-006`) | `src/data/interactions.js`; Demo未登録 | 句・節の階層表示の候補。カタログのみ | 中 |
| INT-EXIST-007 | Sentence Generator (`GRAM-INT-007`) | `src/data/interactions.js`; `src/components/demos/sentenceGenerator.js`; `sentence-generator` | 条件を選び、目標状態に合う文を明示生成する。実働 | 中 |
| INT-EXIST-008 | Sentence Comparison (`GRAM-INT-008`) | `src/data/interactions.js`; `src/components/demos/sentenceComparison.js`; `sentence-comparison` | 2文のデータ定義済み差分を選び、意味を比較する。実働 | 高 |
| INT-EXIST-009 | Error Corrector (`GRAM-INT-009`) | `src/data/interactions.js`; `src/components/demos/errorCorrector.js`; `error-corrector` | 誤りのあるトークンと訂正候補を選ぶ。実働 | 高 |
| INT-EXIST-010 | Context Grammar (`GRAM-INT-010`) | `src/data/interactions.js`; `src/components/demos/contextGrammar.js`; `context-grammar` | 場面・会話履歴・選択肢から文法を選ぶ。実働 | 高 |
| INT-EXIST-011 | Sentence Pattern Builder (`GRAM-INT-011`) | `src/data/interactions-additional.js`; Demo未登録 | 文型スロットへ語句を置く候補 | 中 |
| INT-EXIST-012 | Question Builder (`GRAM-INT-012`) | `src/data/interactions-additional.js`; Demo未登録 | 疑問文を組み立てる候補 | 低 |
| INT-EXIST-013 | Clause Combiner (`GRAM-INT-013`) | `src/data/interactions-additional.js`; Demo未登録 | 主節と従属節を結合する候補 | 低 |
| INT-EXIST-014 | Modifier Positioner (`GRAM-INT-014`) | `src/data/interactions-additional.js`; `src/components/demos/modifierPositioner.js`; `modifier-positioner` | 修飾語を選び、配置と修飾先・意味を比較する。実働 | 高 |
| INT-EXIST-015 | Adverb Placement Explorer (`GRAM-INT-015`) | `src/data/interactions-additional.js`; Demo未登録 | 副詞の位置と焦点を比較する候補 | 中 |
| INT-EXIST-016 | Clause Reordering (`GRAM-INT-016`) | `src/data/interactions-additional.js`; Demo未登録 | 節の順序を変える候補 | 低 |
| INT-EXIST-017 | Sentence Role Finder (`GRAM-INT-017`) | `src/data/interactions-additional.js`; Demo未登録 | 文中の役割を探す候補 | 高 |
| INT-EXIST-018 | Clause Boundary Marker (`GRAM-INT-018`) | `src/data/interactions-additional.js`; Demo未登録 | 節境界を選ぶ候補 | 低 |
| INT-EXIST-019 | Modifier Finder (`GRAM-INT-019`) | `src/data/interactions-additional.js`; Demo未登録 | 修飾語と修飾先を選ぶ候補 | 高 |
| INT-EXIST-020 | Part of Speech Sorter (`GRAM-INT-020`) | `src/data/interactions-additional.js`; Demo未登録 | 品詞を分類する候補 | 高 |
| INT-EXIST-021 | Phrase vs Clause Classifier (`GRAM-INT-021`) | `src/data/interactions-additional.js`; Demo未登録 | 句と節を分類する候補 | 中 |
| INT-EXIST-022 | Transitive vs Intransitive Classifier (`GRAM-INT-022`) | `src/data/interactions-additional.js`; Demo未登録 | 自動詞・他動詞を分類する候補 | 高 |
| INT-EXIST-023 | Active Passive Transformer (`GRAM-INT-023`) | `src/data/interactions-additional.js`; Demo未登録 | 能動・受動を切り替える候補 | 中 |
| INT-EXIST-024 | Direct Indirect Speech Transformer (`GRAM-INT-024`) | `src/data/interactions-additional.js`; Demo未登録 | 話法を変換する候補 | 低 |
| INT-EXIST-025 | Comparison Transformer (`GRAM-INT-025`) | `src/data/interactions-additional.js`; Demo未登録 | 比較表現を変換する候補 | 低 |
| INT-EXIST-026 | Sentence Pattern Diagram (`GRAM-INT-026`) | `src/data/interactions-additional.js`; `src/components/demos/sentencePatternDiagram.js`; `sentence-pattern-diagram` | 文型のchunkと図を対応づける。実働 | 中 |
| INT-EXIST-027 | Modifier Connection Viewer (`GRAM-INT-027`) | `src/data/interactions-additional.js`; `src/components/demos/modifierConnectionViewer.js`; `modifier-connection-viewer` | 修飾語と対象語の関係を選択・強調する。実働 | 高 |
| INT-EXIST-028 | Clause Hierarchy Viewer (`GRAM-INT-028`) | `src/data/interactions-additional.js`; Demo未登録 | 節階層を表示する候補 | 低 |
| INT-EXIST-029 | Tense Generator (`GRAM-INT-029`) | `src/data/interactions-additional.js`; Demo未登録 | 時制から文を生成する候補 | 低 |
| INT-EXIST-030 | Question Generator (`GRAM-INT-030`) | `src/data/interactions-additional.js`; Demo未登録 | 疑問文を生成する候補 | 低 |
| INT-EXIST-031 | Conditional Generator (`GRAM-INT-031`) | `src/data/interactions-additional.js`; Demo未登録 | 条件文を生成する候補 | 低 |
| INT-EXIST-032 | Infinitive vs Gerund Comparison (`GRAM-INT-032`) | `src/data/interactions-additional.js`; Demo未登録 | 不定詞と動名詞を比較する候補 | 低 |
| INT-EXIST-033 | Active vs Passive Comparison (`GRAM-INT-033`) | `src/data/interactions-additional.js`; Demo未登録 | 能動・受動を比較する候補 | 中 |
| INT-EXIST-034 | Tense Comparison (`GRAM-INT-034`) | `src/data/interactions-additional.js`; Demo未登録 | 時制を比較する候補 | 低 |
| INT-EXIST-035 | Agreement Fixer (`GRAM-INT-035`) | `src/data/interactions-additional.js`; Demo未登録 | 一致の誤りを直す候補 | 低 |
| INT-EXIST-036 | Tense Error Finder (`GRAM-INT-036`) | `src/data/interactions-additional.js`; Demo未登録 | 時制誤りを直す候補 | 低 |
| INT-EXIST-037 | Word Order Error Fixer (`GRAM-INT-037`) | `src/data/interactions-additional.js`; Demo未登録 | 語順誤りを直す候補 | 中 |
| INT-EXIST-038 | Request Simulator (`GRAM-INT-038`) | `src/data/interactions-additional.js`; Demo未登録 | 依頼表現の場面選択候補 | 低 |
| INT-EXIST-039 | Travel Conversation Grammar (`GRAM-INT-039`) | `src/data/interactions-additional.js`; Demo未登録 | 旅行会話の文法選択候補 | 低 |
| INT-EXIST-040 | Situation Tense Choice (`GRAM-INT-040`) | `src/data/interactions-additional.js`; Demo未登録 | 時間情報から時制を選ぶ候補 | 低 |
| INT-EXIST-041 | Exam Multiple Choice (`GRAM-INT-041`) | `src/data/interactions-additional.js`; `src/components/demos/examMultipleChoice.js`; `exam-multiple-choice` | 4択を選び、正誤・正答・全選択肢の理由を確認する。実働 | 高 |

## Existing Atlas investigation

### A. Lesson structure

参照Atlasの `src/data/lessons.js` には、Lesson Registryとして6 Lessonが定義されています。各Lessonは `id`、`slug`、`title`、`description`、`learningGoal`、順序付き `steps` を持ち、各Stepは `id`、`interactionType`、`problemId`、`title`、`instruction` を持ちます。分詞教材もこの構造を採用します。

`src/app.js:351-464` の `renderLesson()` は、画面を次の構造で描画します。

```text
Lesson header / learning goal
  ↓
Current step + progress
  ↓
Step instruction
  ↓
Component mounted from Registry + Problem Data
  ↓
completion feedback
  ↓
Previous / Next
```

`Next` は現在StepのComponentが `onComplete({ correct: true })` を返すまで無効です。Step移動時には見出しへfocusを戻し、完了Step数は画面内のmemoryに保持します。`src/lib/lesson-progress.js` によれば、ページ再読み込みや再入場をまたぐ永続化はありません。

### B. Existing interaction behavior

実働12種類の操作は、以下の学習行為をカバーしています。

| 学習行為 | 既存Component | 確認した挙動 |
| --- | --- | --- |
| Build | `WordOrderBuilder` | カードをタップして回答欄へ移し、`acceptedAnswers` を `checkWordOrder()` で判定。Hint、Reset、説明あり |
| Select | `MarkTheParts` | トークンを選択し、`checkTokenSelection()` で判定。正解時に構造行を表示 |
| Classify | `GrammarClassifier` | アイテムを選んでカテゴリを選択し、`checkClassification()` で全分類を判定。分類結果と説明を表示 |
| Transform / Reveal | `SentenceTransformer` | radio control変更ごとに文を生成。Problemに `completion: explore-control` がある場合、指定値を全て観察すると完了 |
| Visualize | `SentencePatternDiagram` | 英文chunkと文型図のnodeを対応選択。全要素を探索すると完了 |
| Visualize / Highlight | `ModifierConnectionViewer` | chunkまたは関係nodeを選択し、modifier→targetの関係と説明を表示。全relation探索で完了 |
| Move | `ModifierPositioner` | Modifierを選択して配置を選ぶ。文法的だがGoalと異なる配置を別状態として表示 |
| Compare | `SentenceComparison` | 2文のデータ定義済み差分をどちら側からでも選択し、左右の意味と説明を表示。全差分探索で完了 |
| Correct | `ErrorCorrector` | 誤りトークンと訂正候補を順に選び、全correctionが正解になると完了 |
| Simulate | `ContextGrammar` | scenarioと線形stepsを持ち、choice→feedback→Continueで会話履歴を進める |
| Generate | `SentenceGenerator` | 全controlを選び、Generateを明示的に押す。文法的だがtarget stateと違う状態も区別して表示 |
| Practice | `ExamMultipleChoice` | 4択を選び、正答・全選択肢の理由・リセットを確認する。入試Problem Dataを一問ずつ表示 |

Drag & Dropはカタログの候補に含まれますが、分詞教材の主要経路は、参照Atlasの原則どおりタップ／クリックで完結させます。指でカードを運ぶ作業は、学習内容より先にカードが旅に出るためです。

### C. Reusable implementation

参照Atlasから引き継ぐ実装契約は次のとおりです。

| Concern | Existing source | Design decision for participle |
| --- | --- | --- |
| Component API | `src/components/demos/*.js`, `src/components/demos/registry.js` | `mount(root, problem, options)`。教材文をComponentへ直書きしない |
| Exam Multiple Choice | `english-grammar-interactive-atlas/src/components/demos/examMultipleChoice.js`; `src/lib/grammar/exam-multiple-choice.js` | AtlasのR0実装を再利用し、分詞用の20 Problemを注入する。Participle専用4択Componentは作らない |
| Explanation Renderer | `src/components/explanation/explanationRenderer.js` | content dataのintroduction / sections / examples / rules / mistakes / exam points / review / sourcesを共通描画する |
| Problem registry | `src/data/problems/index.js` | 機能別Problem DataをRegistryで解決する |
| Pure evaluation | `src/lib/grammar/*.js` | 判定・文生成・関係検索はUIから分離する |
| Lesson registry | `src/data/lessons.js` | Stepは`interactionType`と`problemId`でComponentを再利用する |
| Completion | `onComplete({ correct: true })` | 正答・全差分探索など、Problemのcompletion条件を明示する |
| Progress | `src/lib/lesson-progress.js` | 初期版はLesson画面内memoryのみ。localStorage/DBは追加しない |
| Validation | `src/lib/validateProblems.js`, `validateLessons.js` | ID重複、Problem type、必須フィールド、Registry整合性を検証する |
| Feedback | 各Demoの`role=status` / `aria-live` | 正誤だけでなく、名詞・元動詞・関係・理由を短く表示する |
| Lifecycle | `src/lib/lifecycle.js` | mount前のcleanupとlistener解除を共通化する |
| CSS / tokens | `styles.css:1-74` | token、44px以上の操作領域、`:focus-visible`を引き継ぐ |
| Responsive | `styles.css:2387-2574` | 980px / 700px / 390pxの既存方針を基準に、1列化と横幅を確認する |
| Tests | `tests/logic.test.js`, `tests/browser/*.spec.js`, `npm test`, `npm run check`, `npm run build` | pure logic、contract、browser interactionを段階的に検証する |

参照AtlasはReactではなく、ブラウザ標準DOMとES Modulesで実装されています。分詞教材が別のUI技術を採用する場合は、採用理由を設計レビューで確定するまで変更しません。

## Learning Requirement → Existing Interaction mapping

| Learning Requirement | 学習内容 | 使用する既存Interaction | Adaptation / Reuse |
| --- | --- | --- | --- |
| LR-PART-001 | 分詞は動詞由来の形容詞 | INT-EXIST-003 + INT-EXIST-004 | 分詞句をtoken / phrase itemとして登録。R0、データ差し替え |
| LR-PART-002 | 名称と時制を分ける | INT-EXIST-008 | `-ing / p.p.` の対照文と意味メモを登録。R0 |
| LR-PART-003 | 進行・完了と能動・受動 | INT-EXIST-008 + INT-EXIST-009 | 比較で意味軸を見せ、訂正で形を選ぶ。R0、組み合わせはR2 |
| LR-PART-004 | 説明対象の名詞を特定 | INT-EXIST-003 | `targetRole: ModifierTarget` として正答を持つ。R0 |
| LR-PART-005 | 前置修飾 | INT-EXIST-014 | `the smiling baby` などの配置データを登録。R0 |
| LR-PART-006 | 後置修飾と1語例外 | INT-EXIST-014 + INT-EXIST-027 | 位置・修飾先・意味を配置／関係表示で比較。R0、組み合わせはR2 |
| LR-PART-007 | 名詞が元動詞をする | INT-EXIST-003 + INT-EXIST-027 | noun選択後にmodifier relationを開き、既存label / explanationで`the baby → smile`を表示。R0/R2 |
| LR-PART-008 | 名詞が元動詞をされる | INT-EXIST-003 + INT-EXIST-027 | 既存label / explanationで`the language → speak`を受動関係として表示。R0/R2 |
| LR-PART-009 | 訳だけで決めない | INT-EXIST-008 + INT-EXIST-009 | 表面的に紛らわしい例と誤答理由をデータで定義。R0 |
| LR-PART-010 | 自動詞p.p.と完了 | INT-EXIST-004 + INT-EXIST-009 | `受動 / 完了 / 要確認` の分類と誤答訂正。R0 |
| LR-PART-011 | 感情動詞の基本語義 | INT-EXIST-004 + INT-EXIST-010 | `excite = 〜させる` の分類と場面選択。R0、組み合わせはR2 |
| LR-PART-012 | 感情動詞の`-ing / -ed` | INT-EXIST-008 + INT-EXIST-010 | `exciting / excited` の差分と会話選択。R0、組み合わせはR2 |
| LR-PART-013 | 総合判断 | INT-EXIST-001 + INT-EXIST-009 + INT-EXIST-010 | Build→Correct→Simulateの既存Lessonパターンを再利用。R2 |

## Reuse-first decisions

### R0 — Direct Reuse

教材文、選択肢、正答、説明をProblem Dataへ差し替えるだけで成立するものです。

#### Word Order Builder

Related Requirements:

- LR-PART-001
- LR-PART-013

Reuse Source:

- `english-grammar-interactive-atlas/src/components/demos/wordOrderBuilder.js`
- `english-grammar-interactive-atlas/src/lib/grammar/word-order.js`
- `english-grammar-interactive-atlas/src/data/problems/word-order.js`

Existing Component:

- `WordOrderBuilder`

Reuse Level:

- R0 — Direct Reuse

Required Adaptation:

`words`、`acceptedAnswers`、`hints`、`explanation`を分詞用Problemへ差し替える。主要経路はtap-to-placeとし、自由入力やドラッグ必須化は行わない。

Why this interaction fits:

分詞句を構成する語句を順序づけ、名詞と分詞のまとまりを目で確認できる。正誤判定は既存の`acceptedAnswers`契約に乗る。

#### Mark the Parts

Related Requirements:

- LR-PART-001
- LR-PART-004
- LR-PART-007
- LR-PART-008

Reuse Source:

- `english-grammar-interactive-atlas/src/components/demos/markTheParts.js`
- `english-grammar-interactive-atlas/src/lib/grammar/parts.js`
- `english-grammar-interactive-atlas/src/data/problems/mark-parts.js`

Existing Component:

- `MarkTheParts`

Reuse Level:

- R0 — Direct Reuse

Required Adaptation:

`tokens`の`role`を分詞教材の`Target noun`、`Participle phrase`、`Base verb`などへデータで差し替える。正解時の構造表示へ、既存の説明欄で「名詞がする／される」を記録する。

Why this interaction fits:

分詞を見てすぐ形を選ばせず、先に説明対象の名詞を選ばせる。これは中心習慣の最初の観測になる。

#### Grammar Classifier

Related Requirements:

- LR-PART-001
- LR-PART-010
- LR-PART-011

Reuse Source:

- `english-grammar-interactive-atlas/src/components/demos/grammarClassifier.js`
- `english-grammar-interactive-atlas/src/lib/grammar/classification.js`
- `english-grammar-interactive-atlas/src/data/problems/grammar-classifier.js`

Existing Component:

- `GrammarClassifier`

Reuse Level:

- R0 — Direct Reuse

Required Adaptation:

カテゴリとitemsを、`Noun / Base verb / Participle adjective`、または`Active / Passive / Completion`のように問題ごとに差し替える。カテゴリの説明を、教材上の判定根拠として記録する。

Why this interaction fits:

同じ語形を時制名だけで処理せず、文中の働き・関係・意味軸へ分類できる。

#### Modifier Positioner

Related Requirements:

- LR-PART-005
- LR-PART-006

Reuse Source:

- `english-grammar-interactive-atlas/src/components/demos/modifierPositioner.js`
- `english-grammar-interactive-atlas/src/lib/grammar/modifier-placement.js`
- `english-grammar-interactive-atlas/src/data/problems/modifier-positioner.js`

Existing Component:

- `ModifierPositioner`

Reuse Level:

- R0 — Direct Reuse

Required Adaptation:

`chunks`、`modifier`、`placements`を分詞句用に定義する。文法的だがGoalと異なる位置は誤文扱いせず、修飾先と意味の違いを表示する。

Why this interaction fits:

前置修飾と後置修飾を、用語暗記でなく「置いた結果、どこを説明するか」で比べられる。`the smiling baby` と `the baby smiling at her mother` を同一データ契約へ落とせる。

#### Sentence Comparison

Related Requirements:

- LR-PART-002
- LR-PART-003
- LR-PART-009
- LR-PART-012

Reuse Source:

- `english-grammar-interactive-atlas/src/components/demos/sentenceComparison.js`
- `english-grammar-interactive-atlas/src/lib/grammar/sentence-comparison.js`
- `english-grammar-interactive-atlas/src/data/problems/sentence-comparison.js`

Existing Component:

- `SentenceComparison`

Reuse Level:

- R0 — Direct Reuse

Required Adaptation:

2文と文法上の差分をProblem Dataで明示する。文字列diffを自動推定せず、`differenceId`、左右の意味、理由を持たせる。

Why this interaction fits:

`exciting / excited`、`-ing / p.p.`、訳では決められない対照を、形・意味・役割の対応として操作できる。

#### Error Corrector

Related Requirements:

- LR-PART-003
- LR-PART-009
- LR-PART-010
- LR-PART-013

Reuse Source:

- `english-grammar-interactive-atlas/src/components/demos/errorCorrector.js`
- `english-grammar-interactive-atlas/src/lib/grammar/error-correction.js`
- `english-grammar-interactive-atlas/src/data/problems/error-corrector.js`

Existing Component:

- `ErrorCorrector`

Reuse Level:

- R0 — Direct Reuse

Required Adaptation:

誤った分詞を`tokens`と`corrections`へ登録し、候補ごとの`ruleLabel`と説明に、名詞・元動詞・能動／受動・完了のどれが誤っていたかを書く。

Why this interaction fits:

正しい形を選ぶだけでなく、典型誤りを診断し、なぜ`-ing`ではないのか、なぜ`p.p.`が受動ではないのかを返せる。

#### Context Grammar

Related Requirements:

- LR-PART-011
- LR-PART-012
- LR-PART-013

Reuse Source:

- `english-grammar-interactive-atlas/src/components/demos/contextGrammar.js`
- `english-grammar-interactive-atlas/src/lib/grammar/context-grammar.js`
- `english-grammar-interactive-atlas/src/data/problems/context-grammar.js`

Existing Component:

- `ContextGrammar`

Reuse Level:

- R0 — Direct Reuse

Required Adaptation:

`scenario`と線形`steps`を分詞用に差し替える。映画、会話、感情を伝える場面など、本文の用法から外れない文脈を使う。正答が複数成立する場合は`acceptedChoiceIds`へ明示する。

Why this interaction fits:

感情動詞を辞書訳だけでなく、話し手が感情を与えるのか受けるのかという目的と場面へ結び付けられる。

#### Modifier Connection Viewer

Related Requirements:

- LR-PART-004
- LR-PART-007
- LR-PART-008

Reuse Source:

- `english-grammar-interactive-atlas/src/components/demos/modifierConnectionViewer.js`
- `english-grammar-interactive-atlas/src/lib/grammar/modifier-relations.js`
- `english-grammar-interactive-atlas/src/data/problems/modifier-connection-viewer.js`

Existing Component:

- `ModifierConnectionViewer`

Reuse Level:

- R0 — Direct Reuse

Required Adaptation:

既存の`modifierId`→`targetId`関係と関係カードだけを使う。Hidden S-V、元動詞、能動／受動、結果の形は、既存の`label`と`explanation`へ問題データとして記録する。例は次の形とする。

```js
{
  id: 'relation-1',
  modifierId: 'smiling-at-her-mother',
  targetId: 'the-baby',
  relationType: 'modifies',
  label: 'Hidden S-V: active · the baby → smile · result: smiling',
  explanation: 'The baby smiles. 名詞 baby が smile する関係なので能動。したがって smiling。'
}
```

受動例では、`label`へ`Hidden S-V: passive · the language ← speak · result: spoken`、`explanation`へ`The language is spoken in that country. 名詞 language が speak される関係なので受動。したがって spoken。`を記録する。新しいフィールド、validator、SVG、専用Canvas、別Interactionは作らない。

Why this interaction fits:

既存のmodifier→target表示が分詞の説明対象を示し、既存のlabel / explanationが画面上に見えない`名詞→元動詞`と能動／受動を説明できる。

### R1 — Small Adaptation

現時点では採用しません。既存の`label`と`explanation`でHidden S-V、能動／受動、`-ing / p.p.`の根拠を表示できるため、Component APIやProblem schemaの拡張は不要です。

### R2 — Combination

#### Hidden S-V discovery sequence

Related Requirements:

- LR-PART-007
- LR-PART-008
- LR-PART-013

Reuse Source:

- `MarkTheParts` + `ModifierConnectionViewer` + 各Componentのfeedback / explanation
- `english-grammar-interactive-atlas/src/app.js:409-453` のLesson completion接続

Existing Component:

- 新Componentなし。既存2Componentを別Stepとして組み合わせる。

Reuse Level:

- R2 — Combination

Required Adaptation:

先にMark the Partsで説明対象の名詞を選ばせ、次のStepでModifier Connection Viewerを開き、同じProblem familyのrelationと既存label / explanationを探索させる。`-ing`用と`p.p.`用を別Problemとして登録し、正答を一つの巨大な専用画面へ集約しない。

Why this interaction fits:

Hidden S-Vは単一の派手なUIを必要としない。名詞の特定→修飾関係→名詞と元動詞の能動／受動という既存の選択・関係表示を順序づければ、学習者が関係を発見できる。

### R3 — New Interaction

現時点では採用しません。既存のBuild、Select、Classify、Move、Compare、Correct、Simulateと小規模な関係欄の拡張で、中心要件を満たせます。

## Why Existing Interactions Are Sufficient

- `-ing / p.p.` の形と意味の差は、既存のSentence Comparisonで左右対応として表示できる。
- 説明対象の名詞は、既存のMark the Partsで先に選択できる。
- 前置／後置は、既存のModifier Positionerが配置・修飾先・意味をデータから表示できる。
- Hidden S-Vは、Mark the PartsとModifier Connection Viewerの組み合わせ、および既存label / explanationで表現できる。
- 感情動詞は、Sentence ComparisonとContext Grammarの組み合わせで、語義・形・場面をつなげられる。
- 誤答はError Correctorで、候補と`ruleLabel`・説明を分離して返せる。

Sentence TransformerとSentence Generatorは、参照Atlasの現在契約では`subject`、`tense`、`modal`、`voice`等の状態を扱い、`-ing / p.p.` の形容詞的分詞状態を生成する契約ではありません。今回の設計では無理に拡張せず、比較・訂正・関係表示を優先します。Sentence Pattern Diagramも現在はS/V/O/Cの文型chunkが中心で、分詞の修飾関係にはModifier Connection Viewerの方が直接的です。

## Architecture consistency

### Repository shape (Phase 5 implementation)

教材本体は、参照Atlasの責務分離に合わせて次の構成で実装します。

```text
participle/
├─ chapter14-ocr.md
├─ chapter14-ocr.json
├─ PROJECT_GOAL.md
├─ LEARNING_REQUIREMENTS.md
├─ DESIGN.md
├─ src/
│  ├─ app.js
│  ├─ data/
│  │  ├─ interactions.js
│  │  ├─ lessons.js
│  │  ├─ content/
│  │  └─ problems/
│  ├─ components/
│  │  ├─ explanation/
│  │  └─ demos/
│  └─ lib/
│     └─ grammar/
└─ tests/
   ├─ logic.test.js
   └─ browser/
```

`src/data/content/`が説明の正本、`src/components/explanation/explanationRenderer.js`が汎用Renderer、`src/data/problems/`が操作・評価データを担います。`app.js`には教材本文を埋め込みません。

### Problem Data contracts

既存Atlasの契約に合わせ、教材文・正答・説明をComponentから分離します。

| Problem type | 分詞教材での使用 | 必須の中心データ |
| --- | --- | --- |
| `mark-parts` | 説明対象名詞、元動詞、分詞句の特定 | `id`, `type`, `prompt`, `targetRole`, `tokens`, `answer`, `explanation` |
| `grammar-classifier` | 形容詞的用法、能動／受動／完了、感情動詞の分類 | `categories`, `items`, 各`answer`、カテゴリ説明 |
| `word-order` | 分詞句・文の再構築 | `words`, `acceptedAnswers`, optional `hints` |
| `modifier-positioner` | 前置・後置と修飾先の比較 | `chunks`, `modifier`, `placements`, `relation`, `meaning` |
| `modifier-connection-viewer` | 名詞と分詞句の修飾関係、Hidden S-V | `chunks`, `relations`, 既存`label` / `explanation` |
| `sentence-comparison` | `-ing / p.p.`、`exciting / excited`の対照 | 2つの`sentences`, 明示的な`differences` |
| `error-corrector` | 典型誤答の訂正 | `tokens`, `corrections`, `options`, `acceptedOptionIds`, `ruleLabel` |
| `context-grammar` | 感情動詞の語義・場面適用 | `scenario`, 順序付き`steps`, `choices`, `acceptedChoiceIds` |
| `exam-multiple-choice` | 大学入試形式の4択と選択肢別レビュー | `id`, `type`, `lessonId`, `requirements`, `sourceEvidence`, `difficulty`, `misconceptions`, `stem`, 4つの`choices`, `answerChoiceId`, `explanation` |

Problem IDは、次フェーズで例えば `PART-MP-001`、`PART-MCV-001` のように機能接頭辞を付け、安定IDとして一度決めたら変更しません。既存AtlasのIDを流用しません。

### Evaluation and completion

- 正誤判定は`src/lib/grammar/`のpure functionへ置く。
- `SentenceComparison`と`ModifierConnectionViewer`の探索型Stepは、必要な差分・関係を全て確認した時点で完了とする。
- `ErrorCorrector`と`MarkTheParts`は、正答になった時点で完了とする。
- 文法的だがGoalと異なる配置は、不正解と断定せず、関係・意味の違いを表示する。
- `Lesson`のNextは、Componentが返すcompletionだけで有効化する。
- 進捗は初期実装ではLesson画面内memoryのみ。学習進捗の永続化は別の承認済み要件が必要。

### Responsive and accessibility

参照Atlasの次の実装パターンを維持します。

- 主要操作は`button`、`input`、`select`など標準要素で行う。
- 操作領域は原則44px以上。
- 状態は色だけでなく、`aria-pressed`、`disabled`、文字ラベル、`role=status` / `aria-live`で示す。
- DOMを再描画するComponentは、既存のfocus復元パターンを使う。
- 比較・関係・配置の横並びは、700px以下で1列へ落とす。
- 320px程度の狭い幅で、分詞句・関係説明・feedbackが横にはみ出さないことを確認する。
- キーボードだけで全Stepを完了できることを、実ブラウザで確認する。

## Historical Lesson design (Phase 1-4 interaction-first layout)

画面構造は全Lessonで次を固定します。

```text
Lesson title / goal
  ↓
Step progress
  ↓
Instruction
  ↓
既存Componentによる操作
  ↓
正誤・関係・理由のfeedback
  ↓
Next（completion後のみ）
```

`SEE → TOUCH → BUILD → JUDGE → APPLY` を独自の固定フローとして採用しません。参照Atlasの実際のLesson構造に合わせ、各Stepの認知活動に最適な既存Componentを割り当てます。

### Lesson 1 — 分詞とは何か

| Step | Existing interaction | 目的 | LR |
| --- | --- | --- | --- |
| 1 | Mark the Parts | 文中の名詞と分詞句を見つける | 001, 004 |
| 2 | Grammar Classifier | 分詞を形容詞的要素として分類する | 001, 002 |
| 3 | Word Order Builder | `the smiling baby`をまとまりとして組み立てる | 001, 005 |
| 4 | Sentence Comparison | 通常の形容詞と分詞の働きを対照する | 001, 002 |

### Lesson 2 — `-ing / p.p.` の基本

| Step | Existing interaction | 目的 | LR |
| --- | --- | --- | --- |
| 1 | Sentence Comparison | `-ing`と`p.p.`の意味軸を比較する | 002, 003 |
| 2 | Grammar Classifier | 能動・受動・完了の判断軸を分類する | 003, 010 |
| 3 | Error Corrector | `speaking / spoken`の誤答を訂正する | 008, 009 |
| 4 | Sentence Comparison | 訳の表面形と英文関係がずれる例を確認する | 003, 009 |

### Lesson 3 — 前置修飾・後置修飾

| Step | Existing interaction | 目的 | LR |
| --- | --- | --- | --- |
| 1 | Modifier Positioner | 分詞単独の前置位置を確認する | 005 |
| 2 | Modifier Positioner | 分詞句の後置位置と意味を確認する | 006 |
| 3 | Modifier Connection Viewer | 位置が変わっても説明対象を追う | 004, 006 |
| 4 | Word Order Builder | 名詞＋分詞句の語順を再構築する | 005, 006 |

### Lesson 4 — 名詞と分詞のHidden S-V

| Step | Existing interaction | 目的 | LR |
| --- | --- | --- | --- |
| 1 | Mark the Parts | 分詞が説明する名詞を選ぶ | 004 |
| 2 | Modifier Connection Viewer | `the baby → smile`の能動関係を確認する | 007 |
| 3 | Modifier Connection Viewer | `the language → speak`の受動関係を確認する | 008 |
| 4 | Grammar Classifier | `-ing / p.p.`を能動・受動へ分類する | 007, 008 |

### Lesson 5 — 感情動詞

| Step | Existing interaction | 目的 | LR |
| --- | --- | --- | --- |
| 1 | Grammar Classifier | `excite = 〜させる`の基本語義を分類する | 011 |
| 2 | Sentence Comparison | `exciting / excited`の与える・受けるを比較する | 012 |
| 3 | Error Corrector | 人・物だけで決める誤りを訂正する | 009, 012 |
| 4 | Context Grammar | 場面に合う感情表現を選ぶ | 011, 012 |

### Lesson 6 — 総合判断

| Step | Existing interaction | 目的 | LR |
| --- | --- | --- | --- |
| 1 | Mark the Parts | 初見文で説明対象を特定する | 004, 013 |
| 2 | Modifier Connection Viewer | 元動詞とHidden S-Vを確認する | 007, 008, 013 |
| 3 | Error Corrector | `-ing / p.p.`の誤答を訂正する | 003, 009, 010, 013 |
| 4 | Modifier Positioner | 前置・後置と意味を確認する | 005, 006, 013 |
| 5 | Context Grammar | 感情動詞を含む文脈で最終選択する | 011, 012, 013 |

## Proposed assessment evidence

各Problemは、選択した形だけでなく、次の証拠を可能な範囲で返します。

| Evidence | 例 | 対応要件 |
| --- | --- | --- |
| Target noun | `the baby` | 004, 007, 008 |
| Base verb | `smile` / `speak` | 007, 008 |
| Relation | active / passive / completion | 003, 007, 008, 010 |
| Position | pre-nominal / post-nominal | 005, 006 |
| Form | `-ing` / `p.p.` | 003, 007, 008, 012 |
| Reason | 名詞がする／される、感情を与える／受ける | 009, 011, 012, 013 |

## Traceability matrix

| OCR source | Project / LR | Existing interaction | Lesson | Assessment |
| --- | --- | --- | --- | --- |
| `chapter14-ocr.md:100-123` 分詞の働きと名称 | Goal / LR-001, 002 | Mark the Parts, Grammar Classifier | Lesson 1 | 分詞句の役割分類 |
| `chapter14-ocr.md:200-274` 前置・後置 | Goal / LR-004〜006 | Modifier Positioner, Modifier Connection Viewer | Lesson 3 | 位置・修飾先・意味 |
| `chapter14-ocr.md:281-312` Hidden S-V、能動・受動 | Goal / LR-007〜009 | Mark the Parts + Modifier Connection Viewer | Lesson 2, 4, 6 | 名詞・元動詞・関係・形 |
| `chapter14-ocr.md:170-180` 自動詞p.p. | Goal / LR-010 | Grammar Classifier, Error Corrector | Lesson 2, 6 | 受動ではなく完了の判定 |
| `chapter14-ocr.md:350-414` 感情動詞と`-ing / -ed` | Goal / LR-011, 012 | Sentence Comparison, Error Corrector, Context Grammar | Lesson 5, 6 | 与える／受けるの説明 |
| `chapter14-ocr.md:318-345`, `484-508` 発展・境界 | Goalの発展メモ / 基本Lesson外 | 既存Interactionを拡張しない | 対象外 | 基本判定と混同しない |

## Historical reuse metrics (Phase 1-4 baseline)

集計単位は、Phase 4までに実装した8つのInteraction typeと、1つの複合Lesson戦略です。複合戦略は新Componentではありません。

```text
Total implemented interaction types: 8
R0: 8
R1: 0
R2: 1
R3: 0
Reuse coverage (implemented types): 100%
```

- R0: Word Order Builder, Mark the Parts, Grammar Classifier, Modifier Positioner, Modifier Connection Viewer, Sentence Comparison, Error Corrector, Context Grammar
- R1: なし
- R2: Mark the Parts → Modifier Connection ViewerによるHidden S-V discovery sequence
- R3: なし

## Next-phase review gates

次フェーズへ進む前に、次を確認します。

1. `chapter14-ocr.md`のOCR誤認識候補と、教材へ採用する英文・訳を人間が確認する。
2. `being p.p.`、動名詞＋名詞、代用形容詞を、基本Lessonへ含めるか発展ページへ分けるか決める。
3. 分詞Problemの安定IDと、各問題の正答が一意か、許容別解があるかを確定する。
4. 既存の`label` / `explanation`だけでHidden S-Vの理解が成立することを、代表Problemのブラウザ操作で確認する。
5. 感情動詞の選択肢で、文法的には成立するがGoalに合わない選択をどう扱うか決める。
6. 参照Atlasの操作契約を実装側へ移す際、外部コード・外部教材・未確認ライセンスを取り込まない。
7. Problem / Lesson validator、pure logic、browser interaction、keyboard、狭い幅を検証する。
8. 実装後の受入条件を、`npm test`、`npm run check`、`npm run build`、実ブラウザの主要操作へ分ける。

Phase 1の受入確認を経て、Phase 2ではLesson 1〜3、Phase 3ではLesson 5、Phase 4ではLesson 6を実装・検証します。Problem Dataの量産や未確認の教材素材の追加は行いません。

## Phase 2 implementation update

### Implemented Lessons

- `PART-L1` — 分詞とは何か。4 steps。
- `PART-L2` — `-ing / p.p.` の基本。4 steps。
- `PART-L3` — 前置修飾・後置修飾。4 steps。
- `PART-L4` — 名詞と分詞のHidden S-V。Phase 1の8-step regression sliceを維持。

### Implemented Components

- Existing/reused generic components: `MarkTheParts`, `ModifierConnectionViewer`, `GrammarClassifier`, `WordOrderBuilder`, `SentenceComparison`, `ErrorCorrector`, `ModifierPositioner`。
- Phase 2では分詞教材専用のComponent APIを追加せず、Problem DataとLesson Registryで教材文を注入する構造を維持する。
- `ContextGrammar`は設計上の候補として残し、Phase 2の実装範囲には含めない。

### Reuse levels after Phase 2

```text
Total implemented interaction types: 7
R0: 7
R1: 0
R2: 1 (Hidden S-V sequence)
R3: 0
Reuse coverage: 100%
```

`R2`は新しいComponentではなく、`MarkTheParts → ModifierConnectionViewer`というLesson sequencingの再利用を指す。

### Known limitations

- Lesson 5・6と、未採用の発展教材はPhase 2時点では未実装。
- 進捗はLesson画面内のmemoryのみで、localStorage・DB・アカウントは追加していない。
- GitHub Pagesへの公開は行わない。リポジトリの公開範囲も変更しない。

### Phase 2 verification result

- `npm test` — 8 tests passed。
- `npm run check` — 20 problems、4 lessons、7 demo typesを検証。
- `npm run build` — static build passed。
- 実ブラウザでLesson 1〜4の主要操作、キーボード入力、Lesson遷移、誤配置からのリセットを確認済み。390px幅で横スクロールなし、比較カードと関係カードの1列化、コンソールエラーなしを確認した。

## Phase 3 implementation update

### Implemented Lesson

- `PART-L5` — 感情動詞。Grammar Classifier → Sentence Comparison → Error Corrector → Context Grammarの4 steps。
- 感情動詞を「〜させる」という元動詞から捉え、感情を与える側を`-ing`、受ける側を`-ed / p.p.`として判断する流れをProblem Dataへ定義した。

### Implemented Components and data

- `ContextGrammar`をAtlasの`contextGrammar.js`契約に沿って追加した。
- `getScenarioStep`、`getScenarioChoice`、`isAcceptedScenarioChoice`、`hasCompletedScenario`を`src/lib/grammar/context-grammar.js`へ分離した。
- `GrammarClassifier`、`SentenceComparison`、`ErrorCorrector`は既存Generic Componentを再利用し、Lesson 5のProblem Dataだけを追加した。
- Component APIは変更していない。教材固有の`exciting` / `excited`はComponentへハードコードしていない。

### Problem and Learning Requirement traceability

- `PART-L5-P001-CLASS` — LR-PART-011。感情動詞を「感情を起こす動詞」として分類。
- `PART-L5-P002-COMPARE` — LR-PART-012。`exciting / excited`をbase verb、役割、方向、形、意味で比較。
- `PART-L5-P003-ERROR` — LR-PART-009 / LR-PART-012。人・物ではなく、感情の与え手・受け手で訂正。
- `PART-L5-P004-CONTEXT` — LR-PART-011 / LR-PART-012。3-step会話で文脈から形を選択。

### Reuse levels after Phase 3

```text
Implemented interaction types: 8
R0: 8
R1: 0
R2: 1 (MarkTheParts → ModifierConnectionViewer Hidden S-V sequence)
R3: 0
```

### Validator and verification

- `context-grammar`のscenario、step、choice、`acceptedChoiceIds`、重複ID、参照切れ、空配列、LR ID、lessonIdを検証する。
- ContextGrammar pure logic、受入・拒否選択、Scenario完了、Lesson 1〜5のRegistry整合性をテストする。
- `npm test`、`npm run check`、`npm run build`、CI、デスクトップブラウザ、390px幅、キーボード操作、Reset、Lesson 1〜4回帰を確認する。

### Phase 3 known limitations (Phase 3時点)

- Lesson 6「総合判断」と最終Mastery判定はPhase 3時点では未実装だった。
- 進捗はLesson画面内のmemoryのみ。永続化、アカウント、サーバー、外部サービス、デプロイは追加していない。

## Phase 4 implementation update

### Implemented Lesson 6

- `PART-L6` — 総合判断。Mark the Parts → Modifier Connection Viewer → Error Corrector → Modifier Positioner → Context Grammarの5 steps。
- Lesson 1〜5で学んだ説明対象、元動詞、Hidden S-V、能動・受動・完了、位置、文脈を、初見英文と理由つき選択肢で統合する。
- `LR-PART-013`を全5 Problemへ付与し、総合判断の中心要件として追跡可能にした。

### Lesson 6 Problem traceability

| Problem | Interaction | LR | Evidence |
| --- | --- | --- | --- |
| `PART-L6-P001-MARK` | Mark the Parts | 004, 013 | 初見文の分詞が説明する名詞を選択 |
| `PART-L6-P002-REL` | Modifier Connection Viewer | 007, 008, 013 | target noun、`print`、受動Hidden S-V、`printed`をrelationで表示 |
| `PART-L6-P003-ERROR` | Error Corrector | 003, 009, 010, 013 | 自動詞`fall`の完了用法を`fallen`へ訂正 |
| `PART-L6-P004-POSITION` | Modifier Positioner | 005, 006, 013 | 1語の前置と分詞句の後置を意味つきで比較 |
| `PART-L6-P005-CONTEXT` | Context Grammar | 011, 012, 013 | 3-step会話で形と感情の向きを理由つきで選択 |

### End-to-End LR coverage matrix

| LR | Lesson | Problem | Interaction | Evidence |
| --- | --- | --- | --- | --- |
| LR-PART-001 | 1 | `PART-L1-P001-MARK` | Mark the Parts | 分詞と名詞の形容詞的関係 |
| LR-PART-002 | 1, 2 | `PART-L1-P002-CLASS`, `PART-L2-P001-COMPARE` | Grammar Classifier / Sentence Comparison | 名称を時制と同一視しない |
| LR-PART-003 | 2, 6 | `PART-L2-P001-COMPARE`, `PART-L6-P003-ERROR` | Sentence Comparison / Error Corrector | 能動・受動と完了の意味軸 |
| LR-PART-004 | 1, 4, 6 | `PART-L1-P001-MARK`, `PART-L4-P001-MARK`, `PART-L6-P001-MARK` | Mark the Parts | 説明対象の名詞 |
| LR-PART-005 | 1, 3, 6 | `PART-L1-P003-WORD`, `PART-L3-P001-POSITION`, `PART-L6-P004-POSITION` | Word Order / Modifier Positioner | 分詞1語の前置 |
| LR-PART-006 | 3, 6 | `PART-L3-P002-POSITION`, `PART-L6-P004-POSITION` | Modifier Positioner | 分詞句の後置と境界 |
| LR-PART-007 | 4, 6 | `PART-L4-P001-REL`, `PART-L6-P002-REL` | Modifier Connection Viewer | 名詞が元動詞をするHidden S-V |
| LR-PART-008 | 2, 4, 6 | `PART-L2-P003-ERROR`, `PART-L4-P002-REL`, `PART-L6-P002-REL` | Error Corrector / Modifier Connection Viewer | 名詞が元動詞をされるHidden S-V |
| LR-PART-009 | 2, 4, 5, 6 | `PART-L2-P003-ERROR`, `PART-L5-P003-ERROR`, `PART-L6-P003-ERROR` | Error Corrector | 訳・人/物だけで決めない |
| LR-PART-010 | 2, 6 | `PART-L2-P002-CLASS`, `PART-L6-P003-ERROR` | Grammar Classifier / Error Corrector | 自動詞p.p.の完了 |
| LR-PART-011 | 5, 6 | `PART-L5-P001-CLASS`, `PART-L6-P005-CONTEXT` | Grammar Classifier / Context Grammar | 感情動詞を「〜させる」と捉える |
| LR-PART-012 | 5, 6 | `PART-L5-P002-COMPARE`, `PART-L6-P005-CONTEXT` | Sentence Comparison / Context Grammar | 感情の与え手・受け手 |
| LR-PART-013 | 6 | `PART-L6-P001-MARK`〜`PART-L6-P005-CONTEXT` | 既存5 Interaction | 初見英文で判断手順を最後まで適用 |

### Reuse metrics after Phase 4

```text
Implemented interaction types: 8
R0: 8
R1: 0
R2: 1 (MarkTheParts → ModifierConnectionViewer Hidden S-V sequence)
R3: 0
```

新規Interaction、Component API、Problem Typeは追加していない。Lesson 6は既存Interactionの組み合わせとして実装した。

### Phase 4 verification result

- `npm test` は12件、`npm run check` は29 Problems・6 Lessons・8 Interaction types、`npm run build`、`git diff --check` が成功した。
- `validateProblems`、`validateLessons`、LR-PART-001〜013 coverage、Lesson順、Lesson 6全ProblemのLR-PART-013付与を検証した。
- 実ブラウザで全Lesson経路、Lesson 6の5 Step、keyboard/focus、Reset、390px幅、Lesson 1〜5回帰、コンソールエラーなしを確認した。GitHub ActionsのCIも成功した。
- Lesson 6完了時だけ `All lessons complete — 分詞を見たら、名詞と動詞の関係を見る。` を表示し、Lesson 1〜5ではLesson単位の完了表示に留める。

### Final known limitations

- 分詞構文、独立分詞構文、`with + O + 分詞`、高度な例外事項は対象外。
- 進捗はLesson画面内のmemoryのみ。localStorage、アカウント、サーバー、DB、外部API、analyticsは追加していない。
- 自由入力のLLM採点、初回正答率の保存、外部API・ユーザーアカウント・サーバーDBは行わない。

## Phase 5 implementation update

### Explanation-first architecture

Phase 5の画面順は、全Lessonで次に固定します。

```text
LEARN（解説・例文）
  → SEE（構造・ルール・誤り・入試POINT）
  → TOUCH（既存Interaction）
  → PRACTICE（Exam Multiple Choice / Word Order）
  → REVIEW（詳細復習・要約・出典）
```

説明は `src/data/content/lesson-1.js`〜`lesson-6.js` に保持し、`src/components/explanation/explanationRenderer.js` が全Lessonを同じRendererで描画します。`app.js`はLessonの配置とProblemの接続だけを担当します。各Explanation sectionには`sourceEvidence`を持たせ、Rendererと`validateLessonContent`で確認します。

### Lesson content inventory

| Lesson | Explanation sections | Examples | 中心内容 |
| --- | ---: | ---: | --- |
| 1 | 3 | 5 | 分詞とは何か / 形容詞と同じ場所で働く / 今回扱う範囲 |
| 2 | 3 | 7 | 現在分詞・過去分詞という名前 / 能動・受動で形を選ぶ / p.p.の完了・結果状態 |
| 3 | 3 | 5 | 分詞1語の前置修飾 / 分詞句の後置修飾 / 「1語なら必ず前」ではない |
| 4 | 3 | 5 | 名詞と分詞の間にあるHidden S-V / 能動なら-ing、受動ならp.p. / Hidden S-Vの6ステップ |
| 5 | 3 | 7 | 感情動詞は「〜させる」 / 感情を与える側・受ける側 / 語彙を広げても同じ判断 |
| 6 | 3 | 7 | 6ステップの実践判断 / -ing・p.p. / 述語動詞と修飾部分の分離 |

各Lessonは、本文・4〜7例文・Key Rules・よくある間違い・入試POINT・Detailed Review・Summary・Source evidenceを持ちます。説明を読んだだけでも中心概念を理解できる量を確保し、Interactionは確認と再利用のために置きます。

### Assessment inventory

Atlasの`exam-multiple-choice` R0 Componentとpure evaluationを再利用し、分詞固有の4択Componentは新設していません。`src/data/problems/exam-multiple-choice.js`にはLesson 1〜5の15問を保持し、Lesson 6は共通Componentを使う`practice-multiple-choice`へ分離しています。

| Lesson | Exam MC | difficulty内訳 |
| --- | ---: | --- |
| 1 | 2 | basic 2 |
| 2 | 3 | standard 2 / entrance 1 |
| 3 | 2 | standard 2 |
| 4 | 4 | standard 2 / entrance 2 |
| 5 | 4 | standard 2 / entrance 2 |
| 6 | — | — |
| **Total** | **15** | **basic 2 / standard 7 / entrance 6** |

Exam IDs:

`PART-L1-EXAM-001`, `PART-L1-EXAM-002`, `PART-L2-EXAM-001`, `PART-L2-EXAM-002`, `PART-L2-EXAM-003`, `PART-L3-EXAM-001`, `PART-L3-EXAM-002`, `PART-L4-EXAM-001`, `PART-L4-EXAM-002`, `PART-L4-EXAM-003`, `PART-L4-EXAM-004`, `PART-L5-EXAM-001`, `PART-L5-EXAM-002`, `PART-L5-EXAM-003`, `PART-L5-EXAM-004`。

全問が4選択肢、正答、全選択肢の説明、全体説明、difficulty、misconceptions、Learning Requirement、OCR source evidenceを持ちます。誤答時も正答と4選択肢の理由を表示し、Resetできます。Assessment navigationは一問ずつ前後へ移動でき、正誤で次の問題をロックしません。

Word Orderは既存`WordOrderBuilder`をそのまま再利用し、既存Problem APIに`translation`、`fixedPrefix`、`fixedSuffix`、`explanationSteps`、difficulty、misconceptionsをoptional dataとして追加しました。Lesson 3〜4のEntrance Word Order 4問を保持します。

`PART-L3-EXAM-WORD-001`, `PART-L3-EXAM-WORD-002`, `PART-L4-EXAM-WORD-001`, `PART-L4-EXAM-WORD-002`。

分布は、L1=0、L2=0、L3=2、L4=2、L5=0、L6=0です。

### Traceability and reuse

- `LR-PART-001`〜`LR-PART-013`は既存ProblemとPhase 5のExam / Word Orderへ紐づき、`scripts/check.mjs`が全要件の参照を検証します。
- Explanationの各sectionとExam / Word Orderは`chapter14-ocr.md`の該当範囲を`sourceEvidence`で保持します。
- R0=9（既存8種類 + Exam Multiple Choice）、R1=0、R2=1（Hidden S-Vのsequence）、R3=0です。
- Phase 5で新設したInteraction type / Participle専用の操作Componentは0です。Exam MCはAtlasの`src/components/demos/examMultipleChoice.js`と`src/lib/grammar/exam-multiple-choice.js`を参照実装として再利用します。
- 実装した9種類のInteractionは、Mark the Parts、Modifier Connection Viewer、Grammar Classifier、Word Order Builder、Sentence Comparison、Error Corrector、Modifier Positioner、Context Grammar、Exam Multiple Choiceです。

### Phase 5 validation and acceptance

検証の正本は`package.json`の`npm test`、`npm run check`、`npm run build`、`npm run test:runtime`です。`tests/browser/phase5.spec.js`ではHomeからLesson 1〜6のExplanation-first順、Examの誤答・正答・Reset・全選択肢レビュー、Word Orderの誤答・正答・詳細説明、キーボード操作、390px幅の横はみ出し、全既存Interaction typeの受入経路を確認します。Phase 5の実行結果は実装完了時にこの節へ追記します。

### Phase 5 limitations

- 分詞構文、独立分詞構文、`with + O + 分詞`、動名詞＋名詞、`being p.p.`などの発展事項は追加していません。
- score storage、mastery、analytics、auth、DB、LLM自由記述採点は実装していません。進捗は従来どおりLesson画面内memoryのみです。
- Exam Multiple Choiceは一問ずつの確認フローで、受験結果の永続化や試験モードはありません。

## Phase 6 implementation update

- `PROJECT_GOAL.md`をExplanation-firstの現行方針と整合させ、`DESIGN.md`にも固定の整合性マーカーを置きました。
- GitHub Pagesの自動デプロイWorkflowを`.github/workflows/pages.yml`として有効化し、`scripts/check.mjs`はCI workflowだけをvalidation-onlyとして検査します。リポジトリの公開範囲は変更していません。
- Lesson 1・3・6の例文、評価問題の曖昧な目的語補語に見える例、Lesson 6のWord Orderを修正しました。入試Word Orderは`assessmentKind: 'entrance'`で8問に分離し、Lesson 1の基本Interactionは評価欄に混ぜません。
- Explanation / Exam / entrance Word Orderの出典に`heading`、`lineStart`、`lineEnd`、`concept`を持たせ、OCR行数・見出し存在・範囲・非空概念を`npm run check`で検証します。section内の出典は閉じたnative `details`で確認できます。
- 入試4択の誤答には少なくとも2件の`distractorReview`を紐づけ、日本語中心の見出しへ更新しました。

## Phase 7 implementation update — Explanation-aligned Practice

Phase 7以降のPracticeは、固定した日本語解説を起点に次の順で構成する。

```text
Japanese Explanation is frozen.
Interactive Check explains the explanation.
Exam Practice tests transfer.
Word Order is used only when syntax construction is itself instructional.
```

日本語解説を正本として固定する。Interactive Checkは解説を理解するために置く。4択は初見英文への転移を確認する。語句整序は、語順・修飾構造の構築そのものに学習価値がある場合だけ使う。解説ファイルのhashは`scripts/frozen-lesson-content.json`に保存し、`npm run check`で変更を拒否する。

Lessons 1–5 teach and rehearse the grammar. Lesson 6 is a source-grounded practical transfer lesson. Interactive Checkは20 Step（L1=3、L2=4、L3=3、L4=6、L5=4、L6=0）、Exam Multiple Choiceは15問、Entrance Word Orderは4問（L1=0、L2=0、L3=2、L4=2、L5=0、L6=0）とする。`分詞を見たら、名詞と動詞の関係を見る。`を全Lessonの判断軸にする。Lesson 1〜5は`mode: 'standard'`、Lesson 6は`mode: 'practice'`とし、Lesson 6の旧Interactive / Exam / Word Orderは退役させる。

### Practice Traceability Matrix

| Lesson | Explanation Section | Interactive Problem | Exam Problem | Word Order Problem | Learning Requirement |
| --- | --- | --- | --- | --- | --- |
| 1 | `PART-L1-EXPLAIN-01`, `-02` | `PART-L1-P004-COMPARE`, `PART-L1-P001-MARK`, `PART-L1-P002-CLASS` | `PART-L1-EXAM-001`, `-002` | — | 分詞は動詞由来で名詞を説明する形容詞的要素 |
| 2 | `PART-L2-EXPLAIN-01`, `-02`, `-03` | `PART-L2-P001-COMPARE`, `PART-L2-P002-CLASS`, `PART-L2-P003-ERROR`, `PART-L2-P004-COMPARE` | `PART-L2-EXAM-001`, `-002`, `-003` | — | 名詞がする・される・変化が完了した関係から形を選ぶ |
| 3 | `PART-L3-EXPLAIN-01`, `-02`, `-03` | `PART-L3-P001-POSITION`, `PART-L3-P002-POSITION`, `PART-L3-P004-COMPARE` | `PART-L3-EXAM-001`, `-002` | `PART-L3-EXAM-WORD-001`, `-002` | 1語の前置、分詞句の後置、1語後置の文脈 |
| 4 | `PART-L4-EXPLAIN-01`, `-02`, `-03` | `PART-L4-P001-MARK`, `PART-L4-P001-REL`, `PART-L4-P002-MARK`, `PART-L4-P002-REL`, `PART-L4-P003-MARK`, `PART-L4-P003-REL` | `PART-L4-EXAM-001`〜`-004` | `PART-L4-EXAM-WORD-001`, `-002` | Hidden S-Vで対象名詞・元動詞・能動受動・形を判断 |
| 5 | `PART-L5-EXPLAIN-01`, `-02` | `PART-L5-P002-COMPARE`, `PART-L5-P001-GIVER-RECEIVER`, `PART-L5-P003-COMPARE-BORING`, `PART-L5-P004-CONTEXT` | `PART-L5-EXAM-001`〜`-004` | — | 感情のgiver/causeとreceiver/experiencerから-ing/-edを選ぶ |
| 6 | `PART-L6-EXPLAIN-01`, `-02`, `-03` | `PART-L6-PRACTICE-Q001`〜`Q003`, `PART-L6-PRACTICE-101`〜`110` | — | — | 初見英文を述語動詞、target noun、base verb、関係、形の順に処理する |

全Practice Problemは`contentRefs`で同一Lessonの固定Explanation sectionへ結び付く。`validateProblems`は空配列、重複、未知ID、別Lessonの参照を拒否し、`scripts/check.mjs`はMatrixの数とLesson構成を検証する。

## Phase 8 follow-up — Lesson 6 Practical and OCR reconstruction

Lesson 6は、OCRで確認できた分詞問題を扱う`mode: 'practice'`の`practice-multiple-choice` Lessonとする。構成はQuick 3問、Form 5問、Structure 5問の計13問である。Lesson 1〜5の標準経路は維持し、Lesson 6の旧Interactive Check、標準Exam Multiple Choice、Entrance Word Orderは退役させる。

Problem 101と104は、OCRの残存断片・解答解説・文法関係から最小限に復元した`reconstructed exercise`である。`sourceReconstruction`と`reconstructionEvidence`をProblem Dataに保持し、`verified verbatim original university exam`とは扱わない。Q-A01とQ-A02のOCRにない比較選択肢は、choice単位の`authoredDistractor: true`で明示する。これらのtraceability metadataは開発用であり、生徒画面には表示しない。

Lesson 6の実践UIは、既存の`ExamMultipleChoice`を共通実装として再利用し、`renderAfterExplanation`の拡張点からStructure問題の`analysisSteps`（predicate、modifier、target、base、relation、answer）を表示する。専用の選択・採点・Reset実装やComponent APIは増やさない。`PART-L6-PRACTICE-106`〜`110`は、述語動詞と名詞修飾を分ける6段階の分析を回帰テストで固定する。

## Deployment

- GitHub Pagesは`.github/workflows/pages.yml`で`main`の`dist`を公開し、`.github/workflows/ci.yml`は検証専用とする。
- リポジトリの公開・非公開設定はこの実装では変更しない。
- 既存の公開URLや過去の公開物は、現在のリリース操作や検証結果を示すものとして扱わない。
