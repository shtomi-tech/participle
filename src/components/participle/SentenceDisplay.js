import { escapeHtml } from '../../lib/dom.js';

export function renderSentenceDisplay({ before = '', after = '', emphasis = '' } = {}) {
  const sentence = after || before;
  const displayed = escapeHtml(sentence).replace(
    emphasis ? new RegExp(`(${emphasis.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi') : /(?!)/,
    '<strong class="spec-highlight">$1</strong>',
  );
  return `<div class="spec-sentence-display" data-spec-sentence-display>${displayed}</div>`;
}
