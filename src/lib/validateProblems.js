const problemTypes = new Set([
  'mark-parts',
  'modifier-connection-viewer',
  'grammar-classifier',
  'word-order',
  'sentence-comparison',
  'error-corrector',
  'modifier-positioner',
  'context-grammar',
]);
const metadataTypes = new Set(['mark-parts', 'modifier-connection-viewer']);
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
  for (const field of ['id', 'type', 'lessonId', 'prompt', 'explanation']) {
    if (!hasText(problem[field])) errors.push(`${label}.${field} is required`);
  }
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
  if (!metadataTypes.has(problem.type)) return;
  for (const field of ['targetNoun', 'baseVerb']) {
    if (!hasText(problem[field])) errors.push(`${label}.${field} is required`);
  }
  if (!voices.has(problem.semanticVoice)) errors.push(`${label}.semanticVoice is invalid: ${problem.semanticVoice}`);
  if (!forms.has(problem.participleForm)) errors.push(`${label}.participleForm is invalid: ${problem.participleForm}`);
}

function validateMarkParts(problem, label, errors) {
  if (!Array.isArray(problem.tokens) || problem.tokens.length === 0) {
    errors.push(`${label}.tokens must contain at least one token`);
    return;
  }
  duplicateIds(problem.tokens, `${label}.tokens`, errors);
  const tokenIds = new Set(problem.tokens.map((token) => token?.id));
  problem.tokens.forEach((token, index) => {
    if (!hasText(token?.id) || !hasText(token?.text) || !hasText(token?.role)) errors.push(`${label}.tokens[${index}] needs id, text, and role`);
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
    const chunkIds = new Set(problem.chunks.map((chunk) => chunk?.id));
    problem.chunks.forEach((chunk, index) => {
      if (!hasText(chunk?.id) || !hasText(chunk?.text) || !['core', 'modifier'].includes(chunk?.kind)) errors.push(`${label}.chunks[${index}] needs id, text, and kind`);
    });
    if (!Array.isArray(problem.relations) || problem.relations.length === 0) {
      errors.push(`${label}.relations must contain at least one relation`);
    } else {
      duplicateIds(problem.relations, `${label}.relations`, errors);
      problem.relations.forEach((relation, index) => {
        if (!hasText(relation?.id) || !hasText(relation?.label) || !hasText(relation?.explanation)) errors.push(`${label}.relations[${index}] needs id, label, and explanation`);
        if (!chunkIds.has(relation?.modifierId)) errors.push(`${label}.relations[${index}] has unknown modifierId`);
        if (!chunkIds.has(relation?.targetId)) errors.push(`${label}.relations[${index}] has unknown targetId`);
        if (relation?.modifierId === relation?.targetId) errors.push(`${label}.relations[${index}] endpoints must differ`);
        if (relation?.relationType !== 'modifies') errors.push(`${label}.relations[${index}].relationType is invalid`);
      });
    }
  }
}

function validateGrammarClassifier(problem, label, errors) {
  if (!hasText(problem.sentence) || !hasText(problem.classificationAxis)) errors.push(`${label}.sentence and classificationAxis are required`);
  if (!Array.isArray(problem.categories) || problem.categories.length < 2) {
    errors.push(`${label}.categories must contain at least two categories`);
  } else {
    duplicateIds(problem.categories, `${label}.categories`, errors);
    problem.categories.forEach((category, index) => {
      if (!hasText(category?.id) || !hasText(category?.label) || !hasText(category?.explanation)) errors.push(`${label}.categories[${index}] needs id, label, and explanation`);
    });
  }
  if (!Array.isArray(problem.items) || problem.items.length === 0) {
    errors.push(`${label}.items must contain at least one item`);
  } else {
    duplicateIds(problem.items, `${label}.items`, errors);
    const categoryIds = new Set((problem.categories ?? []).map((category) => category?.id));
    problem.items.forEach((item, index) => {
      if (!hasText(item?.id) || !hasText(item?.text) || !hasText(item?.answer) || !hasText(item?.explanation)) errors.push(`${label}.items[${index}] needs id, text, answer, and explanation`);
      else if (!categoryIds.has(item.answer)) errors.push(`${label}.items[${index}].answer references an unknown category: ${item.answer}`);
    });
  }
}

function validateWordOrder(problem, label, errors) {
  if (!Array.isArray(problem.words) || problem.words.length < 2) {
    errors.push(`${label}.words must contain at least two words`);
  } else {
    duplicateIds(problem.words, `${label}.words`, errors);
    problem.words.forEach((word, index) => {
      if (!hasText(word?.id) || !hasText(word?.text)) errors.push(`${label}.words[${index}] needs id and text`);
    });
  }
  if (!Array.isArray(problem.acceptedAnswers) || problem.acceptedAnswers.length === 0) {
    errors.push(`${label}.acceptedAnswers must contain at least one answer`);
    return;
  }
  const wordIds = new Set((problem.words ?? []).map((word) => word?.id));
  const signatures = new Set();
  problem.acceptedAnswers.forEach((answer, index) => {
    if (!Array.isArray(answer) || answer.length === 0) {
      errors.push(`${label}.acceptedAnswers[${index}] must contain word IDs`);
      return;
    }
    const signature = answer.join('\u0000');
    if (signatures.has(signature)) errors.push(`${label}.acceptedAnswers contains a duplicate answer`);
    signatures.add(signature);
    if (answer.length !== wordIds.size || new Set(answer).size !== answer.length) errors.push(`${label}.acceptedAnswers[${index}] must use every word ID exactly once`);
    answer.forEach((id) => {
      if (!wordIds.has(id)) errors.push(`${label}.acceptedAnswers[${index}] references an unknown word ID: ${id}`);
    });
  });
  if (problem.hints !== undefined && (!Array.isArray(problem.hints) || problem.hints.length === 0 || problem.hints.some((hint) => !hasText(hint)))) errors.push(`${label}.hints must contain non-empty strings when provided`);
}

function validateSentenceComparison(problem, label, errors) {
  if (!Array.isArray(problem.sentences) || problem.sentences.length < 2) {
    errors.push(`${label}.sentences must contain at least two sentences`);
  } else {
    duplicateIds(problem.sentences, `${label}.sentences`, errors);
    const chunkIds = new Set();
    problem.sentences.forEach((sentence, sentenceIndex) => {
      if (!hasText(sentence?.id) || !hasText(sentence?.text) || !Array.isArray(sentence?.chunks) || sentence.chunks.length === 0) {
        errors.push(`${label}.sentences[${sentenceIndex}] needs id, text, and chunks`);
        return;
      }
      duplicateIds(sentence.chunks, `${label}.sentences[${sentenceIndex}].chunks`, errors);
      sentence.chunks.forEach((chunk, chunkIndex) => {
        if (!hasText(chunk?.id) || !hasText(chunk?.text)) errors.push(`${label}.sentences[${sentenceIndex}].chunks[${chunkIndex}] needs id and text`);
        if (chunkIds.has(chunk?.id)) errors.push(`${label}.sentences has duplicate chunk id: ${chunk.id}`);
        chunkIds.add(chunk?.id);
      });
    });
    if (!Array.isArray(problem.differences) || problem.differences.length === 0) {
      errors.push(`${label}.differences must contain at least one difference`);
    } else {
      duplicateIds(problem.differences, `${label}.differences`, errors);
      problem.differences.forEach((difference, index) => {
        for (const field of ['id', 'leftChunkId', 'rightChunkId', 'label', 'explanation', 'meaningLeft', 'meaningRight']) {
          if (!hasText(difference?.[field])) errors.push(`${label}.differences[${index}].${field} is required`);
        }
        if (!chunkIds.has(difference?.leftChunkId)) errors.push(`${label}.differences[${index}] has unknown leftChunkId`);
        if (!chunkIds.has(difference?.rightChunkId)) errors.push(`${label}.differences[${index}] has unknown rightChunkId`);
        if (difference?.leftChunkId === difference?.rightChunkId) errors.push(`${label}.differences[${index}] endpoints must differ`);
      });
    }
  }
}

function validateErrorCorrector(problem, label, errors) {
  if (!Array.isArray(problem.tokens) || problem.tokens.length === 0) {
    errors.push(`${label}.tokens must contain at least one token`);
    return;
  }
  duplicateIds(problem.tokens, `${label}.tokens`, errors);
  const tokenIds = new Set(problem.tokens.map((token) => token?.id));
  problem.tokens.forEach((token, index) => {
    if (!hasText(token?.id) || !hasText(token?.text)) errors.push(`${label}.tokens[${index}] needs id and text`);
  });
  if (!Array.isArray(problem.corrections) || problem.corrections.length === 0) {
    errors.push(`${label}.corrections must contain at least one correction`);
    return;
  }
  duplicateIds(problem.corrections, `${label}.corrections`, errors);
  const optionIds = new Set();
  problem.corrections.forEach((correction, index) => {
    if (!hasText(correction?.id) || !tokenIds.has(correction?.tokenId) || !hasText(correction?.ruleLabel) || !hasText(correction?.explanation)) errors.push(`${label}.corrections[${index}] needs id, known tokenId, ruleLabel, and explanation`);
    if (!Array.isArray(correction?.options) || correction.options.length < 2) {
      errors.push(`${label}.corrections[${index}].options must contain at least two options`);
      return;
    }
    duplicateIds(correction.options, `${label}.corrections[${index}].options`, errors);
    const localOptionIds = new Set(correction.options.map((option) => option?.id));
    correction.options.forEach((option, optionIndex) => {
      if (!hasText(option?.id) || !hasText(option?.text)) errors.push(`${label}.corrections[${index}].options[${optionIndex}] needs id and text`);
      if (optionIds.has(option?.id)) errors.push(`${label} has duplicate option id: ${option.id}`);
      optionIds.add(option?.id);
    });
    if (!Array.isArray(correction.acceptedOptionIds) || correction.acceptedOptionIds.length === 0 || correction.acceptedOptionIds.some((id) => !localOptionIds.has(id))) errors.push(`${label}.corrections[${index}].acceptedOptionIds must reference known options`);
  });
}

function validateModifierPositioner(problem, label, errors) {
  if (!isRecord(problem.goal) || !hasText(problem.goal.description)) errors.push(`${label}.goal.description is required`);
  if (!Array.isArray(problem.chunks) || problem.chunks.length < 1) {
    errors.push(`${label}.chunks must contain at least one chunk`);
  } else {
    duplicateIds(problem.chunks, `${label}.chunks`, errors);
  }
  if (!isRecord(problem.modifier) || !hasText(problem.modifier.id) || !hasText(problem.modifier.text)) errors.push(`${label}.modifier needs id and text`);
  if (!Array.isArray(problem.placements) || problem.placements.length === 0) {
    errors.push(`${label}.placements must contain at least one placement`);
    return;
  }
  duplicateIds(problem.placements, `${label}.placements`, errors);
  const chunkIds = new Set((problem.chunks ?? []).map((chunk) => chunk?.id));
  let goalCount = 0;
  problem.placements.forEach((placement, index) => {
    if (!hasText(placement?.id) || !hasText(placement?.label) || !Number.isInteger(placement?.position) || typeof placement?.grammatical !== 'boolean' || typeof placement?.matchesGoal !== 'boolean' || !hasText(placement?.meaning)) errors.push(`${label}.placements[${index}] needs id, label, integer position, grammatical, matchesGoal, and meaning`);
    if (placement?.matchesGoal) goalCount += 1;
    const relation = placement?.relation;
    if (!isRecord(relation) || relation.modifierId !== problem.modifier?.id || !chunkIds.has(relation.targetId) || relation.relationType !== 'modifies' || !hasText(relation.label) || !hasText(relation.explanation)) errors.push(`${label}.placements[${index}].relation is invalid`);
  });
  if (goalCount === 0) errors.push(`${label}.placements needs at least one goal-matching placement`);
}

function validateContextGrammar(problem, label, errors) {
  if (!isRecord(problem.scenario)) {
    errors.push(`${label}.scenario is required`);
  } else {
    for (const field of ['title', 'setting', 'learnerRole', 'goal']) {
      if (!hasText(problem.scenario[field])) errors.push(`${label}.scenario.${field} is required`);
    }
  }
  if (!Array.isArray(problem.steps) || problem.steps.length < 2) {
    errors.push(`${label}.steps must contain at least two steps`);
    return;
  }

  duplicateIds(problem.steps, `${label}.steps`, errors);
  const choiceIds = new Set();
  problem.steps.forEach((step, stepIndex) => {
    if (!isRecord(step) || !hasText(step.id) || !hasText(step.speaker) || !hasText(step.line) || !hasText(step.instruction)) {
      errors.push(`${label}.steps[${stepIndex}] must have id, speaker, line, and instruction`);
    }
    if (!Array.isArray(step?.choices) || step.choices.length < 2) {
      errors.push(`${label}.steps[${stepIndex}].choices must contain at least two choices`);
    } else {
      duplicateIds(step.choices, `${label}.steps[${stepIndex}].choices`, errors);
      step.choices.forEach((choice, choiceIndex) => {
        if (!isRecord(choice) || !hasText(choice.id) || !hasText(choice.text) || !hasText(choice.grammarLabel) || !hasText(choice.explanation) || !hasText(choice.reply)) {
          errors.push(`${label}.steps[${stepIndex}].choices[${choiceIndex}] must have id, text, grammarLabel, explanation, and reply`);
          return;
        }
        if (choiceIds.has(choice.id)) errors.push(`${label}.choices has duplicate IDs: ${choice.id}`);
        choiceIds.add(choice.id);
      });
    }
    if (!Array.isArray(step?.acceptedChoiceIds) || step.acceptedChoiceIds.length === 0) {
      errors.push(`${label}.steps[${stepIndex}].acceptedChoiceIds must contain at least one choice ID`);
      return;
    }
    const stepChoiceIds = new Set((step.choices ?? []).map((choice) => choice?.id));
    const acceptedIds = new Set();
    step.acceptedChoiceIds.forEach((choiceId) => {
      if (!hasText(choiceId)) {
        errors.push(`${label}.steps[${stepIndex}].acceptedChoiceIds must contain choice IDs`);
        return;
      }
      if (acceptedIds.has(choiceId)) errors.push(`${label}.steps[${stepIndex}].acceptedChoiceIds has duplicate IDs: ${choiceId}`);
      acceptedIds.add(choiceId);
      if (!stepChoiceIds.has(choiceId)) errors.push(`${label}.steps[${stepIndex}] references an unknown accepted choice: ${choiceId}`);
    });
  });
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
    if (problem.type === 'grammar-classifier') validateGrammarClassifier(problem, label, errors);
    if (problem.type === 'word-order') validateWordOrder(problem, label, errors);
    if (problem.type === 'sentence-comparison') validateSentenceComparison(problem, label, errors);
    if (problem.type === 'error-corrector') validateErrorCorrector(problem, label, errors);
    if (problem.type === 'modifier-positioner') validateModifierPositioner(problem, label, errors);
    if (problem.type === 'context-grammar') validateContextGrammar(problem, label, errors);
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
