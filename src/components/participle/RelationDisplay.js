import { escapeHtml } from '../../lib/dom.js';
import { renderRelationArrow } from './RelationArrow.js';

export function renderRelationDisplay({ from = '', to = '', relation = '', meaning = '', label = '' } = {}) {
  const relationText = relation === 'active' ? 'する' : relation === 'passive' ? 'される' : '';
  const visibleLabel = label || (relationText ? `能動・${relationText}` : '関係');
  return `<div class="spec-relation-display" data-spec-relation-display><p class="spec-relation-meaning">${escapeHtml(meaning || relationText)}</p>${renderRelationArrow({ from, to, label: visibleLabel })}</div>`;
}
