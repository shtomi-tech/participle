import { escapeHtml } from '../lib/dom.js';
import { prepareMountRoot } from '../lib/lifecycle.js';
import { loadParticipleProgress, saveParticipleProgress } from '../lib/participle-progress.js';
import { participleLessons, participleStageLabels } from '../data/participle-course.js';
import { renderLessonProgress } from './participle/LessonProgress.js';
import { renderLessonStepNav } from './participle/LessonStepNav.js';
import { renderWordCard } from './participle/WordCard.js';
import { renderRelationArrow } from './participle/RelationArrow.js';
import { renderRuleSummary } from './participle/RuleSummary.js';
import { renderAdvancedDrawer } from './participle/AdvancedDrawer.js';
import { renderChoiceQuestion } from './participle/ChoiceQuestion.js';
import { renderSentenceBuilder } from './participle/SentenceBuilder.js';
import { renderSVRelationJudge } from './participle/SVRelationJudge.js';

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

function renderStandardQuiz(stage, state) {
  const questions = stage.questions ?? [];
  const final = stage.kind === 'final-quiz';
  const attempted = questions.every((question) => (state.questions[question.id]?.attempts ?? 0) > 0);
  const score = questions.filter((question) => state.questions[question.id]?.correct === true).length;
  const wrongQuestions = questions.filter((question) => state.questions[question.id]?.correct !== true);
  const reviewLinks = wrongQuestions.map((question) => `<a href="#lessons/${escapeHtml(question.id === 'l5-q1' || question.id === 'l5-q2' ? 'hidden-sv' : 'emotion-verbs')}">${escapeHtml(question.id.replace(/^l5-/i, '').toUpperCase())}を復習 → ${escapeHtml(question.review ?? '')}</a>`).join('');
  const finalResult = final && state.finalOutcome === 'review'
    ? `<div class="spec-review-result is-review" data-spec-final-result role="status" aria-live="polite"><strong>REVIEW</strong><p>4問以上の正解を目指しましょう。誤答した問題を復習して、もう一度挑戦できます。</p><div class="spec-review-links">${reviewLinks}</div><button class="spec-action-button secondary" type="button" data-spec-action="final-retry">もう一度挑戦</button></div>`
    : final && state.finalOutcome === 'complete'
      ? '<div class="spec-review-result is-complete" data-spec-final-result role="status" aria-live="polite"><strong>COMPLETE</strong><p>分詞の基本ルールを理解しました。次のSUMMARYへ進めます。</p></div>'
      : '';
  return `<div class="spec-quiz" data-spec-quiz>${questions.map((question) => renderChoiceQuestion(question, state.questions[question.id] ?? {})).join('')}<div class="spec-quiz-footer"><span data-spec-score>${final && attempted ? `${score} / ${questions.length} correct` : `${questions.filter((question) => state.questions[question.id]?.correct).length} / ${questions.length} complete`}</span>${final ? `<button class="spec-action-button" type="button" data-spec-action="final-submit" ${attempted ? '' : 'disabled'}>結果を見る</button>` : ''}</div>${finalResult}</div>`;
}

function renderIntroStage(stage, state) {
  return `<div class="spec-intro-stage"><div class="spec-intro-cards">${stage.cards.map((card) => `<button class="spec-intro-card${state.introSelected === card.id ? ' is-selected' : ''}${state.introSelected && state.introSelected !== card.id ? ' is-muted' : ''}" type="button" data-spec-action="intro-select" data-spec-value="${escapeHtml(card.id)}" aria-pressed="${state.introSelected === card.id}"><span class="spec-card-kicker">${escapeHtml(card.badge)}</span><strong>${escapeHtml(card.title)}</strong><span>${escapeHtml(card.detail)}</span></button>`).join('')}</div><p class="spec-note">「分詞」カードを選ぶと、今日の範囲がはっきりします。</p>${state.introSelected === 'participle' ? '<button class="spec-action-button" type="button" data-spec-action="complete-stage">分詞を見てみる →</button>' : ''}</div>`;
}

