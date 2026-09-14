import { escapeHtml } from '../../lib/dom.js';

export function renderLessonProgress(lessons, progress, currentLessonId) {
  return `
    <div class="spec-progress" data-spec-progress aria-label="Lesson progress">
      <div class="spec-progress-heading"><span>PARTICIPLE</span><strong>LESSON ${progress.currentLesson} / ${lessons.length}</strong></div>
      <ol class="spec-progress-dots">
        ${lessons.map((lesson, index) => {
          const lessonProgress = progress[`lesson${index + 1}`];
          const state = lessonProgress?.completed ? 'complete' : lesson.id === currentLessonId ? 'current' : 'upcoming';
          return `<li class="spec-progress-item is-${state}" data-spec-progress-lesson="${escapeHtml(lesson.id)}" aria-label="${escapeHtml(`${lesson.label}: ${state}`)}"><span>${index + 1}</span><small>${escapeHtml(lesson.label)}</small></li>`;
        }).join('')}
      </ol>
    </div>`;
}
