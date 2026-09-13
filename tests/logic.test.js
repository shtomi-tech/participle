import assert from 'node:assert/strict';
import test from 'node:test';
import { learningRequirementIdSet } from '../src/data/learning-requirements.js';
import { lessons } from '../src/data/lessons.js';
import { problemRegistry, problems } from '../src/data/problems/index.js';
import { checkClassification } from '../src/lib/grammar/classification.js';
import { getCorrectionByTokenId, hasCompletedAllCorrections, isAcceptedCorrection } from '../src/lib/grammar/error-correction.js';
import { getRelationsForChunk, hasExploredAllRelations } from '../src/lib/grammar/modifier-relations.js';
import { checkTokenSelection } from '../src/lib/grammar/parts.js';
import { buildModifierPlacementSentence, getPlacementRelation, isGoalMatchingPlacement } from '../src/lib/grammar/modifier-placement.js';
import { getChunkIdsForDifference, getDifferenceByChunkId, hasExploredAllDifferences } from '../src/lib/grammar/sentence-comparison.js';
import { checkWordOrder } from '../src/lib/grammar/word-order.js';
import { getScenarioChoice, getScenarioStep, hasCompletedScenario, isAcceptedScenarioChoice } from '../src/lib/grammar/context-grammar.js';
import { validateLessons } from '../src/lib/validateLessons.js';
import { validateProblems } from '../src/lib/validateProblems.js';
import { getLessonProgress, markLessonStepComplete } from '../src/lib/lesson-progress.js';

test('target noun selection uses an exact accepted answer', () => {
  assert.equal(checkTokenSelection(['p1-baby'], ['p1-baby']), true);
  assert.equal(checkTokenSelection(['p1-smiling'], ['p1-baby']), false);
  assert.equal(checkTokenSelection(['p1-baby', 'p1-the'], ['p1-baby']), false);
});

test('grammar classification and word order accept only their declared answers', () => {
  const classifier = problemRegistry['PART-L1-P002-CLASS'];
  const assignments = Object.fromEntries(classifier.items.map((item) => [item.id, item.answer]));
  assert.equal(checkClassification(assignments, classifier.items), true);
  assert.equal(checkClassification({ ...assignments, 'l1-smiling': 'noun' }, classifier.items), false);
  const wordOrder = problemRegistry['PART-L1-P003-WORD'];
  assert.equal(checkWordOrder(['l1-a', 'l1-smiling', 'l1-baby'], wordOrder.acceptedAnswers), true);
  assert.equal(checkWordOrder(['l1-smiling', 'l1-a', 'l1-baby'], wordOrder.acceptedAnswers), false);
});

test('modifier relation and sentence comparison completion use stable IDs', () => {
  const relationProblem = problemRegistry['PART-L4-P001-REL'];
  const relations = getRelationsForChunk(relationProblem.relations, 'p1-rel-baby');
  assert.equal(relations.length, 1);
  assert.equal(relations[0].modifierId, 'p1-rel-smiling');
  assert.equal(hasExploredAllRelations(relationProblem.relations, new Set()), false);
  assert.equal(hasExploredAllRelations(relationProblem.relations, new Set(['p1-rel-1'])), true);

  const comparison = problemRegistry['PART-L3-P004-COMPARE'];
  const difference = getDifferenceByChunkId(comparison.differences, 'l3c-a-modifier');
  assert.equal(difference.id, 'position-length');
  assert.deepEqual(getChunkIdsForDifference(comparison.differences, difference.id), ['l3c-a-modifier', 'l3c-b-modifier']);
  assert.equal(hasExploredAllDifferences(comparison.differences, new Set()), false);
  assert.equal(hasExploredAllDifferences(comparison.differences, new Set(['position-length'])), true);
});

test('error correction and modifier placement use declared answers', () => {
  const errorProblem = problemRegistry['PART-L2-P003-ERROR'];
  const correction = getCorrectionByTokenId(errorProblem.corrections, 'l2e-speak');
  assert.equal(correction.id, 'l2e-voice');
  assert.equal(isAcceptedCorrection(correction, 'l2e-opt-spoken'), true);
  assert.equal(isAcceptedCorrection(correction, 'l2e-opt-speaking'), false);
  assert.equal(hasCompletedAllCorrections(errorProblem.corrections, new Map([['l2e-voice', 'l2e-opt-spoken']])), true);

  const positionProblem = problemRegistry['PART-L3-P001-POSITION'];
  assert.equal(isGoalMatchingPlacement(positionProblem, 'l3p1-before-noun'), true);
  assert.equal(isGoalMatchingPlacement(positionProblem, 'l3p1-sentence-end'), false);
  assert.equal(buildModifierPlacementSentence(positionProblem, 'l3p1-before-noun'), 'The glowing lamp lit the desk.');
  assert.equal(getPlacementRelation(positionProblem, 'l3p1-before-noun').targetId, 'l3p1-lamp');
});

test('all Phase 3 data has source traceability and valid problem contracts', () => {
  const result = validateProblems(problems, { knownRequirementIds: learningRequirementIdSet });
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(problems.length, 24);
  assert.deepEqual(lessons.map((lesson) => lesson.id), ['PART-L1', 'PART-L2', 'PART-L3', 'PART-L4', 'PART-L5']);
  assert.ok(problems.every((problem) => problem.lessonId && problem.requirements.length > 0 && problem.sourceEvidence.source === 'chapter14-ocr.md'));
  assert.ok(problems.some((problem) => problem.semanticVoice === 'active'));
  assert.ok(problems.some((problem) => problem.semanticVoice === 'passive'));
  assert.equal(lessons.at(-1).steps.length, 4);
  assert.deepEqual(lessons.at(-1).steps.map((step) => step.problemId), [
    'PART-L5-P001-CLASS',
    'PART-L5-P002-COMPARE',
    'PART-L5-P003-ERROR',
    'PART-L5-P004-CONTEXT',
  ]);
  assert.deepEqual(
    problemRegistry['PART-L5-P002-COMPARE'].comparisonAxes,
    ['base verb', 'role', 'direction', 'form', 'meaning'],
  );
  assert.ok(['PART-L1-P001-MARK', 'PART-L4-P001-MARK', 'PART-L4-P004-REL'].every((id) => problemRegistry[id]));
});