function renderChangeStage(state) {
  const tallChanged = state.changes?.tall === true;
  const cuteChanged = state.changes?.cute === true;
  const tallExplanation = tallChanged ? '<p class="spec-explanation-line">tall と dancing は、同じ場所に入っています。<br />tall は形容詞。dancing も、この文では同じように説明する働きをしています。</p><p class="spec-rule-emphasis">分詞は、形容詞として働く。</p>' : '';
  const noticeFeedback = state.noticeAnswer === 'modify'
    ? '<p class="spec-feedback is-success" role="status"><strong>Exactly.</strong><br />どちらも baby がどんなものかを説明しています。</p>'
    : state.noticeAnswer
      ? '<p class="spec-feedback is-error" role="status"><strong>もう一度考えてみよう。</strong></p>'
      : '';
  const notice = cuteChanged ? `<div class="spec-notice"><strong>cute と smiling の共通点は？</strong><div class="spec-choice-grid"><button class="spec-choice" type="button" data-spec-action="choose-notice" data-spec-value="action">A. 動作を表す</button><button class="spec-choice" type="button" data-spec-action="choose-notice" data-spec-value="modify">B. baby を説明する</button><button class="spec-choice" type="button" data-spec-action="choose-notice" data-spec-value="past">C. 過去を表す</button></div>${noticeFeedback}</div>` : '';
  const complete = tallChanged && cuteChanged && state.noticeAnswer === 'modify' ? '<button class="spec-action-button" type="button" data-spec-action="complete-stage">次へ →</button>' : '';
  return `<div class="spec-change-stage"><div class="spec-sentence-card"><span class="spec-kicker">FIRST</span><p>The girl is <strong class="spec-change-word${tallChanged ? ' is-replaced' : ''}">${tallChanged ? 'dancing' : 'tall'}</strong>.</p><button class="spec-action-button secondary" type="button" data-spec-action="change-tall">CHANGE</button></div>${tallExplanation}<div class="spec-sentence-card"><span class="spec-kicker">ANOTHER EXAMPLE</span><p>Look at the <strong class="spec-change-word${cuteChanged ? ' is-replaced' : ''}">${cuteChanged ? 'smiling' : 'cute'}</strong> baby.</p><button class="spec-action-button secondary" type="button" data-spec-action="change-cute">CHANGE</button></div>${notice}${complete}</div>`;
}

function renderContrastStage() {
  return `<div class="spec-contrast-stage"><p class="spec-note">「現在」「過去」という名前はいったん忘れよう。</p><div class="spec-contrast-grid"><article class="spec-contrast-card is-active"><span class="spec-big-form">-ing</span><strong>DOER</strong><span>する側</span><span class="spec-direction">→</span></article><div class="spec-contrast-center" aria-hidden="true"><span>boy</span><i>● ─────▶</i><span>ball</span></div><article class="spec-contrast-card is-passive"><span class="spec-big-form">p.p.</span><strong>RECEIVER</strong><span>される側</span><span class="spec-direction">←</span></article></div><p class="spec-explanation-line">見るべきなのは、その名詞が動作をするのか、されるのか。</p><button class="spec-action-button" type="button" data-spec-action="complete-stage">関係を見る →</button></div>`;
}

