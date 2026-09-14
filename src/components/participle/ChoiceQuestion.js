import { escapeHtml } from '../../lib/dom.js';

export function renderChoiceQuestion(question, result = {}) {
  const attempts = result.attempts ?? 0;
  const passed = result.correct === true;
  const selected = result.selected;
  const hint = question.hint ?? '名詞と元の動詞の関係を、もう一度ゆっくり確認しましょう。';
  return `<article class="spec-question${passed ? ' is-passed' : ''}" data-spec-question="${escapeHtml(question.id)}"><p class="spec-question-prompt">${escapeHtml(question.prompt).replaceAll('\n', '<br />')}</p><div class="spec-choice-grid" role="group" aria-label="${escapeHtml(question.id)} choices">${question.choices.map((item) => `<button class="spec-choice${selected === item.id ? ' is-selected' : ''}" type="button" data-spec-choice-question="${escapeHtml(question.id)}" data-spec-choice-id="${escapeHtml(item.id)}" aria-pressed="${selected === item.id}" ${passed ? 'disabled' : ''}>${escapeHtml(item.text)}</button>`).join('')}</div>${passed ? `<div class="spec-feedback is-success" data-spec-feedback role="status" aria-live="polite"><strong>Good!</strong><p>「なぜそうなるか」まで確認しよう。</p><p>${escapeHtml(question.reason ?? '')}</p></div>` : result.message ? `<div class="spec-feedback is-error" data-spec-feedback role="status" aria-live="polite"><strong>${escapeHtml(result.message)}</strong>${attempts >= 2 ? `<p class="spec-hint">Hint: ${escapeHtml(hint)}</p>` : ''}</div>` : ''}</article>`;
}
