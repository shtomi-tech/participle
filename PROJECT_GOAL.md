# 分詞インタラクティブ教材 — Project Goal

## Status

これは教材設計と実装の正本です。Phase 3まで（Lesson 1〜5、汎用Interaction、Problem Data、validator、CI）は実装済みです。Lesson 6とプロジェクト全体の最終受入条件は未完了で、次フェーズで継続します。

## Source boundary

教材内容の一次資料は次の2ファイルです。

- `chapter14-ocr.md`
- `chapter14-ocr.json`

OCRには校正・補完を加えていません。OCRの判読が不確かな箇所、本文の異同、例外事項は、確認できるまで教材上の確定事実として扱いません。

インタラクション、Lesson構造、Problem DataとComponentの分離、正誤判定、進捗、アクセシビリティの参照元は、別リポジトリ `C:\Users\shtom\dev\english-grammar-interactive-atlas` です。教材内容と実装パターンの出典を混同しません。

## Project vision

高校生が、分詞を「動詞由来の形容詞」として理解し、名詞と動詞の能動・受動関係を可視化・操作することで、`-ing / p.p.` を暗記だけに頼らず判断できるようにする。

中心となる学習習慣は次の一文にまとめます。

> 分詞を見たら、名詞と動詞の関係を見る。

## Target learner behavior

未知の英文に対して、学習者が次の順に自力で考えられる状態を目指します。

1. 分詞が説明している名詞を特定する。
2. 分詞の元になった動詞を認識する。
3. 名詞と動詞の意味上の関係を考える。
4. 「名詞が〜する」なら能動と判断する。
5. 「名詞が〜される」なら受動と判断する。
6. 文脈と位置を確認し、`-ing / p.p.` を選択する。

感情動詞では、さらに次を行います。

1. 動詞そのものを「〜させる」として理解する。
2. 感情を与える側なら `-ing`、感情を受ける側なら `p.p. / -ed` と判断する。

## Teaching hypothesis

日本語訳だけで「〜しているなら `-ing`」「人なら `-ed`」と決めると、`the language spoken in that country` や `You are boring.` のような文で誤りやすい。そこで、英文の操作対象を単語の形だけにせず、次の関係へ移します。

```text
分詞
  ↓
説明される名詞
  ↓
元の動詞
  ↓
名詞がする / される
  ↓
-ing / p.p.
```

画面上の正解表示だけで終わらせず、選んだ名詞、元動詞、能動・受動、意味を同じProblem Dataから説明できるようにします。

## Learning scope

最低限、次の6 Lessonで構成します。

1. 分詞とは何か
2. `-ing / p.p.` の基本
3. 前置修飾・後置修飾
4. 名詞と分詞のHidden S-V
5. 感情動詞
6. 総合判断

各Lessonは、Atlasの既存Lessonと同じく、複数のProblemを学習目的に沿って順序づけたものにします。1画面に文法ロジックを集めず、Problem Dataと再利用可能なComponentを分離します。

## In scope

- 分詞の形容詞的用法
- `-ing` と `p.p.` の能動・受動関係
- 分詞が説明する名詞の特定
- 前置修飾と後置修飾
- 名詞と分詞の意味上のS-V関係
- 自動詞の過去分詞による完了の意味
- 感情動詞の基本語義と `-ing / -ed`
- 例文の選択、分類、並べ替え、比較、訂正、文脈判断

## Non-goals

今回の中心スコープには次を含めません。

- 分詞構文
- 独立分詞構文
- `with + O + 分詞`
- 分詞構文の書き換え
- 高度な例外事項
- 分詞と動名詞の完全な文法体系
- 自由入力をLLMで採点する仕組み
- 音声認識、外部API、ユーザーアカウント、サーバーDB

OCRに登場する `being p.p.`、動名詞＋名詞、代用形容詞は、基本Lessonの理解を壊さない範囲の発展・境界メモとして扱います。中心の判定ルールへ混ぜず、次フェーズで採否を確認します。

## Completion criteria for the project goal

設計と実装を通じて、少なくとも次を確認できる状態を完成条件とします。

- 学習者が分詞の説明対象を選択できる。
- 学習者が元動詞を取り出し、名詞との関係を説明できる。
- `-ing` と `p.p.` を能動・受動の関係から選べる。
- 前置修飾と後置修飾を位置と意味の両方で区別できる。
- 自動詞の過去分詞を、機械的に受動と判定しない。
- `exciting / excited` を「物 / 人」だけでなく、感情を与える側・受ける側で判断できる。
- 各判断が、正答・説明・次の練習へ追跡可能である。

## Traceability chain

```text
OCR Source
  ↓
Project Goal
  ↓
Learning Requirement
  ↓
Existing Atlas Interaction
  ↓
Problem Data adaptation
  ↓
Lesson
  ↓
Assessment / completion
```