function renderActivePassiveStage(state) {
  const active = state.activeShown === true;
  const passive = state.passiveRelation === 'passive';
  return `<div class="spec-active-passive-stage"><article class="spec-example-panel"><p class="spec-kicker">ACTIVE</p><p class="spec-example-sentence">a boy <strong>kicking</strong> the ball</p>${renderRelationArrow({ from: 'boy', to: 'ball', label: 'kick', direction: 'forward' })}<button class="spec-node-button" type="button" data-spec-action="active-reveal">boy</button>${active ? '<div class="spec-feedback is-success" role="status"><strong>Who kicks?</strong><p>the boy</p><p>boy が kick する<br /><b>ACTIVE → kicking</b></p></div>' : ''}</article><article class="spec-example-panel"><p class="spec-kicker">PASSIVE</p><p class="spec-example-sentence">the ball <strong>kicked</strong> by the boy</p>${renderRelationArrow({ from: 'boy', to: 'ball', label: 'kick', direction: 'forward' })}<p class="spec-question-prompt">ball は kick する？<br />kick される？</p><div class="spec-choice-grid"><button class="spec-choice" type="button" data-spec-action="passive-relation" data-spec-value="active" aria-pressed="${state.passiveRelation === 'active'}">する</button><button class="spec-choice" type="button" data-spec-action="passive-relation" data-spec-value="passive" aria-pressed="${passive}">される</button></div>${state.passiveRelation === 'active' ? '<p class="spec-feedback is-error" role="status"><strong>Not yet.</strong><br />ball は kick される側です。</p>' : ''}${passive ? '<div class="spec-feedback is-success" role="status"><strong>ball は kick される</strong><p>PASSIVE → <b>kicked</b></p></div>' : ''}</article></div>${active && passive ? '<button class="spec-action-button" type="button" data-spec-action="complete-stage">次へ →</button>' : ''}</div>`;
}

function renderWordCardsStage(stage, state) {
  const selected = state.selectedWordCard;
  return `<div class="spec-word-cards-stage"><p class="spec-note">p.p.の根には「〜された」というイメージがあります。カードを一つ選んで確認しましょう。</p><div class="spec-word-card-grid">${stage.cards.map((card) => renderWordCard(card, { selected: selected === card.id })).join('')}</div>${selected ? `<div class="spec-word-card-detail" role="status"><strong>${escapeHtml(stage.cards.find((card) => card.id === selected)?.word)}</strong><span>${escapeHtml(stage.cards.find((card) => card.id === selected)?.gloss)}</span></div>` : ''}${renderAdvancedDrawer(stage.advanced, { id: 'l2-fallen' })}<button class="spec-action-button" type="button" data-spec-action="complete-stage" ${selected ? '' : 'disabled'}>カードを確認した →</button></div>`;
}

function renderOneWordStage() {
  return `<div class="spec-one-word-stage"><div class="spec-large-sentence">the <strong class="spec-highlight">laughing</strong> children</div><p class="spec-note">laughing だけなら1語。</p><p class="spec-rule-emphasis">1語の分詞 → 名詞の前</p><button class="spec-action-button" type="button" data-spec-action="complete-stage">位置を覚えた →</button></div>`;
}

function renderBuildPhraseStage(state) {
  return `<div class="spec-build-stage"><p class="spec-note">laughing にこの情報を追加してみよう。</p>${renderSentenceBuilder({ noun: 'children', modifier: 'laughing', extra: 'at the clown', built: state.phraseBuilt })}${state.phraseBuilt ? '<div class="spec-feedback is-success" role="status"><strong>説明が長くなったので、名詞の後ろへ移動しました。</strong><p class="spec-rule-emphasis">2語以上 → 名詞の後ろ</p><p class="spec-large-sentence">the children <strong class="spec-highlight">laughing at the clown</strong></p></div>' : ''}<button class="spec-action-button" type="button" data-spec-action="complete-stage" ${state.phraseBuilt ? '' : 'disabled'}>次へ →</button></div>`;
}

function renderPositionCompareStage(state) {
  return `<div class="spec-position-stage"><div class="spec-toggle-row"><button type="button" class="spec-toggle${state.positionMode !== 'long' ? ' is-selected' : ''}" data-spec-action="position-toggle" data-spec-value="short">1 WORD</button><button type="button" class="spec-toggle${state.positionMode === 'long' ? ' is-selected' : ''}" data-spec-action="position-toggle" data-spec-value="long">2+ WORDS</button></div><div class="spec-position-example"><p class="spec-large-sentence">${state.positionMode === 'long' ? 'the children ' : 'the '}<strong class="spec-highlight">${state.positionMode === 'long' ? 'laughing at the clown' : 'laughing'}</strong>${state.positionMode === 'long' ? '' : ' children'}</p><p>${state.positionMode === 'long' ? '説明が長いので名詞の後ろ。' : '1語なので名詞の前。'}</p></div><div class="spec-rule-cards"><div><code>the pen</code> + <code>on the desk</code><strong>→ the pen on the desk</strong></div><div><code>time</code> + <code>to study</code><strong>→ time to study</strong></div><div><code>the boy</code> + <code>who is tall</code><strong>→ the boy who is tall</strong></div></div><p class="spec-explanation-line">分詞だけの特殊ルールではありません。<br /><b>英語では、長い説明を名詞の後ろに置くことが多い。</b></p><button class="spec-action-button" type="button" data-spec-action="complete-stage">比較できた →</button></div>`;
}

