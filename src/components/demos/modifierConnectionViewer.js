import { escapeHtml } from '../../lib/dom.js';
import { prepareMountRoot } from '../../lib/lifecycle.js';
import { getRelatedChunkIds, getRelationsForChunk, hasExploredAllRelations } from '../../lib/grammar/modifier-relations.js';

export function mountModifierConnectionViewer(root, problem, options = {}) {
  const { on, cleanup } = prepareMountRoot(root);
  if (!problem || problem.type !== 'modifier-connection-viewer') throw new TypeError('Modifier Connection Viewer needs a modifier-connection-viewer problem');
  const onComplete = typeof options.onComplete === 'function' ? options.onComplete : () => {};
  const chunkById = new Map(problem.chunks.map((chunk) => [chunk.id, chunk]));
  const exploredRelationIds = new Set();
  let selectedChunkId = null;
  let completed = false;

  root.innerHTML = `
    <p class="instruction">${escapeHtml(problem.prompt)}</p>
    <div class="demo-stage modifier-connection-stage">
      <h3>Sentence chunks</h3>
      <div class="modifier-chunk-row" data-modifier-chunks role="group" aria-label="Sentence chunks"></div>
      <h3>Modifier connection</h3>
      <div class="modifier-relation-list" data-modifier-relations role="list" aria-label="Modifier relations"></div>
      <div class="modifier-selection" data-modifier-selection role="status" aria-live="polite">語句を選択すると、修飾関係が表示されます。</div>
      <p class="modifier-progress" data-modifier-progress aria-live="polite"></p>
      <div class="demo-actions"><button class="button secondary" type="button" data-modifier-reset>Reset</button></div>
      <p class="explanation" data-modifier-explanation>${escapeHtml(problem.explanation)}</p>
    </div>`;

  const chunks = root.querySelector('[data-modifier-chunks]');
  const relations = root.querySelector('[data-modifier-relations]');
  const selection = root.querySelector('[data-modifier-selection]');
  const progress = root.querySelector('[data-modifier-progress]');
  const resetButton = root.querySelector('[data-modifier-reset]');

  function restoreFocus(focusTarget) {
    if (!focusTarget) return;
    if (focusTarget.type === 'chunk') [...root.querySelectorAll('[data-sentence-chunk-id]')].find((button) => button.dataset.sentenceChunkId === focusTarget.id)?.focus();
    if (focusTarget.type === 'relation') [...root.querySelectorAll('[data-relation-node-id]')].find((button) => button.dataset.relationNodeId === focusTarget.id && button.dataset.relationId === focusTarget.relationId)?.focus();
    if (focusTarget.type === 'reset') resetButton.focus();
  }

  function render(focusTarget = null) {
    const relatedIds = new Set(getRelatedChunkIds(problem.relations, selectedChunkId));
    const selectedRelations = getRelationsForChunk(problem.relations, selectedChunkId);
    chunks.innerHTML = problem.chunks.map((chunk) => `
      <button class="modifier-chunk${relatedIds.has(chunk.id) ? ' is-related' : ''}" type="button" data-sentence-chunk-id="${escapeHtml(chunk.id)}" aria-pressed="${selectedChunkId === chunk.id}">
        <span>${escapeHtml(chunk.text)}</span><small>${escapeHtml(chunk.kind)}</small>
      </button>`).join('');
    relations.innerHTML = problem.relations.map((relation) => {
      const modifier = chunkById.get(relation.modifierId);
      const target = chunkById.get(relation.targetId);
      const active = selectedChunkId === relation.modifierId || selectedChunkId === relation.targetId;
      return `<article class="modifier-relation${active ? ' is-active' : ''}" role="listitem">
        <button class="relation-node" type="button" data-relation-node-id="${escapeHtml(modifier.id)}" data-relation-id="${escapeHtml(relation.id)}" aria-pressed="${selectedChunkId === modifier.id}"><span>Modifier</span>${escapeHtml(modifier.text)}</button>
        <span class="relation-arrow" aria-hidden="true">→</span>
        <button class="relation-node" type="button" data-relation-node-id="${escapeHtml(target.id)}" data-relation-id="${escapeHtml(relation.id)}" aria-pressed="${selectedChunkId === target.id}"><span>Target</span>${escapeHtml(target.text)}</button>
        <p class="relation-label">${escapeHtml(relation.label)}</p>
      </article>`;
    }).join('');
    if (!selectedChunkId) selection.textContent = '語句を選択すると、修飾関係が表示されます。';
    else if (!selectedRelations.length) selection.textContent = `${chunkById.get(selectedChunkId)?.text ?? '選択した語句'} に対応する修飾関係はありません。`;
    else selection.textContent = `${chunkById.get(selectedChunkId).text} を選択。${selectedRelations.map((relation) => relation.explanation).join(' ')}`;
    progress.textContent = completed ? 'Relation complete.' : `${exploredRelationIds.size} / ${problem.relations.length} relations explored.`;
    restoreFocus(focusTarget);
  }

  function selectChunk(id, focusTarget) {
    if (!chunkById.has(id)) return;
    selectedChunkId = selectedChunkId === id ? null : id;
    getRelationsForChunk(problem.relations, id).forEach((relation) => exploredRelationIds.add(relation.id));
    render(focusTarget);
    if (!completed && hasExploredAllRelations(problem.relations, exploredRelationIds)) {
      completed = true;
      onComplete({ correct: true, problemId: problem.id, targetNoun: problem.targetNoun, baseVerb: problem.baseVerb, semanticVoice: problem.semanticVoice, participleForm: problem.participleForm, exploredRelationIds: [...exploredRelationIds] });
      progress.textContent = 'Relation complete.';
    }
  }

  on(root, 'click', (event) => {
    const chunk = event.target.closest('[data-sentence-chunk-id]');
    if (chunk) {
      selectChunk(chunk.dataset.sentenceChunkId, { type: 'chunk', id: chunk.dataset.sentenceChunkId });
      return;
    }
    const node = event.target.closest('[data-relation-node-id]');
    if (node) selectChunk(node.dataset.relationNodeId, { type: 'relation', id: node.dataset.relationNodeId, relationId: node.dataset.relationId });
  });
  on(resetButton, 'click', () => {
    selectedChunkId = null;
    exploredRelationIds.clear();
    completed = false;
    render({ type: 'reset' });
    onComplete({ correct: false, problemId: problem.id, reset: true });
  });
  render();
  return cleanup;
}
