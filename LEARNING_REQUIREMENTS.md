# 分詞インタラクティブ教材 — Learning Requirements

## Contract notes

- 要件IDは安定IDとして扱います。
- 教材内容の根拠は `chapter14-ocr.md` と `chapter14-ocr.json` です。
- `interactionId`、`problemId`、`lessonId` はこの文書へ埋め込まず、`DESIGN.md` で後段の対応づけを行います。
- OCR本文は校正・補完していないため、Source Evidenceは確認できた範囲の要約です。
- `-ing` / `p.p.` は教材上の表記を維持します。用語の細部より、名詞と元動詞の関係を優先します。

## LR-PART-001

### Learning Outcome

分詞を、動詞から分かれた形であり、文中では形容詞のように働くものとして説明できる。

### Core Concept

分詞は動詞由来だが、今回の中心スコープでは名詞を修飾したり補語になったりする形容詞的用法を扱う。

### Decision Rule

分詞を見たら、まず「どの名詞を説明しているか」を探す。動詞の時制を表す形と即断しない。

### Prerequisite

名詞、動詞、形容詞の基本的な役割を知っている。

### Common Misconceptions

- 分詞は常に文の中心動詞である。
- `-ing` は必ず進行形の一部である。
- 分詞は単語単体の訳だけを覚えればよい。

### Evidence of Mastery

`smiling baby` のような句で、`smiling` が `baby` を説明する形容詞的要素だと選択・説明できる。

### Source Evidence

`chapter14-ocr.md:100-106` は分詞を動詞から分かれた詞とし、形容詞・副詞の働きを持つと説明する。`chapter14-ocr.md:108-119` は補語と名詞修飾の例を示す。副詞的用法は今回のNon-goalである。

## LR-PART-002

### Learning Outcome

「現在分詞」「過去分詞」という名称を、現在時制・過去時制の意味と同一視しない。

### Core Concept

`-ing` と `p.p.` の名称に含まれる現在・過去は、今回の名詞修飾の判断における時制そのものではない。

### Decision Rule

時制を先に当てはめず、名詞と元動詞の関係、必要なら進行・完了の意味を分けて確認する。

### Prerequisite

現在形・過去形という時制の概念と、`-ing` / `p.p.` の形を識別できる。

### Common Misconceptions

- 「現在分詞だから現在のこと」「過去分詞だから過去のこと」と決める。
- 日本語の「〜した」だけで過去時制と判断する。

### Evidence of Mastery

過去の出来事でない `the spoken language`、現在の状態を表す `the grown children` などを、名称ではなく関係と意味から判定できる。

### Source Evidence

`chapter14-ocr.md:120-123` は現在分詞・過去分詞が時制とほぼ関係しないと述べる。`chapter14-ocr.md:170-180` は自動詞の過去分詞 `grown` を完了の意味で扱う。

## LR-PART-003

### Learning Outcome

`-ing` と `p.p.` が、進行・完了の軸と能動・受動の軸を持つことを区別し、名詞修飾ではまず能動・受動に注目できる。

### Core Concept

`-ing` は基本的に「〜する」側、`p.p.` は基本的に「〜される」側を表す。別に、`-ing` には進行中、`p.p.` には完了の意味が現れることがある。

### Decision Rule

名詞修飾の空所では、まず「名詞が元動詞をするか、されるか」を確認する。進行・完了の読みが必要な場合だけ、その軸を追加で確認する。

### Prerequisite

LR-PART-001、LR-PART-002。能動態と受動態の直感的な違い。

### Common Misconceptions

- `-ing` と `p.p.` を時制だけで分類する。
- `p.p.` は必ず受動である。
- 日本語の語尾だけで形を決める。

### Evidence of Mastery

`coming from abroad` と `recommended hotels` を、前者は能動、後者は受動として説明できる。

### Source Evidence

`chapter14-ocr.md:120-140` は2つの意味軸を示し、後半で能動・受動を重視する方針を示す。`chapter14-ocr.md:307-312` は `recommended` と `coming` の対照例を示す。

## LR-PART-004

### Learning Outcome

分詞が説明している名詞を、文の語順に惑わされずに特定できる。

### Core Concept

分詞の形より先に、分詞と意味上結び付く名詞を見つける。名詞と分詞の間に意味上の関係を置く。

### Decision Rule

分詞を含むまとまりを囲み、「何が／誰がその動作・状態なのか」を質問する。答えになる名詞を説明対象とする。

### Prerequisite

名詞句の境界、前置修飾・後置修飾の基本。

### Common Misconceptions

- 分詞の直前にある語だけを機械的に修飾対象にする。
- 文頭の名詞句と文全体の主語を区別しない。

### Evidence of Mastery

`the children laughing at the clown` で、`laughing at the clown` の説明対象が `children` だと選べる。

### Source Evidence

`chapter14-ocr.md:208-215` は `laughing` と `laughing at the clown` が `children` を修飾する例を示す。`chapter14-ocr.md:283-287` は名詞と分詞の関係から判別するよう求める。

