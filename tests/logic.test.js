import assert from 'node:assert/strict';
import test from 'node:test';
import { learningRequirementIdSet } from '../src/data/learning-requirements.js';
import { lessons } from '../src/data/lessons.js';
import { problemRegistry, problems } from '../src/data/problems/index.js';
import { getRelationsForChunk, hasExploredAllRelations } from '../src/lib/grammar/modifier-relations.js';
import { checkTokenSelection } from '../src/lib/grammar/parts.js';
import { validateLessons } from '../src/lib/validateLessons.js';
import { validateProblems } from '../src/lib/validateProblems.js';
import { getLessonProgress, markLessonStepComplete } from '../src/lib/lesson-progress.js';

test('target noun selection uses an exact accepted answer', () => {
  assert.equal(checkTokenSelection(['p1-baby'], ['p1-baby']), true);
  assert.equal(checkTokenSelection(['p1-smiling'], ['p1-baby']), false);
  assert.equal(checkTokenSelection(['p1-baby', 'p1-the'], ['p1-baby']), false);
});

test('modifier relation lookup and completion use relation IDs', () => {
  const problem = problemRegistry['PART-L4-P001-REL'];
  const relations = getRelationsForChunk(problem.relations, 'p1-rel-baby');
  assert.equal(relations.length, 1);
  assert.equal(relations[0].modifierId, 'p1-rel-smiling');
  assert.equal(hasExploredAllRelations(problem.relations, new Set()), false);
  assert.equal(hasExploredAllRelations(problem.relations, new Set(['p1-rel-1'])), true);
});

test('valid Phase 1 data has source and learning requirement traceability', () => {
  const result = validateProblems(problems, { knownRequirementIds: learningRequirementIdSet });
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(problems.length, 8);
  assert.ok(problems.some((problem) => problem.semanticVoice === 'active'));
  assert.ok(problems.some((problem) => problem.semanticVoice === 'passive'));
});

test('problem validator rejects duplicate IDs, unknown LR IDs, and missing relation targets', () => {
  const duplicate = structuredClone(problems[0]);
  duplicate.requirements = ['LR-PART-999'];
  const invalid = validateProblems([problems[0], duplicate], { knownRequirementIds: learningRequirementIdSet });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.some((error) => error.includes('duplicate id')));
  assert.ok(invalid.errors.some((error) => error.includes('unknown LR ID')));

  const missingTarget = structuredClone(problemRegistry['PART-L4-P001-REL']);
  missingTarget.relations[0].targetId = 'missing-target';
  const relationInvalid = validateProblems([missingTarget], { knownRequirementIds: learningRequirementIdSet });
  assert.equal(relationInvalid.valid, false);
  assert.ok(relationInvalid.errors.some((error) => error.includes('unknown targetId')));
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
