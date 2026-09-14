import { escapeHtml } from '../../lib/dom.js';
import { renderFeedback } from './FeedbackPanel.js';

export function renderChoiceQuestion(question, result = {}) {
  const attempts = result.attempts ?? 0;
  const passed = result.correct === true;
  const selected = result.selected;
  const hint = question.hint ?? '名詞と元の動詞の関係を、もう一度ゆっくり確認しましょう。';
  const revealAnswer = attempts >= 3 && !passed;
  const answerText = question.choices.find((item) => item.id === question.answer)?.text ?? question.answer;
  const reason = question.reason ?? question.explanation ?? '';
  return `<article class="spec-question${passed ? ' is-passed' : ''}" data-spec-question="${escapeHtml(question.id)}"><p class="spec-question-prompt">${escapeHtml(question.prompt).replaceAll('\n', '<br />')}</p><div class="spec-choice-grid" role="group" aria-label="${escapeHtml(question.id)} choices">${question.choices.map((item) => `<button class="spec-choice${selected === item.id ? ' is-selected' : ''}" type="button" data-spec-choice-question="${escapeHtml(question.id)}" data-spec-choice-id="${escapeHtml(item.id)}" aria-pressed="${selected === item.id}" ${passed ? 'disabled' : ''}>${escapeHtml(item.text)}</button>`).join('')}</div>${passed ? renderFeedback({ status: 'success', message: 'Good!', reason: `「なぜそうなるか」まで確認しよう。\n${reason}` }) : result.message ? renderFeedback({ status: 'error', message: result.message, hint: attempts >= 2 && !revealAnswer ? hint : '', reason: revealAnswer ? `正解：${answerText}\n${reason}` : '' }) : renderFeedback()}</article>`;
}
