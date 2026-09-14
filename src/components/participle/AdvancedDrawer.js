import { escapeHtml } from '../../lib/dom.js';

export function renderAdvancedDrawer(advanced, { id = 'advanced' } = {}) {
  if (!advanced) return '';
  const body = escapeHtml(advanced.body).replaceAll('\n', '<br />');
  return `<details class="spec-advanced" data-spec-advanced="${escapeHtml(id)}"><summary>${escapeHtml(advanced.title)}</summary><div class="spec-advanced-body"><p>${body}</p></div></details>`;
}
