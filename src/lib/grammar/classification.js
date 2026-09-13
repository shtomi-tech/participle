export function checkClassification(assignments, answer) {
  if (!assignments || typeof assignments !== 'object') return false;

  const expected = Array.isArray(answer)
    ? Object.fromEntries(answer.map((item) => [item.id, item.answer]))
    : answer && typeof answer === 'object'
      ? answer
      : {};
  const actualIds = Object.keys(assignments);
  const expectedIds = Object.keys(expected);

  return actualIds.length === expectedIds.length && expectedIds.every(
    (id) => Object.prototype.hasOwnProperty.call(assignments, id) && assignments[id] === expected[id],
  );
}
