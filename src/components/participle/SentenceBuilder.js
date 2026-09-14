import { escapeHtml } from '../../lib/dom.js';

export function renderSentenceBuilder({ noun = '', modifier = '', extra = '', built = false } = {}) {
  return `<div class="spec-builder" data-spec-builder><p class="spec-builder-label">組み立てる語句</p><div class="spec-builder-sentence"><span>${escapeHtml(built ? `the ${noun} ${modifier}${extra ? ` ${extra}` : ''}` : `the ${modifier} ${noun}`)}</span></div><div class="spec-builder-parts"><button class="spec-builder-chip${built ? ' is-used' : ''}" type="button" draggable="true" data-spec-build-chip="extra" ${built ? 'disabled' : ''}>${escapeHtml(extra || 'at the clown')}</button></div></div>`;
}
