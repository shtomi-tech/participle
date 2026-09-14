import { escapeHtml } from '../lib/dom.js';
import { prepareMountRoot } from '../lib/lifecycle.js';
import { loadParticipleProgress, saveParticipleProgress } from '../lib/participle-progress.js';
import { participleLessons, participleStageLabels } from '../data/participle-course.js';
import { renderLessonProgress } from './participle/LessonProgress.js';
import { renderLessonStepNav } from './participle/LessonStepNav.js';
import { renderWordCard } from './participle/WordCard.js';
import { renderRelationDisplay } from './participle/RelationDisplay.js';
import { renderRuleSummary } from './participle/RuleSummary.js';
import { renderAdvancedDrawer } from './participle/AdvancedDrawer.js';
import { renderChoiceQuestion } from './participle/ChoiceQuestion.js';
import { renderSentenceBuilder } from './participle/SentenceBuilder.js';
import { renderSVRelationJudge } from './participle/SVRelationJudge.js';
import { renderSentenceDisplay } from './participle/SentenceDisplay.js';
import { renderLessonCompletePanel } from './participle/LessonCompletePanel.js';

const FEEDBACK_RETRY = 'もう一度、名詞と動詞の関係を見てみよう。';

function lessonProgressKey(index) {
  return `lesson${index + 1}`;
}

function questionMap(stage) {
  return new Map((stage.questions ?? []).map((question) => [question.id, question]));
}

function allQuestionsComplete(stage, questions) {
  return (stage.questions ?? []).every((question) => questions[question.id]?.correct === true);
}

function getFinalScores(stage, questions) {
  const results = stage.questions ?? [];
  return {
    answerScore: results.filter((question) => questions[question.id]?.formCorrect === true).length,
    reasoningScore: results.filter((question) => questions[question.id]?.relationCorrect === true).length,
  };
}

function getFirstAttemptScores(stage, questions) {
  const results = stage.questions ?? [];
  return {
    answerScore: results.filter((question) => questions[question.id]?.firstFormCorrect === true).length,
    reasoningScore: results.filter((question) => questions[question.id]?.firstRelationCorrect === true).length,
  };
}

function relationLabel(question, relation) {
  if (question.relationLabels?.[relation]) return question.relationLabels[relation];
  return relation === 'active' ? `${question.noun} が ${question.verb} する` : `${question.noun} が ${question.verb} される`;
}

function renderFinalQuestion(question, result = {}) {
  const relationSelected = result.relation;
  const relationCorrect = result.relationCorrect === true;
  const formCorrect = result.formCorrect === true;
  const relationFeedback = result.relationAttempts
    ? relationCorrect
      ? `<div class="spec-feedback is-success" role="status" aria-live="polite"><strong>STEP 1 OK</strong><p>${escapeHtml(question.relationAnswer === 'active' ? `${question.noun} が ${question.verb} する` : `${question.noun} が ${question.verb} される`)}</p></div>`
      : `<div class="spec-feedback is-error" role="status" aria-live="polite"><strong>もう一度、する / されるを考えよう。</strong>${result.relationAttempts >= 2 ? '<p class="spec-hint">Hint: 名詞と元の動詞の向きを見てみよう。</p>' : ''}${result.relationAttempts >= 3 ? `<p>正解の関係：${escapeHtml(relationLabel(question, question.relationAnswer))}</p>` : ''}</div>`
    : '';
  const formFeedback = result.formAttempts
    ? formCorrect
      ? `<div class="spec-feedback is-success" role="status" aria-live="polite"><strong>Good!</strong><p>${escapeHtml(question.reason)}</p></div>`
      : `<div class="spec-feedback is-error" role="status" aria-live="polite"><strong>形をもう一度選ぼう。</strong>${result.formAttempts >= 2 ? '<p class="spec-hint">Hint: する側なら -ing、される側なら p.p.</p>' : ''}${result.formAttempts >= 3 ? `<p>正解：${escapeHtml(question.answer)}</p>` : ''}</div>`
    : '';
  const locked = formCorrect && relationCorrect;
  return `<article class="spec-question${formCorrect ? ' is-passed' : ''}" data-spec-final-question="${escapeHtml(question.id)}"><p class="spec-question-prompt">${escapeHtml(question.prompt)}</p><p class="spec-kicker">STEP 1 · 関係を判断</p><div class="spec-choice-grid" role="group" aria-label="${escapeHtml(question.id)} relation"><button type="button" class="spec-choice${relationSelected === 'active' ? ' is-selected' : ''}" data-spec-final-relation="${escapeHtml(question.id)}:active" aria-pressed="${relationSelected === 'active'}" ${locked ? 'disabled' : ''}>${escapeHtml(relationLabel(question, 'active'))}</button><button type="button" class="spec-choice${relationSelected === 'passive' ? ' is-selected' : ''}" data-spec-final-relation="${escapeHtml(question.id)}:passive" aria-pressed="${relationSelected === 'passive'}" ${locked ? 'disabled' : ''}>${escapeHtml(relationLabel(question, 'passive'))}</button></div>${relationFeedback}${relationCorrect ? `<p class="spec-kicker">STEP 2 · 正しい形を選択</p><div class="spec-choice-grid" role="group" aria-label="${escapeHtml(question.id)} form">${question.choices.map((choice) => `<button type="button" class="spec-choice${result.form === choice.id ? ' is-selected' : ''}" data-spec-final-form="${escapeHtml(question.id)}:${escapeHtml(choice.id)}" aria-pressed="${result.form === choice.id}" ${locked ? 'disabled' : ''}>${escapeHtml(choice.text)}</button>`).join('')}</div>${formFeedback}` : ''}</article>`;
}

function renderDragRuleQuestion(question, result = {}) {
  const placements = result.placements ?? {};
  const assigned = (targetId) => question.dragItems.find((item) => placements[item.id] === targetId)?.text ?? 'ここへ置く';
  const feedback = result.correct
    ? '<div class="spec-feedback is-success" role="status" aria-live="polite"><strong>Good!</strong><p>-ing は能動、p.p. は受動です。</p></div>'
    : result.error
      ? `<div class="spec-feedback is-error" role="status" aria-live="polite"><strong>もう一度、関係を確認しよう。</strong>${result.attempts >= 2 ? '<p class="spec-hint">Hint: する側は -ing、される側は p.p.</p>' : ''}${result.attempts >= 3 ? '<p>正解：-ing → 能動・する側 / p.p. → 受動・される側</p>' : ''}</div>`
      : '';
  return `<article class="spec-question${result.correct ? ' is-passed' : ''}" data-spec-question="${escapeHtml(question.id)}"><p class="spec-question-prompt">${escapeHtml(question.prompt)}</p><p class="spec-note">ドラッグ、またはカードを選んでから分類先をクリックします。</p><div class="spec-drag-items" aria-label="分類するカード">${question.dragItems.map((item) => `<button type="button" class="spec-drag-item${result.selectedItem === item.id ? ' is-selected' : ''}" draggable="true" data-spec-drag-item="${escapeHtml(question.id)}:${escapeHtml(item.id)}" aria-pressed="${result.selectedItem === item.id}">${escapeHtml(item.text)}</button>`).join('')}</div><div class="spec-drag-targets">${question.dragTargets.map((target) => `<button type="button" class="spec-drag-target${Object.values(placements).includes(target.id) ? ' is-filled' : ''}" data-spec-drag-target="${escapeHtml(question.id)}:${escapeHtml(target.id)}" aria-label="${escapeHtml(target.text)}">${escapeHtml(target.text)}<strong>${escapeHtml(assigned(target.id))}</strong></button>`).join('')}</div>${feedback}</article>`;
}

