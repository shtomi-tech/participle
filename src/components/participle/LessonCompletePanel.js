import { escapeHtml } from '../../lib/dom.js';

export function renderLessonCompletePanel({ completed = false, summary = '' } = {}) {
  return `<div class="spec-complete-panel${completed ? ' is-complete' : ''}" data-spec-complete-panel role="status" aria-live="polite"><strong>${completed ? 'COMPLETE' : 'SUMMARY'}</strong><p>${escapeHtml(summary).replaceAll('\n', '<br />')}</p></div>`;
}