function renderSvFlowStage() {
  return `<div class="spec-flow-stage"><p class="spec-note">-ing か p.p. か迷ったら、まず「誰がその動作をする？」と考えよう。</p><div class="spec-flow"><div>名詞が動作する？</div><span>│</span><div class="spec-flow-branches"><strong>YES → -ing</strong><strong>NO ↓</strong></div><div>名詞が動作される？</div><span>↓</span><strong>p.p.</strong></div><p class="spec-flow-caption">名詞 → 動詞 = DO / ACTIVE → -ing<br />動詞 → 名詞 = RECEIVE / PASSIVE → p.p.</p><button class="spec-action-button" type="button" data-spec-action="complete-stage">判定フローを使う →</button></div>`;
}

function renderCase(caseData, index, state) {
  const current = state.cases?.[index] ?? {};
  const complete = current.form;
  return `<article class="spec-case-panel"><p class="spec-kicker">CASE ${index + 1}</p><p class="spec-example-sentence">${escapeHtml(caseData.sentence)}</p><div class="spec-case-nodes"><button type="button" class="spec-node-button${current.nounClicked ? ' is-selected' : ''}" data-spec-case-node="${index}:noun">${escapeHtml(caseData.noun)}</button><span>＋</span><button type="button" class="spec-node-button${current.verbClicked ? ' is-selected' : ''}" data-spec-case-node="${index}:verb">${escapeHtml(caseData.verb)}</button></div>${current.nounClicked && current.verbClicked ? `<p class="spec-question-prompt">${escapeHtml(caseData.noun)} が ${escapeHtml(caseData.verb)} する？</p><div class="spec-choice-grid"><button type="button" class="spec-choice" data-spec-case-relation="${index}:active">YES</button><button type="button" class="spec-choice" data-spec-case-relation="${index}:passive">NO</button></div>` : '<p class="spec-note">名詞と動詞をクリックして、関係を見ます。</p>'}${current.relation ? `${renderRelationArrow({ from: current.relation === 'active' ? caseData.noun : caseData.verb, to: current.relation === 'active' ? caseData.verb : caseData.noun, label: current.relation === 'active' ? 'ACTIVE' : 'PASSIVE' })}<p class="spec-bridge-sentence">${escapeHtml(caseData.relationSentence)}</p><div class="spec-choice-grid">${caseData.forms.map((form) => `<button type="button" class="spec-choice${current.form === form.id ? ' is-selected' : ''}" data-spec-case-form="${index}:${escapeHtml(form.id)}" aria-pressed="${current.form === form.id}">${escapeHtml(form.text)}</button>`).join('')}</div>` : ''}${current.error ? '<p class="spec-feedback is-error" role="status"><strong>もう一度、関係を見てみよう。</strong></p>' : ''}${complete ? `<p class="spec-feedback is-success" role="status"><strong>${escapeHtml(caseData.answerForm)}</strong> — ${escapeHtml(caseData.answerReason)}</p>` : ''}</article>`;
}

function renderSvCasesStage(state) {
  const cases = [
    { sentence: 'the baby ___ at her mother', noun: 'baby', verb: 'smile', relation: 'active', relationSentence: 'baby smiles.', forms: [{ id: 'smiling', text: 'smiling' }, { id: 'smiled', text: 'smiled' }], answerForm: 'smiling', answerReason: 'baby が smile する' },
    { sentence: 'the language ___ in that country', noun: 'language', verb: 'speak', relation: 'passive', relationSentence: 'language is spoken.', forms: [{ id: 'speaking', text: 'speaking' }, { id: 'spoken', text: 'spoken' }], answerForm: 'spoken', answerReason: 'language が speak される' },
  ];
  const complete = cases.every((item, index) => state.cases?.[index]?.form);
  return `<div class="spec-cases-stage">${cases.map((item, index) => renderCase(item, index, state)).join('')}<p class="spec-warning">日本語訳だけで決めない。</p><button class="spec-action-button" type="button" data-spec-action="complete-stage" ${complete ? '' : 'disabled'}>関係を確認した →</button></div>`;
}

