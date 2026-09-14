import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { learningRequirementIdSet, learningRequirementIds } from '../src/data/learning-requirements.js';
import { lessons } from '../src/data/lessons.js';
import { getProblemsByType, problemRegistry, problems } from '../src/data/problems/index.js';
import { getLessonContent, lessonContents } from '../src/data/content/index.js';
import { demoRegistry, getDemoProblem } from '../src/components/demos/registry.js';
import { renderExplanationContent } from '../src/components/explanation/explanationRenderer.js';
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
import { validateLessonContents } from '../src/lib/validateLessonContent.js';
import { getLessonProgress, markLessonStepComplete } from '../src/lib/lesson-progress.js';
import { evaluateExamChoice, getExamChoice, isCorrectExamChoice } from '../src/lib/grammar/exam-multiple-choice.js';
import { validateFrozenLessonContent } from '../scripts/frozen-content.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const explanationSectionLessons = new Map(lessonContents.flatMap((content) => content.sections.map((section) => [section.id, content.lessonId])));
const problemValidationOptions = {
  knownRequirementIds: learningRequirementIdSet,
  knownLessonIds: new Set(lessons.map((lesson) => lesson.id)),
  explanationSectionLessons,
};

test('target noun selection uses an exact accepted answer', () => {
  assert.equal(checkTokenSelection(['p1-baby'], ['p1-baby']), true);
  assert.equal(checkTokenSelection(['p1-smiling'], ['p1-baby']), false);
  assert.equal(checkTokenSelection(['p1-baby', 'p1-the'], ['p1-baby']), false);
});

test('Lesson 1 checks adjective, participle, and grammatical role without word order', () => {
  const comparison = problemRegistry['PART-L1-P004-COMPARE'];
  assert.equal(comparison.differences[0].explanation.includes('どちらも child を説明'), true);
  const classifier = problemRegistry['PART-L1-P002-CLASS'];
  const assignments = Object.fromEntries(classifier.items.map((item) => [item.id, item.answer]));
  assert.equal(checkClassification(assignments, classifier.items), true);
  assert.equal(checkClassification({ ...assignments, 'l1-smiling': 'noun' }, classifier.items), false);
  assert.equal(lessons[0].steps.some((step) => step.interactionType === 'word-order'), false);
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
  assert.equal(difference.id, 'one-word-position');
  assert.equal(difference.meaningLeft, '踊っている女の子。');
  assert.equal(difference.meaningRight, '踊っている女の子。');
  assert.equal(difference.meaningRight.includes('その女の子は踊っている'), false);
  assert.deepEqual(getChunkIdsForDifference(comparison.differences, difference.id), ['l3c-a-modifier', 'l3c-b-modifier']);
  assert.equal(hasExploredAllDifferences(comparison.differences, new Set()), false);
  assert.equal(hasExploredAllDifferences(comparison.differences, new Set(['one-word-position'])), true);
});

test('Lesson 2 and Lesson 3 pure logic use their declared answers', () => {
  const classifier = problemRegistry['PART-L2-P002-CLASS'];
  assert.equal(checkClassification(Object.fromEntries(classifier.items.map((item) => [item.id, item.answer])), classifier.items), true);
  assert.equal(classifier.items.find((item) => item.id === 'l2-fallen-leaves').answer, 'completion');

  const errorProblem = problemRegistry['PART-L2-P003-ERROR'];
  const correction = getCorrectionByTokenId(errorProblem.corrections, 'l2e-speak');
  assert.equal(correction.id, 'l2e-voice');
  assert.equal(isAcceptedCorrection(correction, 'l2e-opt-spoken'), true);
  assert.equal(isAcceptedCorrection(correction, 'l2e-opt-speaking'), false);
  assert.equal(hasCompletedAllCorrections(errorProblem.corrections, new Map([['l2e-voice', 'l2e-opt-spoken']])), true);

  const positionProblem = problemRegistry['PART-L3-P001-POSITION'];
  assert.equal(isGoalMatchingPlacement(positionProblem, 'l3p1-before-noun'), true);
  assert.equal(buildModifierPlacementSentence(positionProblem, 'l3p1-before-noun'), 'The glowing lamp lit the desk.');
  assert.equal(getPlacementRelation(positionProblem, 'l3p1-before-noun').targetId, 'l3p1-lamp');
});