function renderFinalQuiz(stage, state) {
  const questions = stage.questions ?? [];
  const attempted = questions.every((question) => (state.questions[question.id]?.formAttempts ?? 0) > 0);
  const { answerScore, reasoningScore } = getFinalScores(stage, state.questions);
  const wrongQuestions = questions.filter((question) => state.questions[question.id]?.formCorrect !== true || state.questions[question.id]?.relationCorrect !== true);
  const reviewLinks = wrongQuestions.map((question) => `<a href="#lessons/${escapeHtml(question.id === 'l5-q1' || question.id === 'l5-q2' ? 'hidden-sv' : 'emotion-verbs')}">${escapeHtml(question.id.replace(/^l5-/i, '').toUpperCase())}を復習 → ${escapeHtml(question.review ?? '')}</a>`).join('');
  const finalResult = state.finalOutcome === 'review'
    ? `<div class="spec-review-result is-review" data-spec-final-result role="status" aria-live="polite"><strong>REVIEW</strong><p>ANSWERS と REASONING の両方で4問以上を目指しましょう。誤答した問題を復習して、もう一度挑戦できます。</p><div class="spec-review-links">${reviewLinks}</div><button class="spec-action-button secondary" type="button" data-spec-action="final-retry">もう一度挑戦</button></div>`
    : state.finalOutcome === 'complete'
      ? '<div class="spec-review-result is-complete" data-spec-final-result role="status" aria-live="polite"><strong>COMPLETE</strong><p>分詞の基本ルールを理解しました。次のSUMMARYへ進めます。</p></div>'
      : '';
  return `<div class="spec-quiz spec-final-quiz" data-spec-quiz>${questions.map((question) => renderFinalQuestion(question, state.questions[question.id] ?? {})).join('')}<div class="spec-quiz-footer"><div class="spec-score-pair"><span>ANSWERS <strong>${answerScore} / ${questions.length}</strong></span><span>REASONING <strong>${reasoningScore} / ${questions.length}</strong></span></div><button class="spec-action-button" type="button" data-spec-action="final-submit" ${attempted ? '' : 'disabled'}>結果を見る</button></div>${finalResult}</div>`;
}

function renderStandardQuiz(stage, state) {
  const questions = stage.questions ?? [];
  const final = stage.kind === 'final-quiz';
  if (final) return renderFinalQuiz(stage, state);
  const attempted = questions.every((question) => (state.questions[question.id]?.attempts ?? 0) > 0);
  const score = questions.filter((question) => state.questions[question.id]?.correct === true).length;
  const wrongQuestions = questions.filter((question) => state.questions[question.id]?.correct !== true);
  const reviewLinks = wrongQuestions.map((question) => `<a href="#lessons/${escapeHtml(question.id === 'l5-q1' || question.id === 'l5-q2' ? 'hidden-sv' : 'emotion-verbs')}">${escapeHtml(question.id.replace(/^l5-/i, '').toUpperCase())}を復習 → ${escapeHtml(question.review ?? '')}</a>`).join('');
  const finalResult = final && state.finalOutcome === 'review'
    ? `<div class="spec-review-result is-review" data-spec-final-result role="status" aria-live="polite"><strong>REVIEW</strong><p>4問以上の正解を目指しましょう。誤答した問題を復習して、もう一度挑戦できます。</p><div class="spec-review-links">${reviewLinks}</div><button class="spec-action-button secondary" type="button" data-spec-action="final-retry">もう一度挑戦</button></div>`
    : final && state.finalOutcome === 'complete'
      ? '<div class="spec-review-result is-complete" data-spec-final-result role="status" aria-live="polite"><strong>COMPLETE</strong><p>分詞の基本ルールを理解しました。次のSUMMARYへ進めます。</p></div>'
      : '';
  return `<div class="spec-quiz" data-spec-quiz>${questions.map((question) => question.kind === 'drag-rule' ? renderDragRuleQuestion(question, state.questions[question.id] ?? {}) : renderChoiceQuestion(question, state.questions[question.id] ?? {})).join('')}<div class="spec-quiz-footer"><span data-spec-score>${final && attempted ? `${score} / ${questions.length} correct` : `${questions.filter((question) => state.questions[question.id]?.correct).length} / ${questions.length} complete`}</span>${final ? `<button class="spec-action-button" type="button" data-spec-action="final-submit" ${attempted ? '' : 'disabled'}>結果を見る</button>` : ''}</div>${finalResult}</div>`;
}

function renderIntroStage(stage, state) {
  const lookSentences = stage.lookSentences?.length ? `<div class="spec-look-sentences"><p class="spec-kicker">LOOK</p>${stage.lookSentences.map((sentence) => renderSentenceDisplay({ before: sentence, emphasis: sentence.includes('tall') ? 'tall' : 'dancing' })).join('')}<p class="spec-note">同じ位置に注目してみよう。-ing形は、人やものの様子を表すことがあります。</p></div>` : '';
  return `<div class="spec-intro-stage">${lookSentences}<div class="spec-intro-cards">${stage.cards.map((card) => `<button class="spec-intro-card${state.introSelected === card.id ? ' is-selected' : ''}${state.introSelected && state.introSelected !== card.id ? ' is-muted' : ''}" type="button" data-spec-action="intro-select" data-spec-value="${escapeHtml(card.id)}" aria-pressed="${state.introSelected === card.id}"><span class="spec-card-kicker">${escapeHtml(card.badge)}</span><strong>${escapeHtml(card.title)}</strong><span>${escapeHtml(card.detail)}</span></button>`).join('')}</div><p class="spec-note">「分詞」カードを選ぶと、今日の範囲がはっきりします。</p>${state.introSelected === 'participle' ? '<button class="spec-action-button" type="button" data-spec-action="complete-stage">分詞を見てみる →</button>' : ''}</div>`;
}

function renderChangeStage(state) {
  const tallChanged = state.changes?.tall === true;
  const cuteChanged = state.changes?.cute === true;
  const tallExplanation = tallChanged ? '<p class="spec-explanation-line">tall と dancing は、同じ場所に入っています。<br />tall は形容詞。dancing も、この文では同じように説明する働きをしています。</p><p class="spec-rule-emphasis">分詞は、形容詞として働く。</p>' : '';
  const noticeFeedback = state.noticeAnswer === 'baby'
    ? '<p class="spec-feedback is-success" role="status"><strong>Exactly.</strong><br />どちらも baby がどんなものかを説明しています。</p>'
    : state.noticeAnswer
      ? '<p class="spec-feedback is-error" role="status"><strong>もう一度考えてみよう。</strong></p>'
      : '';
  const notice = cuteChanged ? `<div class="spec-notice"><strong>cute と smiling の共通点は？</strong><div class="spec-choice-grid"><button class="spec-choice" type="button" data-spec-action="choose-notice" data-spec-value="baby">A. baby を説明している</button><button class="spec-choice" type="button" data-spec-action="choose-notice" data-spec-value="past">B. 過去を表している</button><button class="spec-choice" type="button" data-spec-action="choose-notice" data-spec-value="sentence">C. 文全体を説明している</button></div>${noticeFeedback}</div>` : '';
  const complete = tallChanged && cuteChanged && state.noticeAnswer === 'baby' ? '<button class="spec-action-button" type="button" data-spec-action="complete-stage">次へ →</button>' : '';
  return `<div class="spec-change-stage"><div class="spec-sentence-card"><span class="spec-kicker">FIRST</span><p>The girl is <strong class="spec-change-word${tallChanged ? ' is-replaced' : ''}">${tallChanged ? 'dancing' : 'tall'}</strong>.</p><button class="spec-action-button secondary" type="button" data-spec-action="change-tall">CHANGE</button></div>${tallExplanation}<div class="spec-sentence-card"><span class="spec-kicker">ANOTHER EXAMPLE</span><p>Look at the <strong class="spec-change-word${cuteChanged ? ' is-replaced' : ''}">${cuteChanged ? 'smiling' : 'cute'}</strong> baby.</p><button class="spec-action-button secondary" type="button" data-spec-action="change-cute">CHANGE</button></div>${notice}${complete}</div>`;
}