function renderRapidJudgeStage(state) {
  const selectedRelation = state.rapidRelation;
  const selectedForm = state.rapidForm;
  const done = selectedForm === 'running';
  return `<div class="spec-rapid-stage"><article class="spec-rapid-card"><p class="spec-example-sentence">the dog ___ in the park</p><p class="spec-kicker">STEP 1 · 関係判定</p>${renderSVRelationJudge({ noun: 'dog', verb: 'run', relation: selectedRelation, form: selectedForm, forms: [{ id: 'running', text: 'running' }, { id: 'run', text: 'run' }] })}${state.rapidError ? '<p class="spec-feedback is-error" role="status"><strong>関係を先に確かめよう。</strong></p>' : ''}${done ? '<p class="spec-feedback is-success" role="status"><strong>dog → run → running</strong><br />関係判定 → 形選択の順です。</p>' : ''}</article><details class="spec-advanced"><summary>BONUS：being p.p.</summary><div class="spec-advanced-body"><p>The chocolate cake <b>being baked</b> in the oven right now ...</p><p>受動＋進行 = <strong>being baked</strong></p></div></details><details class="spec-advanced"><summary>BONUS：waiting room</summary><div class="spec-advanced-body"><p>room が wait する？ → NO</p><p>この waiting は分詞ではありません。waiting room =「待つための部屋」</p></div></details><button class="spec-action-button" type="button" data-spec-action="complete-stage" ${done ? '' : 'disabled'}>次へ →</button></div>`;
}

function renderRelationQuiz(stage, state) {
  return `<div class="spec-relation-quiz">${stage.questions.map((question) => { const result = state.questions[question.id] ?? {}; const finished = result.correct; return `<article class="spec-question${finished ? ' is-passed' : ''}" data-spec-relation-question="${escapeHtml(question.id)}"><p class="spec-question-prompt">${escapeHtml(question.sentence)}</p><p class="spec-kicker">STEP 1 · SV関係</p><div class="spec-choice-grid"><button type="button" class="spec-choice${result.relation === 'active' ? ' is-selected' : ''}" data-spec-relation-choice="${escapeHtml(question.id)}:active" aria-pressed="${result.relation === 'active'}">${escapeHtml(question.noun)} → ${escapeHtml(question.verb)}</button><button type="button" class="spec-choice${result.relation === 'passive' ? ' is-selected' : ''}" data-spec-relation-choice="${escapeHtml(question.id)}:passive" aria-pressed="${result.relation === 'passive'}">${escapeHtml(question.verb)} → ${escapeHtml(question.noun)}</button></div>${result.relationError ? '<p class="spec-feedback is-error" role="status"><strong>もう一度、名詞と動詞の関係を見てみよう。</strong></p>' : ''}${result.relation === question.relationAnswer ? `<p class="spec-kicker">STEP 2 · 形を選ぶ</p><div class="spec-choice-grid">${question.formChoices.map((form) => `<button type="button" class="spec-choice${result.form === form.id ? ' is-selected' : ''}" data-spec-form-choice="${escapeHtml(question.id)}:${escapeHtml(form.id)}" aria-pressed="${result.form === form.id}">${escapeHtml(form.text)}</button>`).join('')}</div>` : ''}${result.formError ? '<p class="spec-feedback is-error" role="status"><strong>形は、関係のあとで選ぼう。</strong></p>' : ''}${finished ? `<p class="spec-feedback is-success" role="status"><strong>${escapeHtml(question.formAnswer)}</strong> — ${escapeHtml(question.reason)}</p>` : ''}</article>`; }).join('')}</div>`;
}

