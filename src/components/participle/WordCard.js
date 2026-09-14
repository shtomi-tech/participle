import { escapeHtml } from '../../lib/dom.js';

export function renderWordCard(card, { selected = false, className = '' } = {}) {
  const id = card.id ?? card.word;
  const text = card.word ?? card.text;
  const detail = card.gloss ?? card.detail ?? card.subtext ?? '';
  return `<button class="spec-word-card ${className}${selected ? ' is-selected' : ''}" type="button" data-spec-word-card="${escapeHtml(id)}" aria-pressed="${selected}"><strong>${escapeHtml(text)}</strong>${detail ? `<span>${escapeHtml(detail)}</span>` : ''}</button>`;
}
