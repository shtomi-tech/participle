import { escapeHtml } from '../../lib/dom.js';
import { prepareMountRoot } from '../../lib/lifecycle.js';
import { evaluateExamChoice } from '../../lib/grammar/exam-multiple-choice.js';

// Reconstructed source exercises remain ordinary learner-facing questions; the
// reconstruction metadata is kept in Problem Data for traceability only.
export function mountPracticeMultipleChoice(root, problem, options = {}) {
  const { on, cleanup } = prepareMountRoot(root);
  if (!problem || problem.type !== 'practice-multiple-choice') {
    throw new TypeError('Lesson 6 Practical needs a practice-multiple-choice problem');
  }
  const onComplete = typeof options.onComplete === 'function' ? options.onComplete : () => {};
  let selectedChoiceId = null;
  let submitted = false;

  root.innerHTML = `
    <p class="instruction">${escapeHtml(problem.prompt)}</p>
    <div class="demo-stage exam-mc-stage">
      <h3>問題</h3>
      <p class="exam-mc-stem">${escapeHtml(problem.stem)}</p>
      <div class="exam-mc-choices" data-practice-choices role="group" aria-label="解答の選択肢"></div>
      <div class="demo-actions">
        <button class="button" type="button" data-practice-submit disabled>解答する</button>
      </div>
      <div class="exam-mc-result" data-practice-result role="status" aria-live="polite" tabindex="-1" hidden></div>
      <section class="exam-mc-overall" data-practice-overall hidden>
        <h3>文法解説</h3>
        <p data-practice-overall-text></p>
      </section>
      <section class="exam-mc-review" data-practice-review hidden>
        <h3>選択肢ごとの解説</h3>
        <ol class="exam-mc-review-list" data-practice-review-list></ol>
      </section>
      <div class="demo-actions">
        <button class="button secondary" type="button" data-practice-reset hidden>もう一度解く</button>
      </div>
    </div>`;

  const choices = root.querySelector('[data-practice-choices]');
  const submitButton = root.querySelector('[data-practice-submit]');
  const result = root.querySelector('[data-practice-result]');
  const overall = root.querySelector('[data-practice-overall]');
  const overallText = root.querySelector('[data-practice-overall-text]');
  const review = root.querySelector('[data-practice-review]');
  const reviewList = root.querySelector('[data-practice-review-list]');
  const resetButton = root.querySelector('[data-practice-reset]');

  function focusChoice(choiceId) {
    [...choices.querySelectorAll('[data-practice-choice-id]')]
      .find((button) => button.dataset.practiceChoiceId === choiceId)
      ?.focus();
  }

  function renderChoices(focusTarget = null) {
    choices.innerHTML = problem.choices.map((choice, index) => {
      const selected = selectedChoiceId === choice.id;
      let stateLabel = '';
      if (submitted) {
        stateLabel = choice.id === problem.answerChoiceId
          ? '正解'
          : choice.id === selectedChoiceId
            ? 'あなたの選択'
            : '未選択';
      } else if (selected) {
        stateLabel = '選択中';
      }
      return `
        <button class="exam-mc-choice${selected ? ' is-selected' : ''}" type="button" data-practice-choice-id="${escapeHtml(choice.id)}" aria-pressed="${selected}"${submitted ? ' disabled' : ''}>
          <span class="exam-mc-choice-number" aria-hidden="true">${index + 1}.</span>
          <span class="exam-mc-choice-text">${escapeHtml(choice.text)}</span>
          <span class="exam-mc-choice-state">${escapeHtml(stateLabel)}</span>
        </button>`;
    }).join('');
    if (focusTarget) focusChoice(focusTarget);
  }

  function renderReview(evaluation) {
    const answerIndex = problem.choices.findIndex((choice) => choice.id === evaluation.answerChoiceId);
    const answerChoice = problem.choices[answerIndex];
    result.className = `exam-mc-result is-visible ${evaluation.correct ? 'success' : 'error'}`;
    result.textContent = evaluation.correct
      ? '○ 正解です'
      : `× 不正解です。正解：${answerIndex + 1}. ${answerChoice.text}`;
    result.hidden = false;
    overallText.textContent = problem.explanation;
    overall.hidden = false;
    reviewList.innerHTML = problem.choices.map((choice, index) => {
      const isAnswer = choice.id === evaluation.answerChoiceId;
      const isSelectedWrong = choice.id === evaluation.selectedChoiceId && !evaluation.correct;
      const labels = [isAnswer ? '正解' : '', isSelectedWrong ? 'あなたの選択' : ''].filter(Boolean).join(' · ');
      return `
        <li class="exam-mc-option-review${isAnswer ? ' is-answer' : ''}${isSelectedWrong ? ' is-selected-wrong' : ''}">
          <div class="exam-mc-option-heading">
            <strong>${index + 1}. ${escapeHtml(choice.text)}</strong>
            <span>${escapeHtml(labels)}</span>
          </div>
          <p>${escapeHtml(choice.explanation)}</p>
        </li>`;
    }).join('');
    review.hidden = false;
  }

  function submit() {
    if (submitted || !selectedChoiceId) return;
    const evaluation = evaluateExamChoice(problem, selectedChoiceId);
    submitted = true;
    submitButton.disabled = true;
    resetButton.hidden = false;
    renderChoices();
    renderReview(evaluation);
    onComplete({ ...evaluation, problemId: problem.id });
    result.focus({ preventScroll: true });
  }

  function reset() {
    selectedChoiceId = null;
    submitted = false;
    submitButton.disabled = true;
    result.hidden = true;
    result.textContent = '';
    overall.hidden = true;
    overallText.textContent = '';
    review.hidden = true;
    reviewList.innerHTML = '';
    resetButton.hidden = true;
    renderChoices(problem.choices[0]?.id);
    onComplete({ correct: false, problemId: problem.id, reset: true });
  }

  on(choices, 'click', (event) => {
    const choiceButton = event.target.closest('[data-practice-choice-id]');
    if (!choiceButton || submitted) return;
    selectedChoiceId = choiceButton.dataset.practiceChoiceId;
    submitButton.disabled = false;
    renderChoices(selectedChoiceId);
  });
  on(submitButton, 'click', submit);
  on(resetButton, 'click', reset);
  renderChoices();
  return cleanup;
}