function renderEmotionIntroStage(stage, state) {
  return `<div class="spec-emotion-intro-stage">${renderChoiceQuestion(stage.question, state.questions[stage.question.id] ?? {})}${state.questions[stage.question.id]?.correct ? `<div class="spec-emotion-callback"><p class="spec-large-sentence">surprise 人</p><span>=</span><strong>人を驚かせる</strong><p>He surprised his wife by giving her flowers.</p></div>` : ''}</div>`;
}

function renderEmotionSwitchStage(state) {
  const mode = state.emotionMode ?? 'boring';
  return `<div class="spec-emotion-switch-stage"><div class="spec-emotion-visual">MOVIE <span>── boredom ──▶</span> ME</div><p class="spec-note">左は感情を与える側。右は感情を与えられる側。</p><div class="spec-toggle-row"><button type="button" class="spec-toggle${mode === 'boring' ? ' is-selected' : ''}" data-spec-action="emotion-toggle" data-spec-value="boring">boring</button><button type="button" class="spec-toggle${mode === 'bored' ? ' is-selected' : ''}" data-spec-action="emotion-toggle" data-spec-value="bored">bored</button></div><div class="spec-emotion-result"><p class="spec-large-sentence">You are <strong class="spec-highlight">${mode}</strong>.</p>${mode === 'boring' ? '<p>You → 周りの人を退屈させる</p><p>「あなたは退屈な人だ」</p>' : '<p>周りの状況 → Youを退屈させる</p><p>「あなたは退屈している」</p>'}</div><div class="spec-myth"><strong>人だから -ed？</strong><div class="spec-choice-grid"><button type="button" class="spec-choice" data-spec-action="myth-choice" data-spec-value="yes">YES</button><button type="button" class="spec-choice" data-spec-action="myth-choice" data-spec-value="no">NO</button></div>${state.mythChoice === 'no' ? '<p class="spec-feedback is-success" role="status"><strong>NO。</strong><br />人でも、周りに感情を与える側なら -ing。<br /><b>Oliver is exciting. / You are amazing!</b></p>' : state.mythChoice ? '<p class="spec-feedback is-error" role="status"><strong>もう一度。</strong>主語が人かどうかだけでは決まりません。</p>' : ''}</div><button class="spec-action-button" type="button" data-spec-action="complete-stage" ${state.mythChoice === 'no' ? '' : 'disabled'}>次へ →</button></div>`;
}

function renderEmotionVocabularyStage(stage, state) {
  return `<div class="spec-vocabulary-stage"><p class="spec-note">感情動詞は「人を〜させる」。カテゴリを開いて眺めます。</p><div class="spec-vocabulary-drawer">${stage.categories.map((category) => `<details><summary>${escapeHtml(category.title)}</summary><div class="spec-vocabulary-list">${category.words.map((word) => `<button type="button" class="spec-word-card" data-spec-word-card="${escapeHtml(word)}"><strong>${escapeHtml(word)}</strong><span>人を〜させる</span></button>`).join('')}</div></details>`).join('')}</div>${renderAdvancedDrawer(stage.advanced, { id: 'l5-exceptions' })}<button class="spec-action-button" type="button" data-spec-action="complete-stage">Vocabularyを見た →</button></div>`;
}