## LR-PART-005

### Learning Outcome

分詞単独の前置修飾を認識し、名詞の前に置かれた分詞のまとまりを読める。

### Core Concept

分詞が単独で名詞を修飾する場合、原則として名詞の前に置かれる。

### Decision Rule

`-ing / p.p. + 名詞` の形を見たら、分詞が後ろの名詞を説明している可能性を確認する。

### Prerequisite

LR-PART-001、LR-PART-004。

### Common Misconceptions

- 分詞は必ず名詞の後ろに置かれる。
- 前置修飾では能動・受動の関係を考えなくてよい。

### Evidence of Mastery

`the smiling baby`、`the used car` を、分詞がそれぞれ `baby`、`car` を説明する前置修飾として分類できる。

### Source Evidence

`chapter14-ocr.md:204-215` は分詞単独の前置修飾と、複数語を伴う後置修飾を対比する。`chapter14-ocr.md:261-269` は `the smiling baby` と `the used car` を示す。

## LR-PART-006

### Learning Outcome

分詞を含む2語以上のまとまりが名詞の後ろから修飾することを認識し、1語でも後置修飾できるという例外を保留付きで扱える。

### Core Concept

分詞に修飾語や補語が加わると、具体的な状況を表すまとまりになり、名詞の後ろに置かれることが多い。

### Decision Rule

分詞を含むまとまりが2語以上なら、まず直前の名詞を説明する後置修飾として読む。1語の後置修飾は「常に誤り」とせず、文脈で確認する。

### Prerequisite

LR-PART-004、LR-PART-005。

### Common Misconceptions

- 「1語は必ず前、2語以上は必ず後」という絶対規則にする。
- 後置修飾を分詞構文と混同する。

### Evidence of Mastery

`the baby smiling at her mother` と `the language spoken in that country` の修飾範囲を示せる。また、`the girl dancing` のような1語の後置修飾を「あり得るが文脈確認」と扱える。

### Source Evidence

`chapter14-ocr.md:200-207` は基本原則を示し、`chapter14-ocr.md:222-243` は1語の後置修飾と、前後位置による一時性・具体性を説明する。`chapter14-ocr.md:245-274` は形別の前置・後置修飾を整理する。

## LR-PART-007

### Learning Outcome

名詞が元動詞を行う関係を、Hidden S-Vとして発見し、`-ing` を選択できる。

### Core Concept

分詞と名詞の間には、表面には書かれていないS-V関係がある。名詞が動作主なら能動関係になる。

### Decision Rule

`名詞が + 元動詞` の短い文を頭の中で作る。その文が自然な能動関係なら `-ing` を使う。

### Prerequisite

LR-PART-003、LR-PART-004。主語と動詞の関係。

### Common Misconceptions

- `-ing` を日本語の「〜している」だけで選ぶ。
- 分詞の直前の単語とだけ関係づける。

### Evidence of Mastery

`the baby smiling at her mother` について、`the baby smiles` → 能動 → `smiling` と説明できる。

### Source Evidence

`chapter14-ocr.md:281-295` は名詞と分詞のSV関係を明示し、`the baby` が `smile` するため `-ing` になると示す。

## LR-PART-008

### Learning Outcome

名詞が元動詞を受ける関係を、Hidden S-Vとして発見し、`p.p.` を選択できる。

### Core Concept

名詞が動作を受けるなら受動関係であり、過去分詞を使う。

### Decision Rule

`名詞が + 元動詞` を試し、「名詞が〜される」となるなら `p.p.` を選ぶ。

### Prerequisite

LR-PART-003、LR-PART-004、LR-PART-007。

### Common Misconceptions

- 日本語訳が「〜している」なら `-ing` にする。
- 人・物だけで `-ing / -ed` を決める。

### Evidence of Mastery

`the language spoken in that country` について、`the language is spoken` → 受動 → `spoken` と説明できる。

### Source Evidence

`chapter14-ocr.md:296-304` は `the language` が `speak` される受動関係であるため `spoken` を使うと説明する。

## LR-PART-009

### Learning Outcome

日本語訳の表面的な語尾ではなく、名詞と元動詞のS-V関係を根拠に判断できる。

### Core Concept

翻訳は手がかりにはなるが、形の決定規則ではない。能動・受動の意味関係を優先する。

### Decision Rule

訳で仮説を立てた後、必ず「名詞がする／される」の英文関係へ戻って判定する。

### Prerequisite

LR-PART-007、LR-PART-008。

### Common Misconceptions

- 「〜している」なら必ず `-ing`。
- 「人」なら必ず `-ed`、「物」なら必ず `-ing`。

### Evidence of Mastery

`You are boring.` と `You are bored.`、`the language spoken ...` を、主語の種類ではなく感情・動作の与え手／受け手や受動関係で説明できる。

### Source Evidence

`chapter14-ocr.md:301-306` は日本語訳だけで判定してはいけないと述べる。`chapter14-ocr.md:403-413` は「人なら-ed、物なら-ing」という判定を否定する。

