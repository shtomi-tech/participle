import { escapeHtml } from '../../lib/dom.js';
import { prepareMountRoot } from '../../lib/lifecycle.js';
import { checkTokenSelection } from '../../lib/grammar/parts.js';

export function mountMarkTheParts(root, problem, options = {}) {
  const { on, cleanup } = prepareMountRoot(root);
  if (!problem || problem.type !== 'mark-parts') throw new TypeError('Mark the Parts needs a mark-parts problem');
  const onComplete = typeof options.onComplete === 'function' ? options.onComplete : () => {};
  let selectedIds = [];
  let completed = false;

  root.innerHTML = `
    <p class="instruction">${escapeHtml(problem.prompt)}</p>
    <div class="demo-stage mark-parts-stage">
      <h3>Sentence</h3>
      <div class="parts-token-row" data-parts-tokens role="group" aria-label="Sentence tokens"></div>
      <div class="demo-actions">
        <button class="button secondary" type="button" data-parts-reset>Reset</button>
        <button class="button" type="button" data-parts-check>Check selection</button>
      </div>
      <div class="feedback" data-parts-feedback role="status" aria-live="polite"></div>
      <div class="structure-result" data-structure-result aria-live="polite" hidden></div>
    </div>`;

  const tokens = root.querySelector('[data-parts-tokens]');
  const feedback = root.querySelector('[data-parts-feedback]');
  const structure = root.querySelector('[data-structure-result]');
  const resetButton = root.querySelector('[data-parts-reset]');
  const checkButton = root.querySelector('[data-parts-check]');

  function render(focusId = null) {
    tokens.innerHTML = problem.tokens.map((token) => `
      <button class="parts-token" type="button" data-token-id="${escapeHtml(token.id)}" aria-pressed="${selectedIds.includes(token.id)}">
        <span class="parts-token-text">${escapeHtml(token.text)}</span>
        <span class="parts-token-role">${escapeHtml(token.role)}</span>
      </button>`).join('');
    if (focusId) [...tokens.querySelectorAll('[data-token-id]')].find((button) => button.dataset.tokenId === focusId)?.focus();
  }

  function clearFeedback() {
    feedback.className = 'feedback';
    feedback.textContent = '';
    structure.hidden = true;
    structure.innerHTML = '';
  }

  function check() {
    const correct = checkTokenSelection(selectedIds, problem.answer);
    feedback.className = `feedback is-visible ${correct ? 'success' : 'error'}`;
    feedback.textContent = correct
      ? `Correct — ${problem.targetNoun} が説明対象です。`
      : `Not yet — ${problem.targetRole} をもう一度考えてみましょう。`;
    if (correct) {
      completed = true;
      structure.hidden = false;
      structure.innerHTML = problem.tokens
        .filter((token) => selectedIds.includes(token.id) || token.role === 'Participle' || token.role === 'Participle phrase')
        .map((token) => `<div class="structure-row"><span>${escapeHtml(token.role)}</span><strong>${escapeHtml(token.text)}</strong></div>`)
        .join('');
      onComplete({ correct: true, problemId: problem.id, targetNoun: problem.targetNoun, baseVerb: problem.baseVerb, semanticVoice: problem.semanticVoice, participleForm: problem.participleForm });
    } else {
      onComplete({ correct: false, problemId: problem.id, selectedIds: [...selectedIds] });
    }
  }

  on(tokens, 'click', (event) => {
    const button = event.target.closest('[data-token-id]');
    if (!button) return;
    const id = button.dataset.tokenId;
    selectedIds = selectedIds.includes(id) ? selectedIds.filter((tokenId) => tokenId !== id) : [...selectedIds, id];
    clearFeedback();
    render(id);
  });
  on(resetButton, 'click', () => {
    selectedIds = [];
    completed = false;
    clearFeedback();
    render();
    onComplete({ correct: false, problemId: problem.id, reset: true });
  });
  on(checkButton, 'click', check);
  render();
  return cleanup;
}