function renderStage(stage, state) {
  switch (stage.kind) {
    case 'intro': return renderIntroStage(stage, state);
    case 'change': return renderChangeStage(state);
    case 'try-intro': return `<div class="spec-try-intro-stage"><div class="spec-example-panel"><p>Look at the <b>cute</b> baby.</p><p>Look at the <b>smiling</b> baby.</p><p class="spec-rule-emphasis">どちらも baby がどんなものかを説明しています。</p></div>${renderChoiceQuestion(stage.question, state.questions[stage.question.id] ?? {})}</div>`;
    case 'contrast': return renderContrastStage();
    case 'active-passive': return renderActivePassiveStage(state);
    case 'word-cards': return renderWordCardsStage(stage, state);
    case 'one-word': return renderOneWordStage();
    case 'build-phrase': return renderBuildPhraseStage(state);
    case 'position-compare': return renderPositionCompareStage(state);
    case 'sv-flow': return renderSvFlowStage();
    case 'sv-cases': return renderSvCasesStage(state);
    case 'rapid-judge': return renderRapidJudgeStage(state);
    case 'relation-quiz': return renderRelationQuiz(stage, state);
    case 'emotion-intro': return renderEmotionIntroStage(stage, state);
    case 'emotion-switch': return renderEmotionSwitchStage(state);
    case 'emotion-vocabulary': return renderEmotionVocabularyStage(stage, state);
    case 'quiz': return renderStandardQuiz(stage, state);
    case 'final-quiz': return renderStandardQuiz(stage, state);
    case 'summary': return `<div class="spec-summary-stage"><div class="spec-complete-mark">${state.lessonCompleted ? 'COMPLETE' : 'SUMMARY'}</div><p class="spec-summary-text">${escapeHtml(state.summary ?? '')}</p>${renderRuleSummary(state.summary ?? '', { complete: state.lessonCompleted })}<button class="spec-action-button" type="button" data-spec-action="complete-lesson" ${state.lessonCompleted ? 'disabled' : ''}>${state.lessonCompleted ? 'Lessonを完了しました' : 'Lessonを完了する →'}</button></div>`;
    default: return '<p>このステップは準備中です。</p>';
  }
}

