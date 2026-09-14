import { escapeHtml } from '../../lib/dom.js';
import { mountExamMultipleChoice } from './examMultipleChoice.js';

export function mountPracticeMultipleChoice(root, problem, options = {}) {
  if (!problem || problem.type !== 'practice-multiple-choice') {
    throw new TypeError('Lesson 6 Practical needs a practice-multiple-choice problem');
  }

  return mountExamMultipleChoice(root, problem, {
    ...options,
    renderAfterExplanation(extension) {
      if (problem.practiceStage !== 'structure') return;
      extension.innerHTML = `
        <section class="exam-mc-overall practice-analysis" data-practice-analysis>
          <h3>解き方</h3>
          <ol class="practice-analysis-list">
            ${problem.analysisSteps.map((step) => `
              <li><strong>${escapeHtml(step.label)}</strong><span>${escapeHtml(step.value)}</span></li>
            `).join('')}
          </ol>
        </section>`;
    },
  });
}
