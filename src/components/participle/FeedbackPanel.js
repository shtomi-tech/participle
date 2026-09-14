import { escapeHtml } from '../../lib/dom.js';

export function renderFeedback({ status = '', message = '', hint = '', reason = '' } = {}) {
  if (!message && !hint && !reason) return '<div class="spec-feedback" data-spec-feedback hidden></div>';
  const className = status ? ` is-${escapeHtml(status)}` : '';
  return `<div class="spec-feedback${className}" data-spec-feedback role="status" aria-live="polite"><strong>${escapeHtml(message)}</strong>${reason ? `<p>${escapeHtml(reason)}</p>` : ''}${hint ? `<p class="spec-hint">Hint: ${escapeHtml(hint)}</p>` : ''}</div>`;
}
