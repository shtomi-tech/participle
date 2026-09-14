import { escapeHtml } from '../../lib/dom.js';

export function renderSentenceBuilder({ noun = '', modifier = '', extra = '', built = false, position = 'front', questionId = '', selectedPosition = '' } = {}) {
  const displayPosition = selectedPosition || position;
  const sentence = built || displayPosition === 'back'
    ? `the ${noun} ${modifier}${extra ? ` ${extra}` : ''}`
    : `the ${modifier} ${noun}`;
  const positionControls = questionId ? `<div class="spec-builder-position-controls" role="group" aria-label="分詞の位置"><button class="spec-choice${selectedPosition === 'front' ? ' is-selected' : ''}" type="button" data-spec-position-choice="${escapeHtml(questionId)}:front" aria-pressed="${selectedPosition === 'front'}">前に置く</button><button class="spec-choice${selectedPosition === 'back' ? ' is-selected' : ''}" type="button" data-spec-position-choice="${escapeHtml(questionId)}:back" aria-pressed="${selectedPosition === 'back'}">後ろに置く</button></div>` : '';
  const extraControl = questionId ? '' : `<div class="spec-builder-parts"><span class="spec-builder-help">[追加]</span><button class="spec-builder-chip${built ? ' is-used' : ''}" type="button" draggable="true" data-spec-build-chip="extra" ${built ? 'disabled' : ''}>${escapeHtml(extra || 'at the clown')}</button><span class="spec-builder-help">クリックでも追加できます</span></div>`;
  return `<div class="spec-builder" data-spec-builder><p class="spec-builder-label">組み立てる語句</p><div class="spec-builder-sentence" data-spec-builder-dropzone aria-label="語句を追加する場所"><span>${escapeHtml(sentence)}</span></div>${positionControls}${extraControl}</div>`;
}
