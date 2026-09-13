const problemTypes = new Set(['mark-parts', 'modifier-connection-viewer']);
const voices = new Set(['active', 'passive']);
const forms = new Set(['-ing', 'p.p.']);

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function duplicateIds(entries, label, errors) {
  const ids = new Set();
  entries.forEach((entry, index) => {
    if (!hasText(entry?.id)) return;
    if (ids.has(entry.id)) errors.push(`${label}[${index}] has duplicate id: ${entry.id}`);
    ids.add(entry.id);
  });
}

function validateShared(problem, label, errors, knownRequirementIds) {
  for (const field of ['id', 'type', 'lessonId', 'targetNoun', 'baseVerb', 'prompt', 'explanation']) {
    if (!hasText(problem[field])) errors.push(`${label}.${field} is required`);
  }
  if (!voices.has(problem.semanticVoice)) errors.push(`${label}.semanticVoice is invalid: ${problem.semanticVoice}`);
  if (!forms.has(problem.participleForm)) errors.push(`${label}.participleForm is invalid: ${problem.participleForm}`);
  if (!isRecord(problem.sourceEvidence) || !hasText(problem.sourceEvidence.source) || !hasText(problem.sourceEvidence.section)) {
    errors.push(`${label}.sourceEvidence needs source and section`);
  }
  if (!['chapter14-ocr.md', 'chapter14-ocr.json'].includes(problem.sourceEvidence?.source)) {
    errors.push(`${label}.sourceEvidence.source is not an allowed OCR source`);
  }
  if (!Array.isArray(problem.requirements) || problem.requirements.length === 0) {
    errors.push(`${label}.requirements must contain at least one LR ID`);
  } else {
    problem.requirements.forEach((id) => {
      if (!knownRequirementIds.has(id)) errors.push(`${label}.requirements references unknown LR ID: ${id}`);
    });
  }
}

function validateMarkParts(problem, label, errors) {
  if (!Array.isArray(problem.tokens) || problem.tokens.length === 0) {
    errors.push(`${label}.tokens must contain at least one token`);
    return;
  }
  duplicateIds(problem.tokens, `${label}.tokens`, errors);
  const tokenIds = new Set(problem.tokens.map((token) => token.id));
  problem.tokens.forEach((token, index) => {
    if (!hasText(token?.id) || !hasText(token?.text) || !hasText(token?.role)) {
      errors.push(`${label}.tokens[${index}] needs id, text, and role`);
    }
  });
  if (!Array.isArray(problem.answer) || problem.answer.length === 0) {
    errors.push(`${label}.answer must contain at least one token ID`);
  } else {
    problem.answer.forEach((id) => {
      if (!tokenIds.has(id)) errors.push(`${label}.answer references unknown token: ${id}`);
    });
  }
  if (!hasText(problem.targetRole)) errors.push(`${label}.targetRole is required`);
}

function validateModifierConnection(problem, label, errors) {
  if (!hasText(problem.sentence)) errors.push(`${label}.sentence is required`);
  if (!Array.isArray(problem.chunks) || problem.chunks.length < 2) {
    errors.push(`${label}.chunks must contain at least two chunks`);
  } else {
    duplicateIds(problem.chunks, `${label}.chunks`, errors);
    const chunkIds = new Set(problem.chunks.map((chunk) => chunk.id));
    problem.chunks.forEach((chunk, index) => {
      if (!hasText(chunk?.id) || !hasText(chunk?.text) || !['core', 'modifier'].includes(chunk?.kind)) {
        errors.push(`${label}.chunks[${index}] needs id, text, and kind`);
      }
    });
    if (!Array.isArray(problem.relations) || problem.relations.length === 0) {
      errors.push(`${label}.relations must contain at least one relation`);
    } else {
      duplicateIds(problem.relations, `${label}.relations`, errors);
      problem.relations.forEach((relation, index) => {
        if (!hasText(relation?.id) || !hasText(relation?.label) || !hasText(relation?.explanation)) {
          errors.push(`${label}.relations[${index}] needs id, label, and explanation`);
        }
        if (!chunkIds.has(relation?.modifierId)) errors.push(`${label}.relations[${index}] has unknown modifierId`);
        if (!chunkIds.has(relation?.targetId)) errors.push(`${label}.relations[${index}] has unknown targetId`);
        if (relation?.modifierId === relation?.targetId) errors.push(`${label}.relations[${index}] endpoints must differ`);
        if (relation?.relationType !== 'modifies') errors.push(`${label}.relations[${index}].relationType is invalid`);
      });
    }
  }
}

export function validateProblems(entries, { knownRequirementIds = new Set() } = {}) {
  const errors = [];
  if (!Array.isArray(entries)) return { valid: false, errors: ['Problems must be an array'] };
  duplicateIds(entries, 'Problems', errors);
  entries.forEach((problem, index) => {
    const label = `Problem[${index}]`;
    if (!isRecord(problem)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (!problemTypes.has(problem.type)) {
      errors.push(`${label}.type is unknown: ${problem.type}`);
      return;
    }
    validateShared(problem, label, errors, knownRequirementIds);
    if (problem.type === 'mark-parts') validateMarkParts(problem, label, errors);
    if (problem.type === 'modifier-connection-viewer') validateModifierConnection(problem, label, errors);
  });
  return { valid: errors.length === 0, errors };
}

export function validateDemoRegistry(registry, problemRegistry) {
  const errors = [];
  if (!isRecord(registry)) return { valid: false, errors: ['Demo registry must be an object'] };
  Object.entries(registry).forEach(([type, entry]) => {
    if (!isRecord(entry) || typeof entry.mount !== 'function' || !hasText(entry.demoProblemId)) {
      errors.push(`Demo registry entry ${type} needs mount and demoProblemId`);
      return;
    }
    const problem = problemRegistry[entry.demoProblemId];
    if (!problem) errors.push(`Demo registry entry ${type} references missing problem: ${entry.demoProblemId}`);
    else if (problem.type !== type) errors.push(`Demo registry entry ${type} has mismatched problem type: ${problem.type}`);
  });
  return { valid: errors.length === 0, errors };
}