export function mountParticipleLesson(root, lesson, { onProgress } = {}) {
  const { on, cleanup } = prepareMountRoot(root);
  if (!lesson || !participleLessons.some((item) => item.id === lesson.id)) throw new TypeError('A Participle lesson is required');
  const lessonIndex = participleLessons.findIndex((item) => item.id === lesson.id);
  const progress = loadParticipleProgress();
  progress.currentLesson = lessonIndex + 1;
  saveParticipleProgress(progress);
  const lessonKey = lessonProgressKey(lessonIndex);
  const state = {
    stageIndex: 0,
    stageCompleted: new Set(progress[lessonKey]?.completed ? participleStageLabels : []),
    introSelected: null,
    changes: {},
    questions: {},
    cases: {},
    summary: lesson.summary,
    lessonCompleted: Boolean(progress[lessonKey]?.completed),
    finalOutcome: null,
  };

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
      if (lesson.id === 'PART-L5') progress[lessonKey].finalPassed = score >= 4;
      saveParticipleProgress(progress);
    }
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
    if (correct && stage.kind !== 'final-quiz') {
      if (stage.question?.id === questionId || allQuestionsComplete(stage, state.questions)) markStageComplete();
    }
    render();
  }
  function setCaseState(index, patch) {
    state.cases[index] = { ...(state.cases[index] ?? {}), ...patch };
    const data = [
      { relation: 'active', form: 'smiling' },
      { relation: 'passive', form: 'spoken' },
    ][index];
    const current = state.cases[index];
    if (current.relation === data.relation && current.form === data.form && Object.values(state.cases).filter((item) => item.form).length === 2) markStageComplete();
  }
  on(root, 'click', (event) => {
    const stageButton = event.target.closest('[data-spec-stage]');
    if (stageButton) {
      const index = Number(stageButton.dataset.specStage);
      if (index <= state.stageIndex || state.stageCompleted.has(lesson.stages[index]?.id)) { state.stageIndex = index; render(); titleRoot.focus({ preventScroll: true }); }
      return;
    }
    if (event.target.closest('[data-spec-stage-prev]')) { if (state.stageIndex > 0) { state.stageIndex -= 1; render(); titleRoot.focus({ preventScroll: true }); } return; }
    if (event.target.closest('[data-spec-stage-next]')) { if (state.stageCompleted.has(currentStage().id) && state.stageIndex < lesson.stages.length - 1) { state.stageIndex += 1; render(); titleRoot.focus({ preventScroll: true }); } return; }
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
      else if (actionName === 'complete-lesson') { state.lessonCompleted = true; progress[lessonKey].completed = true; if (lesson.id === 'PART-L5') progress[lessonKey].finalPassed = true; saveParticipleProgress(progress); onProgress?.(progress); }
      else if (actionName === 'position-toggle') state.positionMode = value;
      else if (actionName === 'emotion-toggle') state.emotionMode = value;
      else if (actionName === 'myth-choice') state.mythChoice = value;
      else if (actionName === 'final-submit') {
        const questions = currentStage().questions ?? [];
        const score = questions.filter((question) => state.questions[question.id]?.correct).length;
        if (score >= 4) { state.finalOutcome = 'complete'; markStageComplete(); } else state.finalOutcome = 'review';
      } else if (actionName === 'final-retry') { state.questions = {}; state.finalOutcome = null; }
      else if (actionName === 'complete-word') markStageComplete();
      render();
      return;
    }
    const wordCard = event.target.closest('[data-spec-word-card]');
    if (wordCard) { state.selectedWordCard = wordCard.dataset.specWordCard; render(); return; }
    const buildChip = event.target.closest('[data-spec-build-chip]');
    if (buildChip) { state.phraseBuilt = true; markStageComplete(); render(); return; }
    const caseNode = event.target.closest('[data-spec-case-node]');
    if (caseNode) { const [index, side] = caseNode.dataset.specCaseNode.split(':'); setCaseState(Number(index), { [`${side}Clicked`]: true }); render(); return; }
    const caseRelation = event.target.closest('[data-spec-case-relation]');
    if (caseRelation) { const [indexText, relation] = caseRelation.dataset.specCaseRelation.split(':'); const index = Number(indexText); const answer = index === 0 ? 'active' : 'passive'; setCaseState(index, relation === answer ? { relation, error: false } : { error: true }); render(); return; }
    const caseForm = event.target.closest('[data-spec-case-form]');
    if (caseForm) { const [indexText, form] = caseForm.dataset.specCaseForm.split(':'); const index = Number(indexText); const answer = index === 0 ? 'smiling' : 'spoken'; setCaseState(index, form === answer ? { form, error: false } : { error: true }); render(); return; }
    const svNode = event.target.closest('[data-spec-sv-node]');
    if (svNode) { state.rapidNodes = { ...(state.rapidNodes ?? {}), [svNode.dataset.specSvNode]: true }; render(); return; }
    const svRelation = event.target.closest('[data-spec-sv-relation]');
    if (svRelation) { state.rapidRelation = svRelation.dataset.specSvRelation; render(); return; }
    const svForm = event.target.closest('[data-spec-sv-form]');
    if (svForm) { state.rapidForm = svForm.dataset.specSvForm; render(); return; }
    const relationChoice = event.target.closest('[data-spec-relation-choice]');
    if (relationChoice) { const [questionId, relation] = relationChoice.dataset.specRelationChoice.split(':'); const question = currentStage().questions.find((item) => item.id === questionId); const previous = state.questions[questionId] ?? {}; state.questions[questionId] = { ...previous, relation, relationError: relation !== question.relationAnswer, form: relation === question.relationAnswer ? previous.form : undefined }; render(); return; }
    const formChoice = event.target.closest('[data-spec-form-choice]');
    if (formChoice) { const [questionId, form] = formChoice.dataset.specFormChoice.split(':'); const question = currentStage().questions.find((item) => item.id === questionId); const previous = state.questions[questionId] ?? {}; const correct = form === question.formAnswer; state.questions[questionId] = { ...previous, form: correct ? form : undefined, formError: !correct, correct }; if (correct && allQuestionsComplete(currentStage(), state.questions)) markStageComplete(); render(); }
  });
  on(root, 'dragover', (event) => { if (event.target.closest('[data-spec-builder]')) event.preventDefault(); });
  on(root, 'drop', (event) => { if (event.target.closest('[data-spec-builder]')) { event.preventDefault(); state.phraseBuilt = true; markStageComplete(); render(); } });
  on(root, 'dragstart', (event) => { if (event.target.closest('[data-spec-build-chip]')) event.dataTransfer.setData('text/plain', 'extra'); });
  render();
  return cleanup;
}
