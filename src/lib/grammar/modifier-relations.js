export function getRelationsForChunk(relations, chunkId) {
  if (!Array.isArray(relations) || !chunkId) return [];
  return relations.filter((relation) => relation.modifierId === chunkId || relation.targetId === chunkId);
}

export function getRelatedChunkIds(relations, chunkId) {
  return getRelationsForChunk(relations, chunkId).flatMap((relation) => (
    relation.modifierId === chunkId ? [relation.targetId] : [relation.modifierId]
  ));
}

export function hasExploredAllRelations(relations, exploredRelationIds) {
  if (!Array.isArray(relations) || relations.length === 0) return false;
  return relations.every((relation) => exploredRelationIds?.has(relation.id));
}