test('Phase 7 data has frozen content traceability, full LR coverage, and target counts', () => {
  const result = validateProblems(problems, problemValidationOptions);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(problems.length, 50);
  assert.deepEqual(lessons.map((lesson) => lesson.id), ['PART-L1', 'PART-L2', 'PART-L3', 'PART-L4', 'PART-L5', 'PART-L6']);
  assert.ok(problems.every((problem) => problem.contentRefs.length > 0 && problem.sourceEvidence.source === 'chapter14-ocr.md'));
  assert.ok(problems.filter((problem) => problem.type === 'exam-multiple-choice' || problem.assessmentKind === 'entrance').every((problem) => problem.contentRefs.every((ref) => explanationSectionLessons.get(ref) === problem.lessonId)));
  assert.deepEqual(lessons.map((lesson) => lesson.steps.length), [3, 4, 3, 6, 4, 4]);
  assert.equal(lessons.reduce((total, lesson) => total + lesson.steps.length, 0), 24);
  assert.deepEqual(lessons.at(-1).steps.map((step) => step.problemId), [
    'PART-L6-IC-001-MARK', 'PART-L6-IC-002-REL', 'PART-L6-IC-003-FORM', 'PART-L6-IC-004-POSITION',
  ]);
  assert.ok(lessons.at(-1).steps.every((step) => problemRegistry[step.problemId].requirements.includes('LR-PART-013')));
  assert.equal(getProblemsByType('exam-multiple-choice').length, 20);
  assert.deepEqual(
    Object.fromEntries(lessons.map((lesson) => [lesson.id, getProblemsByType('exam-multiple-choice').filter((problem) => problem.lessonId === lesson.id).length])),
    { 'PART-L1': 2, 'PART-L2': 3, 'PART-L3': 2, 'PART-L4': 4, 'PART-L5': 4, 'PART-L6': 5 },
  );
  assert.deepEqual(
    Object.fromEntries(lessons.map((lesson) => [lesson.id, getProblemsByType('word-order').filter((problem) => problem.lessonId === lesson.id).length])),
    { 'PART-L1': 0, 'PART-L2': 0, 'PART-L3': 2, 'PART-L4': 2, 'PART-L5': 0, 'PART-L6': 2 },
  );
  const referencedRequirementIds = new Set(problems.flatMap((problem) => problem.requirements));
  assert.deepEqual(learningRequirementIds.filter((id) => !referencedRequirementIds.has(id)), []);
});

test('lesson explanation content is complete and renderer escapes every content field', () => {
  const result = validateLessonContents(lessonContents, { lessons });
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(lessonContents.length, 6);
  for (const content of lessonContents) {
    const textLength = [content.introduction, ...content.sections.flatMap((section) => section.paragraphs)].join('').length;
    assert.ok(textLength >= 800 && textLength <= 1500, `${content.lessonId}: ${textLength}`);
    assert.ok(content.sections.reduce((count, section) => count + section.examples.length, 0) >= 4);
    assert.equal(getLessonContent(content.lessonId), content);
  }
  const html = renderExplanationContent({
    ...lessonContents[0],
    introduction: '<script>alert(1)</script>',
    sections: [{ ...lessonContents[0].sections[0], title: '<b>unsafe</b>', paragraphs: ['<img src=x onerror=alert(1)>'] }],
  }, { includeClosingSections: false });
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('重要ルール'));
  assert.ok(html.includes('よくある間違い'));
  assert.ok(html.includes('入試POINT'));
  assert.equal(html.includes('Lesson Summary'), false);
});

test('contentRefs validation rejects empty, duplicate, unknown, and cross-lesson references', () => {
  const original = problemRegistry['PART-L4-P001-REL'];
  const cases = [
    ['empty', [], 'contentRefs must contain'],
    ['duplicate', ['PART-L4-EXPLAIN-01', 'PART-L4-EXPLAIN-01'], 'duplicate contentRef'],
    ['unknown', ['PART-L4-EXPLAIN-999'], 'unknown explanation section'],
    ['cross-lesson', ['PART-L2-EXPLAIN-01'], 'cross-lesson explanation section'],
  ];
  for (const [name, contentRefs, expected] of cases) {
    const result = validateProblems([{ ...structuredClone(original), contentRefs }], problemValidationOptions);
    assert.equal(result.valid, false, name);
    assert.ok(result.errors.some((error) => error.includes(expected)), `${name}: ${result.errors.join('\n')}`);
  }
  const positive = validateProblems([original], problemValidationOptions);
  assert.equal(positive.valid, true, positive.errors.join('\n'));
});

test('frozen explanation hash check rejects a mutation without touching the source file', () => {
  const manifest = JSON.parse(readFileSync(join(repoRoot, 'scripts/frozen-lesson-content.json'), 'utf8'));
  assert.deepEqual(validateFrozenLessonContent(repoRoot, manifest), []);
  const mutated = structuredClone(manifest);
  mutated.files['src/data/content/lesson-1.js'] = '0'.repeat(64);
  const errors = validateFrozenLessonContent(repoRoot, mutated);
  assert.ok(errors.some((error) => error.includes('src/data/content/lesson-1.js')));
});

