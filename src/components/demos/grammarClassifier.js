import { escapeHtml } from '../../lib/dom.js';
import { prepareMountRoot } from '../../lib/lifecycle.js';
import { checkClassification } from '../../lib/grammar/classification.js';

export function mountGrammarClassifier(root, problem, options = {}) {
  const { on, cleanup } = prepareMountRoot(root);
  if (!problem || problem.type !== 'grammar-classifier') {
    throw new TypeError('Grammar Classifier needs a grammar-classifier problem');
  }
  const onComplete = typeof options.onComplete === 'function' ? options.onComplete : () => {};
  let selectedItemId = null;
  let assignments = {};

  root.innerHTML = `
    <p class="instruction">${escapeHtml(problem.prompt)}</p>
    <div class="demo-stage classifier-stage">
      <h3>Sentence</h3>
      <p class="classifier-sentence">${escapeHtml(problem.sentence)}</p>
      <h3>Phrase cards</h3>
      <div class="classifier-card-list" data-classifier-cards aria-live="polite"></div>
      <h3>Classification areas</h3>
      <div class="classifier-category-grid" data-classifier-categories></div>
      <div class="demo-actions">
        <button class="button secondary" type="button" data-classifier-reset>Reset</button>
        <button class="button" type="button" data-classifier-check>Check answer</button>
      </div>
      <div class="feedback" data-classifier-feedback role="status" aria-live="polite"></div>
      <div class="classifier-result" data-classifier-result hidden></div>
      <p class="explanation" data-classifier-explanation hidden>${escapeHtml(problem.explanation)}</p>
    </div>`;

  const cards = root.querySelector('[data-classifier-cards]');
  const categories = root.querySelector('[data-classifier-categories]');
  const feedback = root.querySelector('[data-classifier-feedback]');
  const result = root.querySelector('[data-classifier-result]');
  const explanation = root.querySelector('[data-classifier-explanation]');
  const resetButton = root.querySelector('[data-classifier-reset]');
  const checkButton = root.querySelector('[data-classifier-check]');

  function restoreFocus(focusTarget) {
    if (!focusTarget) return;
    let target = null;
    if (focusTarget.type === 'category') {
      target = [...root.querySelectorAll('[data-classifier-category-id]')]
        .find((button) => button.dataset.classifierCategoryId === focusTarget.id);
    } else if (focusTarget.type === 'item') {
      target = [...root.querySelectorAll('[data-classifier-item-id]')]
        .find((button) => button.dataset.classifierItemId === focusTarget.id);
    } else if (focusTarget.type === 'check') {
      target = checkButton;
    }
    target?.focus();
  }

  function render(focusTarget = null) {
    const unclassifiedItems = problem.items.filter((item) => !assignments[item.id]);
    cards.innerHTML = unclassifiedItems.length
      ? unclassifiedItems.map((item) => `
          <button class="classifier-card" type="button" data-classifier-item-id="${escapeHtml(item.id)}" aria-pressed="${selectedItemId === item.id}">
            ${escapeHtml(item.text)}
          </button>`).join('')
      : '<p class="classifier-empty">すべての語句を分類しました。</p>';

    categories.innerHTML = problem.categories.map((category) => {
      const categoryItems = problem.items.filter((item) => assignments[item.id] === category.id);
      return `
        <section class="classifier-category" aria-labelledby="classifier-category-${escapeHtml(category.id)}">
          <button class="classifier-category-target" type="button" data-classifier-category-id="${escapeHtml(category.id)}" aria-label="${escapeHtml(category.label)}へ分類">
            <span id="classifier-category-${escapeHtml(category.id)}">${escapeHtml(category.label)}</span>
            <span class="classifier-count">${categoryItems.length}</span>
          </button>
          <div class="classifier-category-items" data-classifier-category-items="${escapeHtml(category.id)}">
            ${categoryItems.map((item) => `
              <button class="classifier-card" type="button" data-classifier-item-id="${escapeHtml(item.id)}" aria-pressed="${selectedItemId === item.id}">
                ${escapeHtml(item.text)}
              </button>`).join('')}
          </div>
        </section>`;
    }).join('');
    restoreFocus(focusTarget);
  }

  function clearFeedback() {
    feedback.className = 'feedback';
    feedback.textContent = '';
    result.hidden = true;
    result.innerHTML = '';
    explanation.hidden = true;
  }

  function check() {
    const correct = checkClassification(assignments, problem.items);
    feedback.className = `feedback is-visible ${correct ? 'success' : 'error'}`;
    feedback.textContent = correct
      ? `Correct — ${problem.classificationAxis}に沿って分類できました。`
      : `Not yet — ${problem.classificationAxis}を考えてみましょう。`;
    onComplete({ correct, problemId: problem.id, assignments: { ...assignments } });
    if (!correct) return;

    result.innerHTML = problem.categories.map((category) => {
      const categoryItems = problem.items.filter((item) => item.answer === category.id);
      return `
        <div class="classifier-result-row">
          <span class="structure-role">${escapeHtml(category.label)}</span>
          <div>${categoryItems.map((item) => `
            <strong class="structure-text">${escapeHtml(item.text)}</strong>
            <p>${escapeHtml(category.explanation)} ${escapeHtml(item.explanation)}</p>`).join('')}</div>
        </div>`;
    }).join('');
    result.hidden = false;
    explanation.hidden = false;
  }

  on(cards, 'click', (event) => {
    const button = event.target.closest('[data-classifier-item-id]');
    if (!button) return;
    selectedItemId = button.dataset.classifierItemId;
    clearFeedback();
    render({ type: 'category', id: problem.categories[0].id });
  });

  on(categories, 'click', (event) => {
    const itemButton = event.target.closest('[data-classifier-item-id]');
    if (itemButton) {
      selectedItemId = itemButton.dataset.classifierItemId;
      clearFeedback();
      render({
        type: 'category',
        id: itemButton.closest('[data-classifier-category-items]')?.dataset.classifierCategoryItems,
      });
      return;
    }
    const button = event.target.closest('[data-classifier-category-id]');
    if (!button) return;
    if (!selectedItemId) {
      feedback.className = 'feedback is-visible';
      feedback.textContent = 'まず語句カードを選択してください。';
      return;
    }
    const assignedIndex = problem.items.findIndex((item) => item.id === selectedItemId);
    assignments = { ...assignments, [selectedItemId]: button.dataset.classifierCategoryId };
    selectedItemId = null;
    clearFeedback();
    const nextItem = problem.items.find((item, index) => index > assignedIndex && !assignments[item.id])
      ?? problem.items.find((item) => !assignments[item.id]);
    render(nextItem ? { type: 'item', id: nextItem.id } : { type: 'check' });
  });

  on(resetButton, 'click', () => {
    selectedItemId = null;
    assignments = {};
    clearFeedback();
    render({ type: 'item', id: problem.items[0].id });
  });
  on(checkButton, 'click', check);

  render();
  return cleanup;
}
