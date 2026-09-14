import { escapeHtml } from '../../lib/dom.js';

export function renderSentenceBuilder({ noun = '', modifier = '', extra = '', built = false } = {}) {
  return `<div class="spec-builder" data-spec-builder><p class="spec-builder-label">組み立てる語句</p><div class="spec-builder-sentence" data-spec-builder-dropzone aria-label="語句を追加する場所"><span>${escapeHtml(built ? `the ${noun} ${modifier}${extra ? ` ${extra}` : ''}` : `the ${modifier} ${noun}`)}</span></div><div class="spec-builder-parts"><span class="spec-builder-help">[追加]</span><button class="spec-builder-chip${built ? ' is-used' : ''}" type="button" draggable="true" data-spec-build-chip="extra" ${built ? 'disabled' : ''}>${escapeHtml(extra || 'at the clown')}</button><span class="spec-builder-help">クリックでも追加できます</span></div></div>`;
}