test('exam multiple choice keeps the registry contract and tests Lesson 1 role only', () => {
  const exam = getDemoProblem('exam-multiple-choice', 'PART-L1-EXAM-001');
  assert.equal(demoRegistry['exam-multiple-choice'].demoProblemId, 'PART-L1-EXAM-001');
  assert.equal(getExamChoice(exam.choices, 'l1e1-c2').text, 'smiling');
  assert.equal(getExamChoice(exam.choices, 'missing'), null);
  assert.equal(isCorrectExamChoice(exam, 'l1e1-c2'), true);
  assert.equal(isCorrectExamChoice(exam, 'l1e1-c1'), false);
  assert.deepEqual(evaluateExamChoice(exam, 'l1e1-c1'), { correct: false, selectedChoiceId: 'l1e1-c1', answerChoiceId: 'l1e1-c2' });
});

test('entrance word order has only the six syntax-construction problems', () => {
  const entrance = getProblemsByType('word-order');
  assert.equal(entrance.length, 6);
  assert.deepEqual(entrance.map((problem) => problem.id), [
    'PART-L3-EXAM-WORD-001', 'PART-L3-EXAM-WORD-002', 'PART-L4-EXAM-WORD-001', 'PART-L4-EXAM-WORD-002', 'PART-L6-EXAM-WORD-001', 'PART-L6-EXAM-WORD-002',
  ]);
  const problem = problemRegistry['PART-L4-EXAM-WORD-002'];
  assert.equal(checkWordOrder(problem.acceptedAnswers[0], problem.acceptedAnswers), true);
  assert.equal(checkWordOrder([...problem.acceptedAnswers[0]].reverse(), problem.acceptedAnswers), false);
  assert.equal(problem.explanationSteps.at(-1).text, 'passive → written');
  assert.equal(problem.fixedPrefix, 'The museum displayed');
});

test('Lesson 6 integrated problems share one sentence and one target noun', () => {
  const sentence = 'The report prepared for new staff explains the safety rules.';
  const mark = problemRegistry['PART-L6-IC-001-MARK'];
  const relation = problemRegistry['PART-L6-IC-002-REL'];
  const error = problemRegistry['PART-L6-IC-003-FORM'];
  const position = problemRegistry['PART-L6-IC-004-POSITION'];
  assert.equal(mark.tokens.map((token) => token.text).join(' '), sentence);
  assert.equal(relation.sentence, sentence);
  assert.equal(error.tokens.map((token) => token.text).join(' ').replace('preparing', 'prepared'), sentence);
  assert.equal(buildModifierPlacementSentence(position, 'l6ic-pos-after-report'), sentence);
  assert.equal(checkTokenSelection(mark.answer, ['l6ic-report']), true);
  assert.equal(getRelationsForChunk(relation.relations, 'l6ic-rel-report')[0].id, 'l6ic-rel-1');
  const correction = getCorrectionByTokenId(error.corrections, 'l6ic-form-preparing');
  assert.equal(isAcceptedCorrection(correction, 'l6ic-opt-prepared'), true);
  assert.equal(isGoalMatchingPlacement(position, 'l6ic-pos-after-report'), true);
  assert.equal(getPlacementRelation(position, 'l6ic-pos-after-report').targetId, 'l6ic-pos-report');
});

test('context grammar logic resolves the Lesson 5 scenario', () => {
  const problem = problemRegistry['PART-L5-P004-CONTEXT'];
  const first = getScenarioStep(problem.steps, 0);
  assert.equal(first.id, 'l5-context-step-1');
  assert.equal(getScenarioStep(problem.steps, first.id), first);
  assert.equal(getScenarioStep(problem.steps, 'missing-step'), null);
  const acceptedChoiceId = first.acceptedChoiceIds[0];
  assert.equal(getScenarioChoice(first, acceptedChoiceId).id, acceptedChoiceId);
  assert.equal(isAcceptedScenarioChoice(first, acceptedChoiceId), true);
  assert.equal(isAcceptedScenarioChoice(first, 'missing-choice'), false);
  assert.equal(hasCompletedScenario(problem.steps, new Set()), false);
  assert.equal(hasCompletedScenario(problem.steps, new Set(problem.steps.map((step) => step.id))), true);
});

test('problem validator rejects duplicates, unknown types, unknown LR IDs, and broken references', () => {
  const duplicate = structuredClone(problems[0]);
  duplicate.requirements = ['LR-PART-999'];
  const invalid = validateProblems([problems[0], duplicate], problemValidationOptions);
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.some((error) => error.includes('duplicate id')));
  assert.ok(invalid.errors.some((error) => error.includes('unknown LR ID')));
  const missingField = structuredClone(problemRegistry['PART-L1-P002-CLASS']);
  delete missingField.categories;
  const missingResult = validateProblems([missingField], problemValidationOptions);
  assert.ok(missingResult.errors.some((error) => error.includes('categories')));
  const unknown = structuredClone(problemRegistry['PART-L1-P002-CLASS']);
  unknown.type = 'unknown-interaction';
  const unknownResult = validateProblems([unknown], problemValidationOptions);
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
    const result = validateProblems([problem], problemValidationOptions);
    assert.equal(result.valid, false, name);
    assert.ok(result.errors.some((error) => error.includes(expectedMessage)), `${name}: ${result.errors.join('\n')}`);
  }
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