test('context grammar logic resolves steps, choices, acceptance, and completion', () => {
  const problem = problemRegistry['PART-L5-P004-CONTEXT'];
  const first = getScenarioStep(problem.steps, 0);
  assert.equal(first.id, 'l5-context-step-1');
  assert.equal(getScenarioStep(problem.steps, first.id), first);
  assert.equal(getScenarioStep(problem.steps, 'missing-step'), null);
  const acceptedChoiceId = first.acceptedChoiceIds[0];
  assert.equal(getScenarioChoice(first, acceptedChoiceId).id, acceptedChoiceId);
  assert.equal(getScenarioChoice(first, 'missing-choice'), null);
  assert.equal(isAcceptedScenarioChoice(first, acceptedChoiceId), true);
  assert.equal(isAcceptedScenarioChoice(first, 'missing-choice'), false);
  assert.equal(hasCompletedScenario(problem.steps, new Set()), false);
  assert.equal(hasCompletedScenario(problem.steps, new Set(problem.steps.map((step) => step.id))), true);
  assert.equal(hasCompletedScenario(problem.steps, problem.steps.map((step) => step.id)), true);
});

test('problem validator rejects duplicates, unknown types, unknown LR IDs, and broken references', () => {
  const duplicate = structuredClone(problems[0]);
  duplicate.requirements = ['LR-PART-999'];
  const invalid = validateProblems([problems[0], duplicate], { knownRequirementIds: learningRequirementIdSet });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.some((error) => error.includes('duplicate id')));
  assert.ok(invalid.errors.some((error) => error.includes('unknown LR ID')));
  const missingField = structuredClone(problemRegistry['PART-L1-P002-CLASS']);
  delete missingField.categories;
  const missingResult = validateProblems([missingField], { knownRequirementIds: learningRequirementIdSet });
  assert.ok(missingResult.errors.some((error) => error.includes('categories')));
  const unknown = structuredClone(problemRegistry['PART-L1-P003-WORD']);
  unknown.type = 'unknown-interaction';
  const unknownResult = validateProblems([unknown], { knownRequirementIds: learningRequirementIdSet });
  assert.ok(unknownResult.errors.some((error) => error.includes('unknown')));
});

test('context grammar validator rejects broken scenario contracts', () => {
  const original = problemRegistry['PART-L5-P004-CONTEXT'];
  const invalidCases = [
    ['duplicate step ID', (problem) => problem.steps.push(structuredClone(problem.steps[0])), 'duplicate id'],
    ['duplicate choice ID', (problem) => { problem.steps[1].choices[0].id = problem.steps[0].choices[0].id; }, 'duplicate IDs'],
    ['unknown accepted choice', (problem) => { problem.steps[0].acceptedChoiceIds = ['missing-choice']; }, 'unknown accepted choice'],
    ['empty accepted choices', (problem) => { problem.steps[0].acceptedChoiceIds = []; }, 'acceptedChoiceIds'],
    ['step without choices', (problem) => { problem.steps[0].choices = []; }, 'choices'],
    ['missing scenario', (problem) => { delete problem.scenario; }, 'scenario'],
    ['missing explanation', (problem) => { delete problem.explanation; }, 'explanation'],
    ['unknown LR ID', (problem) => { problem.requirements = ['LR-PART-999']; }, 'unknown LR ID'],
  ];

  for (const [name, mutate, expectedMessage] of invalidCases) {
    const problem = structuredClone(original);
    mutate(problem);
    const result = validateProblems([problem], { knownRequirementIds: learningRequirementIdSet });
    assert.equal(result.valid, false, name);
    assert.ok(result.errors.some((error) => error.includes(expectedMessage)), `${name}: ${result.errors.join('\n')}`);
  }

  const mismatchedLesson = structuredClone(lessons.at(-1));
  mismatchedLesson.id = 'PART-LX';
  const lessonResult = validateLessons([mismatchedLesson], { problemRegistry, problemTypes: new Set(['context-grammar']) });
  assert.equal(lessonResult.valid, false);
  assert.ok(lessonResult.errors.some((error) => error.includes('belongs to PART-L5')));
});

test('lesson validator rejects unknown interaction types and missing problems', () => {
  const invalidLesson = structuredClone(lessons[0]);
  invalidLesson.steps[0].interactionType = 'unknown-interaction';
  invalidLesson.steps[0].problemId = 'missing-problem';
  const result = validateLessons([invalidLesson], { problemRegistry, problemTypes: new Set(['mark-parts', 'modifier-connection-viewer']) });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes('unknown')));
  assert.ok(result.errors.some((error) => error.includes('missing-problem')));
});

test('lesson progress unlocks the next step only after completion', () => {
  const first = lessons[0].steps[0].id;
  const empty = getLessonProgress(lessons[0], new Set());
  assert.equal(empty.completedCount, 0);
  const after = getLessonProgress(lessons[0], markLessonStepComplete(new Set(), first));
  assert.equal(after.completedCount, 1);
  assert.equal(after.allComplete, false);
});