function renderTryIntroStage(stage, state) {
  const rule = stage.rule?.map((line) => `<strong>${escapeHtml(line)}</strong>`).join('<br />') ?? '分詞は、名詞を説明する「形容詞」の仲間。';
  return `<div class="spec-try-intro-stage"><section class="spec-rule-block"><p class="spec-kicker">RULE</p><p class="spec-rule-emphasis">${rule}</p><p class="spec-note">分詞は、名詞を修飾したり、補語になったりします。</p></section><section class="spec-example-panel"><p class="spec-kicker">NOTICE</p><p>Look at the <b>cute</b> baby.</p><p>Look at the <b>smiling</b> baby.</p><p class="spec-rule-emphasis">どちらも baby がどんなものかを説明しています。</p></section><section class="spec-callback-block"><p class="spec-kicker">CALLBACK</p>${renderChoiceQuestion(stage.question, state.questions[stage.question.id] ?? {})}</section></div>`;
}

function renderContrastStage() {
  return `<div class="spec-contrast-stage"><p class="spec-note">「現在」「過去」という名前はいったん忘れよう。</p><div class="spec-contrast-grid"><article class="spec-contrast-card is-active"><span class="spec-big-form">-ing</span><strong>基本</strong><span>能動</span><span>「する」</span></article><div class="spec-contrast-center" aria-hidden="true"><span>名詞</span><i>● ─────▶</i><span>動作</span></div><article class="spec-contrast-card is-passive"><span class="spec-big-form">p.p.</span><strong>基本</strong><span>受動</span><span>「される」</span></article></div><p class="spec-explanation-line">まず、その名詞が動作を<strong>する</strong>のか、<strong>される</strong>のかを見ます。</p><button class="spec-action-button" type="button" data-spec-action="complete-stage">関係を見る →</button></div>`;
}

function renderActivePassiveStage(stage, state) {
  const active = state.activeShown === true;
  const passive = state.passiveRelation === 'passive';
  const activeExample = stage.examples?.active ?? { sentence: 'the baby smiling at her mother', noun: 'baby', verb: 'smile', form: 'smiling', relationText: 'baby が smile する' };
  const passiveExample = stage.examples?.passive ?? { sentence: 'the language spoken in that country', noun: 'language', verb: 'speak', form: 'spoken', relationText: 'language が speak される' };
  return `<div class="spec-active-passive-stage"><article class="spec-example-panel"><p class="spec-kicker">ACTIVE</p><p class="spec-example-sentence">${escapeHtml(activeExample.sentence)}</p>${active ? renderRelationDisplay({ from: activeExample.noun, to: activeExample.verb, relation: 'active', meaning: activeExample.relationText }) : `<p class="spec-question-prompt">${escapeHtml(activeExample.noun)} が ${escapeHtml(activeExample.verb)} する？ される？</p>`}<button class="spec-node-button" type="button" data-spec-action="active-reveal" aria-pressed="${active}">${escapeHtml(activeExample.noun)}</button>${active ? `<div class="spec-feedback is-success" role="status" aria-live="polite"><strong>${escapeHtml(activeExample.relationText)}</strong><p>能動 → <b>${escapeHtml(activeExample.form)}</b></p></div>` : ''}</article><article class="spec-example-panel"><p class="spec-kicker">PASSIVE</p><p class="spec-example-sentence">${escapeHtml(passiveExample.sentence)}</p>${passive ? renderRelationDisplay({ from: passiveExample.verb, to: passiveExample.noun, relation: 'passive', meaning: passiveExample.relationText }) : `<p class="spec-question-prompt">${escapeHtml(passiveExample.noun)} が ${escapeHtml(passiveExample.verb)} する？ される？</p>`}<div class="spec-choice-grid"><button class="spec-choice" type="button" data-spec-action="passive-relation" data-spec-value="active" aria-pressed="${state.passiveRelation === 'active'}">する</button><button class="spec-choice" type="button" data-spec-action="passive-relation" data-spec-value="passive" aria-pressed="${passive}">される</button></div>${state.passiveRelation === 'active' ? `<p class="spec-feedback is-error" role="status" aria-live="polite"><strong>もう一度考えてみよう。</strong><br />${escapeHtml(passiveExample.noun)} は ${escapeHtml(passiveExample.verb)} される側です。</p>` : ''}${passive ? `<div class="spec-feedback is-success" role="status" aria-live="polite"><strong>${escapeHtml(passiveExample.relationText)}</strong><p>受動 → <b>${escapeHtml(passiveExample.form)}</b></p></div>` : ''}</article></div>${active && passive ? '<button class="spec-action-button" type="button" data-spec-action="complete-stage">次へ →</button>' : ''}</div>`;
}

function renderWordCardsStage(stage, state) {
  const selected = state.selectedWordCard;
  return `<div class="spec-word-cards-stage"><p class="spec-note">p.p.の根には「〜された」というイメージがあります。カードを一つ選んで確認しましょう。</p><div class="spec-word-card-grid">${stage.cards.map((card) => renderWordCard(card, { selected: selected === card.id })).join('')}</div>${selected ? `<div class="spec-word-card-detail" role="status"><strong>${escapeHtml(stage.cards.find((card) => card.id === selected)?.word)}</strong><span>${escapeHtml(stage.cards.find((card) => card.id === selected)?.gloss)}</span></div>` : ''}${renderAdvancedDrawer(stage.advanced, { id: 'l2-fallen' })}<button class="spec-action-button" type="button" data-spec-action="complete-stage" ${selected ? '' : 'disabled'}>カードを確認した →</button></div>`;
}

function renderOneWordStage(stage) {
  const sentence = stage.sentence ?? 'Look at the laughing children.';
  return `<div class="spec-one-word-stage"><div class="spec-large-sentence">${escapeHtml(sentence).replace('laughing', '<strong class="spec-highlight">laughing</strong>')}</div><p class="spec-note">laughing だけなら1語。</p><p class="spec-rule-emphasis">原則：1語なら名詞の前</p><button class="spec-action-button" type="button" data-spec-action="complete-stage">位置を覚えた →</button></div>`;
}

function renderBuildPhraseStage(state) {
  return `<div class="spec-build-stage"><p class="spec-note">laughing にこの情報を追加してみよう。</p>${renderSentenceBuilder({ noun: 'children', modifier: 'laughing', extra: 'at the clown', built: state.phraseBuilt })}${state.phraseBuilt ? '<div class="spec-feedback is-success spec-phrase-built" role="status" aria-live="polite"><strong>説明が長くなったので、名詞の後ろへ移動しました。</strong><p class="spec-rule-emphasis">原則：2語以上 → 名詞の後ろ</p><p class="spec-large-sentence">the children <strong class="spec-highlight">laughing at the clown</strong></p></div>' : ''}<button class="spec-action-button" type="button" data-spec-action="complete-stage" ${state.phraseBuilt ? '' : 'disabled'}>次へ →</button></div>`;
}