## LR-PART-010

### Learning Outcome

自動詞の過去分詞を、受動ではなく完了の意味で読める場合があると判断できる。

### Core Concept

自動詞は目的語を取らず受動態になれないため、自動詞由来の `p.p.` は受動ではなく「〜した／〜してしまった」という完了の読みになることがある。

### Decision Rule

元動詞が自動詞で、受動の目的語関係を作れない場合は、`p.p.` の完了用法を候補にする。語彙と文脈で確認し、機械的に受動としない。

### Prerequisite

自動詞・他動詞、受動態の基本。

### Common Misconceptions

- 過去分詞は必ず「〜される」。
- 自動詞でも受動態を作れる。
- `grown`、`fallen`、`gone` を過去時制としてだけ読む。

### Evidence of Mastery

`grown children`、`fallen leaves` を、受動ではなく成長・落下が完了した状態として説明できる。

### Source Evidence

`chapter14-ocr.md:170-180` は自動詞のp.p.が受動になれず、完了の意味になると説明する。例として `gone / fallen / grown / retired` を挙げる。

## LR-PART-011

### Learning Outcome

感情動詞を、単なる感情状態ではなく「人を〜させる」という基本語義から認識できる。

### Core Concept

`surprise`、`interest`、`excite`、`disappoint`、`please` などは、原則として他動詞で、対象に感情を起こさせる。

### Decision Rule

感情動詞を見たら、まず「誰か／何かを〜させる」と言い換える。直後に人などの目的語が来る他動詞用法と、形容詞化した用法を区別する。

### Prerequisite

他動詞と目的語、形容詞的な分詞。

### Common Misconceptions

- `surprise` を「驚く」とだけ覚える。
- 感情動詞の目的語を省略したまま、状態形容詞と同じに扱う。
- すべての感情動詞が例外なく他動詞だとする。

### Evidence of Mastery

`He surprised his wife ...` の `surprise` が「妻を驚かせた」と説明でき、`interesting / interested` を元動詞 `interest` から説明できる。

### Source Evidence

`chapter14-ocr.md:350-382` は感情動詞の「〜させる」用法、他動詞、`-ing`、`p.p.` の3つの使い方を整理する。`chapter14-ocr.md:471-479` は自動詞用法の例外に触れる。

## LR-PART-012

### Learning Outcome

感情動詞の `-ing / -ed` を、感情を与える側・受ける側として使い分けられる。

### Core Concept

`-ing` は感情を起こさせる側、`p.p. / -ed` はその感情を受ける側を表す。

### Decision Rule

主語が周囲に感情を与えるなら `-ing`、主語がその感情を受けるなら `-ed`。人か物かは補助情報にとどめる。

### Prerequisite

LR-PART-007、LR-PART-008、LR-PART-011。

### Common Misconceptions

- 主語が人なら必ず `-ed`。
- 主語が物なら必ず `-ing`。
- `bored` と `boring` の違いを語尾の暗記だけで済ませる。

### Evidence of Mastery

`The movie is exciting.`、`I am excited.`、`You are boring.`、`You are bored.` を、感情の与え手・受け手で説明できる。

### Source Evidence

`chapter14-ocr.md:388-400` は `-ing` と `p.p.` の意味差を `bore` で説明する。`chapter14-ocr.md:403-414` は人・物による判定を退け、与える／受けるで判定するよう求める。

## LR-PART-013

### Learning Outcome

未知の英文で、説明対象、元動詞、S-V関係、位置、文脈を順に確認し、`-ing / p.p.` の判断と理由を短く説明できる。

### Core Concept

分詞判定は形の暗記ではなく、構造・意味・位置・語法をつなぐ診断手順である。

### Decision Rule

```text
1. 分詞を見つける
2. 説明対象の名詞を特定する
3. 元動詞を戻す
4. 名詞がする / されるを判定する
5. 前置 / 後置と文脈を確認する
6. 自動詞なら完了の可能性を確認する
7. 感情動詞なら与える / 受けるを確認する
8. 形と理由を答える
```

### Prerequisite

LR-PART-001〜LR-PART-012のうち、対象問題に必要な要件。

### Common Misconceptions

- 訳、位置、人・物、語尾の1条件だけで決める。
- 正答を選べても、名詞と元動詞の関係を説明しない。
- 発展事項を基本ルールへ混ぜて、中心判断を曖昧にする。

### Evidence of Mastery

初見の分詞句について、`target noun`、`base verb`、`active/passive or completion`、`-ing/p.p.` を順に選び、誤答の理由も説明できる。最終Lessonでは、文中の複数の分詞をそれぞれ独立に判断できる。

### Source Evidence

`chapter14-ocr.md:281-306` は名詞と分詞のSV関係による基本判定を中心に置く。`chapter14-ocr.md:318-345` は受動進行・動名詞＋名詞との境界を発展事項として示す。`chapter14-ocr.md:484-508` は代用形容詞を発展扱いとして示す。

