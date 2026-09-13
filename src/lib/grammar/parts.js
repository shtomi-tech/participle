export function checkTokenSelection(selectedIds, answerIds) {
  if (!Array.isArray(selectedIds) || !Array.isArray(answerIds)) return false;
  if (selectedIds.length !== answerIds.length) return false;
  const selected = new Set(selectedIds);
  return answerIds.every((id) => selected.has(id));
}