function renderPositionCompareStage(stage, state) {
  const examples = stage.bigRule ?? [];
  const ruleCards = examples.map((example) => `<div><span class="spec-card-kicker">${escapeHtml(example.label)}</span>${example.before ? `<code>${escapeHtml(example.before)}</code>` : ''}<strong>${escapeHtml(example.after)}</strong></div>`).join('');
  return `<div class="spec-position-stage"><div class="spec-toggle-row"><button type="button" class="spec-toggle${state.positionMode !== 'long' ? ' is-selected' : ''}" data-spec-action="position-toggle" data-spec-value="short">1 WORD</button><button type="button" class="spec-toggle${state.positionMode === 'long' ? ' is-selected' : ''}" data-spec-action="position-toggle" data-spec-value="long">2+ WORDS</button></div><div class="spec-position-example"><p class="spec-large-sentence">${state.positionMode === 'long' ? 'the children ' : 'the '}<strong class="spec-highlight">${state.positionMode === 'long' ? 'laughing at the clown' : 'laughing'}</strong>${state.positionMode === 'long' ? '' : ' children'}</p><p>${state.positionMode === 'long' ? '説明が長いので名詞の後ろ。' : '1語なので名詞の前。'}</p></div><div class="spec-rule-cards">${ruleCards}</div><p class="spec-explanation-line">これは分詞だけのルールではありません。<br /><b>英語では、長い説明を名詞の後ろに置きます。</b></p>${renderAdvancedDrawer(stage.advanced, { id: 'l3-one-word-after' })}<button class="spec-action-button" type="button" data-spec-action="complete-stage">比較できた →</button></div>`;
}

function renderPositionQuiz(stage, state) {
  const questions = stage.questions ?? [];
  const completed = questions.filter((question) => state.questions[question.id]?.correct === true).length;
  return `<div class="spec-position-quiz">${questions.map((question) => {
    const result = state.questions[question.id] ?? {};
    return `<article class="spec-question${result.correct ? ' is-passed' : ''}" data-spec-position-question="${escapeHtml(question.id)}"><p class="spec-question-prompt">${escapeHtml(question.prompt)}</p>${renderSentenceBuilder({ noun: question.noun, modifier: question.modifier, extra: question.extra, position: result.position ?? 'front', questionId: question.id, selectedPosition: result.position ?? '' })}${result.error ? `<div class="spec-feedback is-error" role="status" aria-live="polite"><strong>もう一度、語数と位置を見てみよう。</strong>${result.attempts >= 2 ? '<p class="spec-hint">1語なら前、2語以上なら後ろが原則です。</p>' : ''}${result.attempts >= 3 ? `<p>正解：${escapeHtml(question.output)}</p>` : ''}</div>` : ''}${result.correct ? `<div class="spec-feedback is-success" role="status" aria-live="polite"><strong>Good!</strong><p>${escapeHtml(question.reason)}</p><p class="spec-large-sentence">${escapeHtml(question.output)}</p></div>` : ''}</article>`;
  }).join('')}<p class="spec-quiz-footer"><span data-spec-score>${completed} / ${questions.length} complete</span></p></div>`;
}

function renderSvFlowStage() {
  return `<div class="spec-flow-stage"><p class="spec-note">-ing か p.p. か迷ったら、まず「誰がその動作をする？」と考えよう。</p><div class="spec-flow"><div>STEP 1：どの名詞を説明している？</div><span>│</span><div class="spec-flow-branches"><strong>名詞が動作をする → 能動 → -ing</strong><strong>名詞が動作をされる → 受動 → p.p.</strong></div></div><p class="spec-flow-caption">名詞が VERB「する」なら能動、VERB「される」なら受動です。矢印は確認の補助に使います。</p><button class="spec-action-button" type="button" data-spec-action="complete-stage">判定フローを使う →</button></div>`;
}

function renderCase(caseData, index, state) {
  const current = state.cases?.[index] ?? {};
  const complete = current.relation === caseData.relationAnswer && current.form === caseData.formAnswer;
  const relationChoices = `<button type="button" class="spec-choice" data-spec-case-relation="${index}:active" aria-pressed="${current.relation === 'active'}">${escapeHtml(caseData.noun)} が ${escapeHtml(caseData.verb)} する</button><button type="button" class="spec-choice" data-spec-case-relation="${index}:passive" aria-pressed="${current.relation === 'passive'}">${escapeHtml(caseData.noun)} が ${escapeHtml(caseData.verb)} される</button>`;
  return `<article class="spec-case-panel"><p class="spec-kicker">CASE ${index + 1}</p><p class="spec-example-sentence">${escapeHtml(caseData.sentence)}</p><div class="spec-case-nodes"><button type="button" class="spec-node-button${current.nounClicked ? ' is-selected' : ''}" data-spec-case-node="${index}:noun" aria-pressed="${current.nounClicked === true}">${escapeHtml(caseData.noun)}</button><span>＋</span><button type="button" class="spec-node-button${current.verbClicked ? ' is-selected' : ''}" data-spec-case-node="${index}:verb" aria-pressed="${current.verbClicked === true}">${escapeHtml(caseData.verb)}</button></div>${current.nounClicked && current.verbClicked ? `<p class="spec-question-prompt">STEP 1：${escapeHtml(caseData.noun)} が ${escapeHtml(caseData.verb)} する？ される？</p><div class="spec-choice-grid">${relationChoices}</div>` : '<p class="spec-note">名詞と元の動詞をクリックして、関係を見ます。</p>'}${current.relation ? renderRelationDisplay({ from: current.relation === 'active' ? caseData.noun : caseData.verb, to: current.relation === 'active' ? caseData.verb : caseData.noun, relation: current.relation, meaning: caseData.relationReason }) : ''}${current.relation === caseData.relationAnswer ? `<p class="spec-bridge-sentence">${escapeHtml(caseData.relationSentence)}</p><p class="spec-kicker">STEP 2 · 分詞の形を選ぶ</p><div class="spec-choice-grid">${caseData.forms.map((form) => `<button type="button" class="spec-choice${current.form === form.id ? ' is-selected' : ''}" data-spec-case-form="${index}:${escapeHtml(form.id)}" aria-pressed="${current.form === form.id}">${escapeHtml(form.text)}</button>`).join('')}</div>` : ''}${current.error ? '<p class="spec-feedback is-error" role="status" aria-live="polite"><strong>もう一度、名詞と動詞の関係を見てみよう。</strong></p>' : ''}${complete ? `<p class="spec-feedback is-success" role="status" aria-live="polite"><strong>Good!</strong><br />${escapeHtml(caseData.formAnswer)} — ${escapeHtml(caseData.relationReason)}</p>` : ''}</article>`;
}

function renderSvCasesStage(stage, state) {
  const cases = stage.cases ?? [];
  const complete = cases.every((item, index) => state.cases?.[index]?.form);
  return `<div class="spec-cases-stage">${cases.map((item, index) => renderCase(item, index, state)).join('')}<p class="spec-warning">日本語訳だけで決めない。</p><button class="spec-action-button" type="button" data-spec-action="complete-stage" ${complete ? '' : 'disabled'}>関係を確認した →</button></div>`;
}

