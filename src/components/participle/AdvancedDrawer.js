import { escapeHtml } from '../../lib/dom.js';

export function renderAdvancedDrawer(advanced, { id = 'advanced' } = {}) {
  if (!advanced) return '';
  return `<details class="spec-advanced" data-spec-advanced="${escapeHtml(id)}"><summary>${escapeHtml(advanced.title)}</summary><div class="spec-advanced-body"><p>${escapeHtml(advanced.body)}</p></div></details>`;
}
