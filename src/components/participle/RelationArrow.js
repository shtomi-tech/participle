import { escapeHtml } from '../../lib/dom.js';

export function renderRelationArrow({ from, to, label, direction = 'forward', modifier = '' }) {
  return `<div class="spec-relation-arrow is-${escapeHtml(direction)} ${escapeHtml(modifier)}"><span class="spec-relation-node">${escapeHtml(from)}</span><span class="spec-relation-line" aria-hidden="true"><i>→</i></span><span class="spec-relation-node">${escapeHtml(to)}</span>${label ? `<strong>${escapeHtml(label)}</strong>` : ''}</div>`;
}