function renderRapidJudgeStage(stage, state) {
  const questions = Array.isArray(stage.rapid) ? stage.rapid : stage.rapid ? [stage.rapid] : [];
  const answers = state.rapidAnswers ?? {};
  const cards = questions.map((data) => {
    const answer = answers[data.id] ?? {};
    const done = answer.relation === data.relationAnswer && answer.form === data.formAnswer;
    return `<article class="spec-rapid-card"><p class="spec-kicker">${escapeHtml(data.id)}</p><p class="spec-example-sentence">${escapeHtml(data.sentence)}</p>${renderSVRelationJudge({ questionId: data.id, noun: data.noun, verb: data.verb, relation: answer.relation, form: answer.form, forms: data.forms, selectedNodes: answer.nodes, prompt: 'STEP 1：名詞と元の動詞をクリックします。' })}${answer.relationError || answer.formError ? `<p class="spec-feedback is-error" role="status" aria-live="polite"><strong>もう一度、SV関係と形を確認しよう。</strong>${answer.formAttempts >= 2 ? '<br />する側なら -ing、される側なら p.p.' : ''}</p>` : ''}${done ? `<p class="spec-feedback is-success" role="status" aria-live="polite"><strong>Good!</strong><br />${escapeHtml(data.noun)} が ${escapeHtml(data.verb)} ${escapeHtml(data.relationAnswer === 'active' ? 'する' : 'される')} → ${escapeHtml(data.formAnswer)}</p>` : ''}</article>`;
  }).join('');
  const done = questions.length > 0 && questions.every((question) => {
    const answer = answers[question.id] ?? {};
    return answer.relation === question.relationAnswer && answer.form === question.formAnswer;
  });
  return `<div class="spec-rapid-stage">${cards}<details class="spec-advanced"><summary>BONUS：being p.p.</summary><div class="spec-advanced-body"><p>The chocolate cake <b>being baked</b> in the oven right now is for Lucy's birthday.</p><p>cake は bake される。right now は今まさに進行中。<br />受動＋進行 = <strong>being baked</strong></p></div></details><details class="spec-advanced"><summary>BONUS：waiting room</summary><div class="spec-advanced-body"><p><strong>waiting room</strong></p><p>room が wait する？ → NO</p><p>SV関係が成立しないので、これは今回の分詞ではありません。waiting room = 待つための部屋。</p><p>参考：smoking room / sleeping car</p></div></details><button class="spec-action-button" type="button" data-spec-action="complete-stage" ${done ? '' : 'disabled'}>次へ →</button></div>`;
}

function renderRelationQuiz(stage, state) {
  const questions = stage.questions ?? [];
  const completed = questions.filter((question) => state.questions[question.id]?.correct === true).length;
  const items = questions.map((question) => {
    if (question.kind === 'drag-rule') return renderDragRuleQuestion(question, state.questions[question.id] ?? {});
    const result = state.questions[question.id] ?? {};
    const finished = result.correct === true;
    const relationFeedback = result.relationAttempts
      ? result.relationCorrect
        ? `<div class="spec-feedback is-success" role="status" aria-live="polite"><strong>STEP 1 OK</strong><p>${escapeHtml(question.relationReason ?? '')}</p></div>`
        : `<div class="spec-feedback is-error" role="status" aria-live="polite"><strong>もう一度、名詞と動詞の関係を見てみよう。</strong>${result.relationAttempts >= 2 ? '<p class="spec-hint">Hint: その名詞が「する」？「される」？</p>' : ''}${result.relationAttempts >= 3 ? `<p>正解：${escapeHtml(question.relationReason ?? '')}</p>` : ''}</div>`
      : '';
    const formFeedback = result.formAttempts
      ? result.formCorrect
        ? `<div class="spec-feedback is-success" role="status" aria-live="polite"><strong>Good!</strong><p>${escapeHtml(question.reason ?? '')}</p></div>`
        : `<div class="spec-feedback is-error" role="status" aria-live="polite"><strong>形をもう一度選ぼう。</strong>${result.formAttempts >= 2 ? '<p class="spec-hint">する側なら -ing、される側なら p.p.</p>' : ''}${result.formAttempts >= 3 ? `<p>正解：${escapeHtml(question.formAnswer)}</p>` : ''}</div>`
      : '';
    return `<article class="spec-question${finished ? ' is-passed' : ''}" data-spec-relation-question="${escapeHtml(question.id)}"><p class="spec-question-prompt">${escapeHtml(question.sentence)}</p><p class="spec-kicker">STEP 1 · SV関係</p><div class="spec-choice-grid"><button type="button" class="spec-choice${result.relation === 'active' ? ' is-selected' : ''}" data-spec-relation-choice="${escapeHtml(question.id)}:active" aria-pressed="${result.relation === 'active'}">${escapeHtml(question.noun)} が ${escapeHtml(question.verb)} する</button><button type="button" class="spec-choice${result.relation === 'passive' ? ' is-selected' : ''}" data-spec-relation-choice="${escapeHtml(question.id)}:passive" aria-pressed="${result.relation === 'passive'}">${escapeHtml(question.noun)} が ${escapeHtml(question.verb)} される</button></div>${relationFeedback}${result.relationCorrect ? `<p class="spec-kicker">STEP 2 · 分詞の形を選ぶ</p><div class="spec-choice-grid">${question.formChoices.map((form) => `<button type="button" class="spec-choice${result.form === form.id ? ' is-selected' : ''}" data-spec-form-choice="${escapeHtml(question.id)}:${escapeHtml(form.id)}" aria-pressed="${result.form === form.id}">${escapeHtml(form.text)}</button>`).join('')}</div>${formFeedback}` : ''}${finished ? `<p class="spec-feedback is-success" role="status" aria-live="polite"><strong>Good!</strong><br />${escapeHtml(question.formAnswer)} — ${escapeHtml(question.reason)}</p>` : ''}</article>`;
  }).join('');
  return `<div class="spec-relation-quiz">${items}<p class="spec-quiz-footer"><span data-spec-score>${completed} / ${questions.length} complete</span></p></div>`;
}

function renderEmotionIntroStage(stage, state) {
  return `<div class="spec-emotion-intro-stage">${renderChoiceQuestion(stage.question, state.questions[stage.question.id] ?? {})}${state.questions[stage.question.id]?.correct ? `<div class="spec-emotion-callback"><p class="spec-large-sentence">surprise + 人</p>${renderRelationDisplay({ from: 'surprise', to: '人', relation: 'active', meaning: '人を驚かせる', label: '感情を与える' })}<strong>人を驚かせる</strong><p>He surprised his wife by giving her flowers.</p></div>` : ''}</div>`;
}

function renderEmotionSwitchStage(state) {
  const mode = state.emotionMode ?? 'boring';
  return `<div class="spec-emotion-switch-stage"><div class="spec-emotion-visual">${renderRelationDisplay({ from: 'MOVIE', to: 'ME', meaning: '退屈という感情を与える', label: '感情を与える' })}</div><p class="spec-note">左は感情を与える側。右は感情を与えられる側。</p><div class="spec-emotion-result"><p class="spec-large-sentence">You are <strong class="spec-highlight">${mode}</strong>.</p>${mode === 'boring' ? '<p>You が周囲を退屈させる。</p><p>感情を与える側 → <b>-ing</b></p>' : '<p>You は退屈させられている。</p><p>感情を与えられる側 → <b>p.p.</b></p>'}</div><div class="spec-toggle-row"><button type="button" class="spec-toggle${mode === 'boring' ? ' is-selected' : ''}" data-spec-action="emotion-toggle" data-spec-value="boring">boring</button><button type="button" class="spec-toggle${mode === 'bored' ? ' is-selected' : ''}" data-spec-action="emotion-toggle" data-spec-value="bored">bored</button></div><div class="spec-myth"><strong>主語が人なら -ed？</strong><div class="spec-choice-grid"><button type="button" class="spec-choice" data-spec-action="myth-choice" data-spec-value="yes">YES</button><button type="button" class="spec-choice" data-spec-action="myth-choice" data-spec-value="no">NO</button></div>${state.mythChoice === 'no' ? '<p class="spec-feedback is-success" role="status"><strong>NO。</strong><br />人でも、周囲に感情を与える側なら -ing。<br /><b>Oliver is exciting.</b><br /><b>You are amazing!</b></p>' : state.mythChoice ? '<p class="spec-feedback is-error" role="status"><strong>もう一度。</strong>主語が人かどうかだけでは決まりません。</p>' : ''}</div><button class="spec-action-button" type="button" data-spec-action="complete-stage" ${state.mythChoice === 'no' ? '' : 'disabled'}>次へ →</button></div>`;
}

