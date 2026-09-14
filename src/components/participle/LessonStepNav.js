import { escapeHtml } from '../../lib/dom.js';

export function renderLessonStepNav(labels, currentIndex, completedIds, stageIds = labels.map((label) => label.toLowerCase())) {
  return `
    <nav class="spec-step-nav" aria-label="Lesson steps">
      ${labels.map((label, index) => {
         const complete = completedIds.has(stageIds[index]) || completedIds.has(label);
        const current = index === currentIndex;
        return `<button class="spec-step-tab${current ? ' is-current' : ''}${complete ? ' is-complete' : ''}" type="button" data-spec-stage="${index}" ${index > currentIndex && !complete ? 'disabled' : ''} aria-current="${current ? 'step' : 'false'}"><span>${index + 1}</span>${escapeHtml(label)}</button>`;
      }).join('')}
    </nav>`;
}