function renderEmotionVocabularyStage(stage, state) {
  return `<div class="spec-vocabulary-stage"><p class="spec-note">感情動詞は「人を〜させる」。カテゴリを開いて眺めます。</p><div class="spec-vocabulary-drawer">${stage.categories.map((category) => `<details><summary>${escapeHtml(category.title)}</summary><div class="spec-vocabulary-list">${category.words.map((word) => `<button type="button" class="spec-word-card" data-spec-word-card="${escapeHtml(word)}"><strong>${escapeHtml(word)}</strong><span>人を〜させる</span></button>`).join('')}</div></details>`).join('')}</div>${renderAdvancedDrawer(stage.advanced, { id: 'l5-exceptions' })}<button class="spec-action-button" type="button" data-spec-action="complete-stage">Vocabularyを見た →</button></div>`;
}

function renderStage(stage, state) {
  switch (stage.kind) {
    case 'intro': return renderIntroStage(stage, state);
    case 'change': return renderChangeStage(state);
    case 'try-intro': return renderTryIntroStage(stage, state);
    case 'contrast': return renderContrastStage();
    case 'active-passive': return renderActivePassiveStage(stage, state);
    case 'word-cards': return renderWordCardsStage(stage, state);
    case 'one-word': return renderOneWordStage(stage);
    case 'build-phrase': return renderBuildPhraseStage(state);
    case 'position-compare': return renderPositionCompareStage(stage, state);
    case 'position-quiz': return renderPositionQuiz(stage, state);
    case 'sv-flow': return renderSvFlowStage();
    case 'sv-cases': return renderSvCasesStage(stage, state);
    case 'rapid-judge': return renderRapidJudgeStage(stage, state);
    case 'relation-quiz': return renderRelationQuiz(stage, state);
    case 'emotion-intro': return renderEmotionIntroStage(stage, state);
    case 'emotion-switch': return renderEmotionSwitchStage(state);
    case 'emotion-vocabulary': return renderEmotionVocabularyStage(stage, state);
    case 'quiz': return renderStandardQuiz(stage, state);
    case 'final-quiz': return renderStandardQuiz(stage, state);
    case 'summary': { const summary = stage.summary ?? state.summary ?? ''; return `<div class="spec-summary-stage">${renderLessonCompletePanel({ completed: state.lessonCompleted, summary })}${renderRuleSummary(summary, { complete: state.lessonCompleted })}<button class="spec-action-button" type="button" data-spec-action="complete-lesson" ${state.lessonCompleted ? 'disabled' : ''}>${state.lessonCompleted ? 'Lessonを完了しました' : 'Lessonを完了する →'}</button></div>`; }
    default: return '<p>このステップは準備中です。</p>';
  }
}

export function mountParticipleLesson(root, lesson, { onProgress } = {}) {
  const { on, cleanup } = prepareMountRoot(root);
  if (!lesson || !participleLessons.some((item) => item.id === lesson.id)) throw new TypeError('A Participle lesson is required');
  const lessonIndex = participleLessons.findIndex((item) => item.id === lesson.id);
  const progress = loadParticipleProgress();
  const lessonKey = lessonProgressKey(lessonIndex);
  const savedLesson = progress[lessonKey];
  progress.currentLesson = lessonIndex + 1;
  saveParticipleProgress(progress);
  const restoredCompletedSteps = savedLesson.completedSteps?.length
    ? savedLesson.completedSteps
    : savedLesson.completed ? lesson.stages.map((stage) => stage.id) : [];
  const finalStage = lesson.stages.find((stage) => stage.kind === 'final-quiz');
  const restoredFinalAttempt = lesson.id === 'PART-L5' && finalStage?.questions?.every((question) => (savedLesson.quizResults?.[question.id]?.formAttempts ?? 0) > 0);
  const restoredFinalOutcome = restoredFinalAttempt
    ? (() => {
      const scores = getFinalScores(finalStage, savedLesson.quizResults ?? {});
      return scores.answerScore >= 4 && scores.reasoningScore >= 4 ? 'complete' : 'review';
    })()
    : null;
  const state = {
    stageIndex: Math.min(lesson.stages.length - 1, Math.max(0, savedLesson.currentStep ?? 0)),
    stageCompleted: new Set(restoredCompletedSteps),
    introSelected: null,
    changes: {},
    questions: structuredClone(savedLesson.quizResults ?? {}),
    cases: {},
    rapidAnswers: structuredClone(savedLesson.rapidAnswers ?? {}),
    summary: lesson.summary,
    lessonCompleted: Boolean(progress[lessonKey]?.completed),
    finalOutcome: restoredFinalOutcome,
  };

  function persistState() {
    progress[lessonKey].currentStep = state.stageIndex;
    progress[lessonKey].completedSteps = [...state.stageCompleted];
    progress[lessonKey].quizResults = structuredClone(state.questions);
    progress[lessonKey].rapidAnswers = structuredClone(state.rapidAnswers);
    if (lesson.id === 'PART-L5') {
      const scores = getFinalScores(lesson.stages.find((stage) => stage.kind === 'final-quiz') ?? { questions: [] }, state.questions);
      progress[lessonKey].answerScore = scores.answerScore;
      progress[lessonKey].reasoningScore = scores.reasoningScore;
    }
    saveParticipleProgress(progress);
  }

  function placeDraggedItem(questionId, itemId, targetId) {
    const question = currentStage().questions?.find((item) => item.id === questionId);
    if (!question || question.kind !== 'drag-rule') return;
    const previous = state.questions[questionId] ?? {};
    const placements = Object.fromEntries(Object.entries(previous.placements ?? {}).filter(([key, value]) => key !== itemId && value !== targetId));
    placements[itemId] = targetId;
    const correct = placements.ing === 'active' && placements.pp === 'passive';
    state.questions[questionId] = { ...previous, placements, selectedItem: null, attempts: (previous.attempts ?? 0) + 1, correct, error: !correct };
    if (correct && allQuestionsComplete(currentStage(), state.questions)) markStageComplete();
    else persistState();
    render();
  }

  root.innerHTML = `<div class="spec-course-shell"><div data-spec-progress-root></div><header class="spec-course-header"><p class="spec-kicker">${escapeHtml(lesson.label)} · WHAT / WHICH / WHERE</p><h2 id="participle-spec-heading">${escapeHtml(lesson.title)}</h2><p>${escapeHtml(lesson.goal)}</p></header><div data-spec-step-nav></div><section class="spec-stage-shell" aria-labelledby="spec-stage-title"><div class="spec-stage-heading"><p class="spec-kicker">CURRENT STEP</p><h3 id="spec-stage-title" tabindex="-1" data-spec-stage-title></h3><p data-spec-stage-description></p></div><div class="spec-stage-content" data-spec-stage-content></div><div class="spec-stage-status" data-spec-stage-status role="status" aria-live="polite"></div><nav class="spec-stage-controls" aria-label="Lesson step controls"><button class="spec-action-button secondary" type="button" data-spec-stage-prev>← Previous</button><button class="spec-action-button" type="button" data-spec-stage-next>Next →</button></nav></section></div>`;

  const progressRoot = root.querySelector('[data-spec-progress-root]');
  const navRoot = root.querySelector('[data-spec-step-nav]');
  const titleRoot = root.querySelector('[data-spec-stage-title]');
  const descriptionRoot = root.querySelector('[data-spec-stage-description]');
  const contentRoot = root.querySelector('[data-spec-stage-content]');
  const statusRoot = root.querySelector('[data-spec-stage-status]');
  const previousButton = root.querySelector('[data-spec-stage-prev]');
  const nextButton = root.querySelector('[data-spec-stage-next]');

  function currentStage() { return lesson.stages[state.stageIndex]; }
  function markStageComplete() {
    state.stageCompleted.add(currentStage().id);
    if (currentStage().id === 'check') {
      const questions = currentStage().questions ?? [];
      const score = questions.filter((question) => state.questions[question.id]?.correct === true).length;
      progress[lessonKey].quizScore = Math.max(progress[lessonKey].quizScore ?? 0, score);
      if (lesson.id === 'PART-L5') {
        const scores = getFinalScores(currentStage(), state.questions);
        progress[lessonKey].finalPassed = scores.answerScore >= 4 && scores.reasoningScore >= 4;
      }
    }
    persistState();
    onProgress?.(progress);
  }
  function render() {
    const stage = currentStage();
    progressRoot.innerHTML = renderLessonProgress(participleLessons, progress, lesson.id);
    navRoot.innerHTML = renderLessonStepNav(participleStageLabels, state.stageIndex, state.stageCompleted);
    titleRoot.textContent = stage.title;
    descriptionRoot.textContent = stage.description;
    contentRoot.innerHTML = renderStage(stage, state);
    const complete = state.stageCompleted.has(stage.id);
    statusRoot.textContent = complete ? 'Step complete — 次のステップへ進めます。' : '';
    previousButton.disabled = state.stageIndex === 0;
    nextButton.disabled = !complete || state.stageIndex === lesson.stages.length - 1;
  }
  function answerQuestion(questionId, choiceId) {
    const stage = currentStage();
    const question = stage.question?.id === questionId ? stage.question : questionMap(stage).get(questionId);
    if (!question || state.questions[questionId]?.correct) return;
    const previous = state.questions[questionId] ?? {};
    const attempts = (previous.attempts ?? 0) + 1;
    const correct = choiceId === question.answer;
    state.questions[questionId] = { ...previous, attempts, selected: choiceId, correct, message: correct ? '' : FEEDBACK_RETRY };
    persistState();
    if (correct && stage.kind !== 'final-quiz') {
      if (stage.question?.id === questionId || allQuestionsComplete(stage, state.questions)) markStageComplete();
    }
    render();
  }
  function setCaseState(index, patch) {
    state.cases[index] = { ...(state.cases[index] ?? {}), ...patch };
    const data = currentStage().cases?.[index];
    if (!data) return;
    const current = state.cases[index];
    if (current.relation === data.relationAnswer && current.form === data.formAnswer && Object.values(state.cases).filter((item) => item.form).length === (currentStage().cases?.length ?? 0)) markStageComplete();
    persistState();
  }
  on(root, 'click', (event) => {
    const stageButton = event.target.closest('[data-spec-stage]');
    if (stageButton) {
      const index = Number(stageButton.dataset.specStage);
      if (index <= state.stageIndex || state.stageCompleted.has(lesson.stages[index]?.id)) { state.stageIndex = index; persistState(); render(); titleRoot.focus({ preventScroll: true }); }
      return;
    }
    if (event.target.closest('[data-spec-stage-prev]')) { if (state.stageIndex > 0) { state.stageIndex -= 1; persistState(); render(); titleRoot.focus({ preventScroll: true }); } return; }
    if (event.target.closest('[data-spec-stage-next]')) { if (state.stageCompleted.has(currentStage().id) && state.stageIndex < lesson.stages.length - 1) { state.stageIndex += 1; persistState(); render(); titleRoot.focus({ preventScroll: true }); } return; }
    const questionChoice = event.target.closest('[data-spec-choice-question]');
    if (questionChoice) { answerQuestion(questionChoice.dataset.specChoiceQuestion, questionChoice.dataset.specChoiceId); return; }
    const action = event.target.closest('[data-spec-action]');
    if (action) {
      const actionName = action.dataset.specAction;
      const value = action.dataset.specValue;
      if (actionName === 'intro-select') state.introSelected = value;
      else if (actionName === 'change-tall') state.changes.tall = true;
      else if (actionName === 'change-cute') state.changes.cute = true;
      else if (actionName === 'choose-notice') state.noticeAnswer = value;
      else if (actionName === 'active-reveal') state.activeShown = true;
      else if (actionName === 'passive-relation') state.passiveRelation = value;
      else if (actionName === 'complete-stage') markStageComplete();
      else if (actionName === 'complete-lesson') { state.lessonCompleted = true; state.stageCompleted.add(currentStage().id); progress[lessonKey].completed = true; if (lesson.id === 'PART-L5') progress[lessonKey].finalPassed = true; persistState(); onProgress?.(progress); }
      else if (actionName === 'position-toggle') state.positionMode = value;
      else if (actionName === 'emotion-toggle') state.emotionMode = value;
      else if (actionName === 'myth-choice') state.mythChoice = value;
      else if (actionName === 'final-submit') {
        const scores = getFinalScores(currentStage(), state.questions);
        progress[lessonKey].answerScore = scores.answerScore;
        progress[lessonKey].reasoningScore = scores.reasoningScore;
        if (!progress[lessonKey].firstAttemptRecorded) {
          const firstScores = getFirstAttemptScores(currentStage(), state.questions);
          progress[lessonKey].firstAttemptAnswerScore = firstScores.answerScore;
          progress[lessonKey].firstAttemptReasoningScore = firstScores.reasoningScore;
          progress[lessonKey].firstAttemptRecorded = true;
        }
        const mastery = scores.answerScore >= 4 && scores.reasoningScore >= 4;
        if (mastery) { state.finalOutcome = 'complete'; markStageComplete(); } else { state.finalOutcome = 'review'; persistState(); }
      } else if (actionName === 'final-retry') {
        state.questions = Object.fromEntries(Object.entries(state.questions).filter(([, result]) => result.formCorrect === true && result.relationCorrect === true));
        state.finalOutcome = null;
        persistState();
      }
      else if (actionName === 'complete-word') markStageComplete();
      render();
      return;
    }
    const dragItem = event.target.closest('[data-spec-drag-item]');
    if (dragItem) {
      const [questionId, itemId] = dragItem.dataset.specDragItem.split(':');
      const previous = state.questions[questionId] ?? {};
      state.questions[questionId] = { ...previous, selectedItem: itemId };
      persistState();
      render();
      return;
    }
    const dragTarget = event.target.closest('[data-spec-drag-target]');
    if (dragTarget) {
      const [questionId, targetId] = dragTarget.dataset.specDragTarget.split(':');
      const selectedItem = state.questions[questionId]?.selectedItem;
      if (selectedItem) placeDraggedItem(questionId, selectedItem, targetId);
      return;
    }
    const wordCard = event.target.closest('[data-spec-word-card]');
    if (wordCard) { state.selectedWordCard = wordCard.dataset.specWordCard; render(); return; }
    const buildChip = event.target.closest('[data-spec-build-chip]');
    if (buildChip) { state.phraseBuilt = true; markStageComplete(); render(); return; }
    const caseNode = event.target.closest('[data-spec-case-node]');
    if (caseNode) { const [index, side] = caseNode.dataset.specCaseNode.split(':'); setCaseState(Number(index), { [`${side}Clicked`]: true }); render(); return; }
    const caseRelation = event.target.closest('[data-spec-case-relation]');
    if (caseRelation) { const [indexText, relation] = caseRelation.dataset.specCaseRelation.split(':'); const index = Number(indexText); const answer = currentStage().cases?.[index]?.relationAnswer; setCaseState(index, relation === answer ? { relation, form: undefined, error: false } : { relation, form: undefined, error: true }); render(); return; }
    const caseForm = event.target.closest('[data-spec-case-form]');
    if (caseForm) { const [indexText, form] = caseForm.dataset.specCaseForm.split(':'); const index = Number(indexText); const answer = currentStage().cases?.[index]?.formAnswer; setCaseState(index, form === answer ? { form, error: false } : { form: undefined, error: true }); render(); return; }
    const finalRelation = event.target.closest('[data-spec-final-relation]');
    if (finalRelation) {
      const [questionId, relation] = finalRelation.dataset.specFinalRelation.split(':');
      const question = currentStage().questions.find((item) => item.id === questionId);
      const previous = state.questions[questionId] ?? {};
      const relationCorrect = relation === question.relationAnswer;
      state.questions[questionId] = { ...previous, relation, relationAttempts: (previous.relationAttempts ?? 0) + 1, relationCorrect, firstRelationCorrect: previous.firstRelationCorrect ?? relationCorrect, form: relationCorrect ? previous.form : undefined, formCorrect: relationCorrect ? previous.formCorrect : false, formAttempts: relationCorrect ? previous.formAttempts : 0, correct: relationCorrect && previous.formCorrect === true };
      persistState();
      render();
      return;
    }
    const finalForm = event.target.closest('[data-spec-final-form]');
    if (finalForm) {
      const [questionId, form] = finalForm.dataset.specFinalForm.split(':');
      const question = currentStage().questions.find((item) => item.id === questionId);
      const previous = state.questions[questionId] ?? {};
      const formCorrect = form === question.answer;
      state.questions[questionId] = { ...previous, form, formAttempts: (previous.formAttempts ?? 0) + 1, formCorrect, firstFormCorrect: previous.firstFormCorrect ?? formCorrect, correct: previous.relationCorrect === true && formCorrect };
      persistState();
      render();
      return;
    }
    const positionChoice = event.target.closest('[data-spec-position-choice]');
    if (positionChoice) {
      const [questionId, position] = positionChoice.dataset.specPositionChoice.split(':');
      const question = currentStage().questions?.find((item) => item.id === questionId);
      if (!question) return;
      const previous = state.questions[questionId] ?? {};
      const correct = position === question.positionAnswer;
      state.questions[questionId] = { ...previous, position, attempts: (previous.attempts ?? 0) + 1, correct, error: !correct };
      if (correct && allQuestionsComplete(currentStage(), state.questions)) markStageComplete(); else persistState();
      render();
      return;
    }
    const svNode = event.target.closest('[data-spec-sv-node]');
    if (svNode) {
      const [questionId, side] = svNode.dataset.specSvNode.split(':');
      const previous = state.rapidAnswers?.[questionId] ?? {};
      state.rapidAnswers = { ...(state.rapidAnswers ?? {}), [questionId]: { ...previous, nodes: { ...(previous.nodes ?? {}), [side]: true } } };
      persistState();
      render();
      return;
    }
    const svRelation = event.target.closest('[data-spec-sv-relation]');
    if (svRelation) {
      const [questionId, relation] = svRelation.dataset.specSvRelation.split(':');
      const question = (Array.isArray(currentStage().rapid) ? currentStage().rapid : [currentStage().rapid]).find((item) => item?.id === questionId);
      if (!question) return;
      const previous = state.rapidAnswers?.[questionId] ?? {};
      const correct = relation === question.relationAnswer;
      state.rapidAnswers = { ...(state.rapidAnswers ?? {}), [questionId]: { ...previous, relation, relationError: !correct, form: correct ? previous.form : '', formError: false } };
      persistState();
      render();
      return;
    }
    const svForm = event.target.closest('[data-spec-sv-form]');
    if (svForm) {
      const [questionId, form] = svForm.dataset.specSvForm.split(':');
      const question = (Array.isArray(currentStage().rapid) ? currentStage().rapid : [currentStage().rapid]).find((item) => item?.id === questionId);
      if (!question) return;
      const previous = state.rapidAnswers?.[questionId] ?? {};
      state.rapidAnswers = { ...(state.rapidAnswers ?? {}), [questionId]: { ...previous, form, formError: form !== question.formAnswer } };
      persistState();
      render();
      return;
    }
    const relationChoice = event.target.closest('[data-spec-relation-choice]');
    if (relationChoice) {
      const [questionId, relation] = relationChoice.dataset.specRelationChoice.split(':');
      const question = currentStage().questions.find((item) => item.id === questionId);
      const previous = state.questions[questionId] ?? {};
      const relationCorrect = relation === question.relationAnswer;
      state.questions[questionId] = { ...previous, relation, relationAttempts: (previous.relationAttempts ?? 0) + 1, relationCorrect, firstRelationCorrect: previous.firstRelationCorrect ?? relationCorrect, relationError: !relationCorrect, form: relationCorrect ? previous.form : undefined, formCorrect: relationCorrect ? previous.formCorrect : false, correct: relationCorrect && previous.formCorrect === true };
      persistState();
      render();
      return;
    }
    const formChoice = event.target.closest('[data-spec-form-choice]');
    if (formChoice) {
      const [questionId, form] = formChoice.dataset.specFormChoice.split(':');
      const question = currentStage().questions.find((item) => item.id === questionId);
      const previous = state.questions[questionId] ?? {};
      const formCorrect = form === question.formAnswer;
      state.questions[questionId] = { ...previous, form: formCorrect ? form : undefined, formAttempts: (previous.formAttempts ?? 0) + 1, formCorrect, firstFormCorrect: previous.firstFormCorrect ?? formCorrect, formError: !formCorrect, correct: previous.relationCorrect === true && formCorrect };
      if (formCorrect && allQuestionsComplete(currentStage(), state.questions)) markStageComplete(); else persistState();
      render();
    }
  });
  on(root, 'dragover', (event) => { if (event.target.closest('[data-spec-builder], [data-spec-drag-target]')) event.preventDefault(); });
  on(root, 'drop', (event) => {
    const target = event.target.closest('[data-spec-drag-target]');
    if (target) {
      event.preventDefault();
      const [questionId, targetId] = target.dataset.specDragTarget.split(':');
      const payload = event.dataTransfer.getData('text/plain').split(':');
      if (payload[0] === 'drag') placeDraggedItem(questionId, payload[2], targetId);
      return;
    }
    if (event.target.closest('[data-spec-builder]')) { event.preventDefault(); state.phraseBuilt = true; markStageComplete(); render(); }
  });
  on(root, 'dragstart', (event) => {
    const item = event.target.closest('[data-spec-drag-item]');
    if (item) event.dataTransfer.setData('text/plain', `drag:${item.dataset.specDragItem}`);
    else if (event.target.closest('[data-spec-build-chip]')) event.dataTransfer.setData('text/plain', 'extra');
  });
  render();
  return cleanup;
}
