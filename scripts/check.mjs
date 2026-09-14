import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { demoRegistry } from '../src/components/demos/registry.js';
import { lessons } from '../src/data/lessons.js';
import { lessonContents } from '../src/data/content/index.js';
import { problemRegistry, problems } from '../src/data/problems/index.js';
import { learningRequirementIdSet, learningRequirementIds } from '../src/data/learning-requirements.js';
import { validateDemoRegistry, validateProblems } from '../src/lib/validateProblems.js';
import { validateLessons } from '../src/lib/validateLessons.js';
import { validateLessonContents } from '../src/lib/validateLessonContent.js';
import { validateFrozenLessonContent } from './frozen-content.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const ocrSources = new Map([
  ['chapter14-ocr.md', join(root, 'chapter14-ocr.md')],
  ['lesson21-22-ocr.md', join(root, 'lesson21-22-ocr.md')],
].map(([source, path]) => {
  const text = readFileSync(path, 'utf8');
  return [source, { text, lines: text.split(/\r?\n/) }];
}));
const sourceFiles = [
  'src/app.js',
  'src/data/content/index.js',
  'src/data/content/lesson-1.js',
  'src/data/content/lesson-2.js',
  'src/data/content/lesson-3.js',
  'src/data/content/lesson-4.js',
  'src/data/content/lesson-5.js',
  'src/data/content/lesson-6.js',
  'src/data/learning-requirements.js',
  'src/data/problems/index.js',
  'src/data/problems/mark-parts.js',
  'src/data/problems/modifier-connection-viewer.js',
  'src/data/problems/grammar-classifier.js',
  'src/data/problems/word-order.js',
  'src/data/problems/entrance-word-order.js',
  'src/data/problems/exam-multiple-choice.js',
  'src/data/problems/lesson-6-practical.js',
  'src/data/problems/sentence-comparison.js',
  'src/data/problems/error-corrector.js',
  'src/data/problems/modifier-positioner.js',
  'src/data/problems/context-grammar.js',
  'src/data/lessons.js',
  'src/lib/dom.js',
  'src/lib/lifecycle.js',
  'src/lib/lesson-progress.js',
  'src/lib/grammar/parts.js',
  'src/lib/grammar/modifier-relations.js',
  'src/lib/grammar/classification.js',
  'src/lib/grammar/word-order.js',
  'src/lib/grammar/sentence-comparison.js',
  'src/lib/grammar/error-correction.js',
  'src/lib/grammar/modifier-placement.js',
  'src/lib/grammar/context-grammar.js',
  'src/lib/grammar/exam-multiple-choice.js',
  'src/lib/validateProblems.js',
  'src/lib/validateLessonContent.js',
  'src/lib/validateLessons.js',
  'src/components/demos/markTheParts.js',
  'src/components/demos/modifierConnectionViewer.js',
  'src/components/demos/grammarClassifier.js',
  'src/components/demos/wordOrderBuilder.js',
  'src/components/demos/sentenceComparison.js',
  'src/components/demos/errorCorrector.js',
  'src/components/demos/modifierPositioner.js',
  'src/components/demos/contextGrammar.js',
  'src/components/demos/examMultipleChoice.js',
  'src/components/demos/practiceMultipleChoice.js',
  'src/components/demos/registry.js',
  'src/components/explanation/explanationRenderer.js',
  'scripts/build.mjs',
  'scripts/check.mjs',
  'scripts/frozen-content.mjs',
  'tests/logic.test.js',
];

for (const relativePath of sourceFiles) {
  const filePath = join(root, relativePath);
  if (!existsSync(filePath)) throw new Error(`Missing source file: ${relativePath}`);
  const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
}

const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const contentValidation = validateLessonContents(lessonContents, { lessons });
if (!contentValidation.valid) throw new Error(contentValidation.errors.join('\n'));
const explanationSectionLessons = new Map(lessonContents.flatMap((content) => content.sections.map((section) => [section.id, content.lessonId])));
const problemValidation = validateProblems(problems, { knownRequirementIds: learningRequirementIdSet, knownLessonIds: lessonIds, explanationSectionLessons });
if (!problemValidation.valid) throw new Error(problemValidation.errors.join('\n'));
const registryValidation = validateDemoRegistry(demoRegistry, problemRegistry);
if (!registryValidation.valid) throw new Error(registryValidation.errors.join('\n'));
const lessonValidation = validateLessons(lessons, { problemRegistry, problemTypes: new Set(Object.keys(demoRegistry)) });
if (!lessonValidation.valid) throw new Error(lessonValidation.errors.join('\n'));
const expectedLessonIds = ['PART-L1', 'PART-L2', 'PART-L3', 'PART-L4', 'PART-L5', 'PART-L6'];
if (lessons.length !== expectedLessonIds.length || lessons.some((lesson, index) => lesson.id !== expectedLessonIds[index])) {
  throw new Error(`Phase 4 requires lessons in order: ${expectedLessonIds.join(', ')}.`);
}
if (Object.keys(demoRegistry).length !== 10 || !demoRegistry['context-grammar'] || !demoRegistry['exam-multiple-choice'] || !demoRegistry['practice-multiple-choice']) throw new Error('Phase 8 requires ten demo types including Lesson 6 Practical.');

const expectedInteractiveStepCounts = { 'PART-L1': 3, 'PART-L2': 4, 'PART-L3': 3, 'PART-L4': 6, 'PART-L5': 4, 'PART-L6': 4 };
const actualInteractiveStepCounts = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson.steps.length]));
if (JSON.stringify(actualInteractiveStepCounts) !== JSON.stringify(expectedInteractiveStepCounts)) throw new Error(`Unexpected Phase 7 interactive step distribution: ${JSON.stringify(actualInteractiveStepCounts)}.`);
if (lessons.reduce((total, lesson) => total + lesson.steps.length, 0) !== 24) throw new Error('Phase 7 requires 24 Interactive Check steps.');

const examProblems = problems.filter((problem) => problem.type === 'exam-multiple-choice');
if (examProblems.length !== 20) throw new Error(`Phase 5 requires 20 exam multiple-choice problems, found ${examProblems.length}.`);
const expectedExamCounts = { 'PART-L1': 2, 'PART-L2': 3, 'PART-L3': 2, 'PART-L4': 4, 'PART-L5': 4, 'PART-L6': 5 };
for (const [lessonId, expectedCount] of Object.entries(expectedExamCounts)) {
  const count = examProblems.filter((problem) => problem.lessonId === lessonId).length;
  if (count !== expectedCount) throw new Error(`Phase 5 requires ${expectedCount} exam problems for ${lessonId}, found ${count}.`);
}
const examDifficultyCounts = Object.fromEntries(['basic', 'standard', 'entrance'].map((difficulty) => [difficulty, examProblems.filter((problem) => problem.difficulty === difficulty).length]));
if (JSON.stringify(examDifficultyCounts) !== JSON.stringify({ basic: 2, standard: 8, entrance: 10 })) throw new Error(`Unexpected exam difficulty distribution: ${JSON.stringify(examDifficultyCounts)}.`);
const practicalProblems = problems.filter((problem) => problem.type === 'practice-multiple-choice');
if (practicalProblems.length !== 13) throw new Error(`Lesson 6 Practical requires 13 problems, found ${practicalProblems.length}.`);
const practicalStageCounts = Object.fromEntries(['quick', 'form', 'structure'].map((stage) => [stage, practicalProblems.filter((problem) => problem.practiceStage === stage).length]));
if (JSON.stringify(practicalStageCounts) !== JSON.stringify({ quick: 3, form: 5, structure: 5 })) throw new Error(`Unexpected Lesson 6 Practical stage distribution: ${JSON.stringify(practicalStageCounts)}.`);
if (practicalProblems.some((problem) => !problem.sourceReconstruction || typeof problem.sourceReconstruction.reconstructed !== 'boolean')) throw new Error('Every Lesson 6 Practical problem must declare sourceReconstruction.reconstructed.');
const reconstructedProblemIds = practicalProblems.filter((problem) => problem.sourceReconstruction.reconstructed).map((problem) => problem.id);
if (JSON.stringify(reconstructedProblemIds) !== JSON.stringify(['PART-L6-PRACTICE-101', 'PART-L6-PRACTICE-104'])) throw new Error(`Unexpected reconstructed Lesson 6 Practical problems: ${JSON.stringify(reconstructedProblemIds)}.`);
if (problemRegistry['PART-L6-PRACTICE-101']?.answerChoiceId !== 'l6p101-c2' || problemRegistry['PART-L6-PRACTICE-101']?.choices.find((choice) => choice.id === 'l6p101-c2')?.text !== 'attached') throw new Error('Problem 101 must answer attached.');
if (!problemRegistry['PART-L6-PRACTICE-104']?.choices.some((choice) => choice.text === 'drowned')) throw new Error('Problem 104 must include the reconstructed drowned choice.');
const authoredDistractors = practicalProblems.flatMap((problem) => problem.choices.filter((choice) => choice.authoredDistractor === true));
if (authoredDistractors.length === 0) throw new Error('Source-derived Practical choices must mark authored distractors.');
const wordOrderCounts = Object.fromEntries(lessons.map((lesson) => [lesson.id, problems.filter((problem) => problem.type === 'word-order' && problem.lessonId === lesson.id).length]));
if (JSON.stringify(wordOrderCounts) !== JSON.stringify({ 'PART-L1': 0, 'PART-L2': 0, 'PART-L3': 2, 'PART-L4': 2, 'PART-L5': 0, 'PART-L6': 2 })) throw new Error(`Unexpected Phase 7 word-order distribution: ${JSON.stringify(wordOrderCounts)}.`);
const entranceWordOrderProblems = problems.filter((problem) => problem.type === 'word-order' && problem.assessmentKind === 'entrance');
if (entranceWordOrderProblems.length !== 6 || entranceWordOrderProblems.some((problem) => problem.assessmentKind !== 'entrance')) throw new Error('Phase 7 requires exactly six entrance Word Order problems marked assessmentKind=entrance.');
const practiceWordOrderCounts = Object.fromEntries(lessons.map((lesson) => [lesson.id, entranceWordOrderProblems.filter((problem) => problem.lessonId === lesson.id).length]));
if (JSON.stringify(practiceWordOrderCounts) !== JSON.stringify({ 'PART-L1': 0, 'PART-L2': 0, 'PART-L3': 2, 'PART-L4': 2, 'PART-L5': 0, 'PART-L6': 2 })) throw new Error(`Unexpected Phase 7 entrance word-order distribution: ${JSON.stringify(practiceWordOrderCounts)}.`);

const referencedRequirementIds = new Set(problems.flatMap((problem) => problem.requirements ?? []));
const missingRequirementIds = learningRequirementIds.filter((id) => !referencedRequirementIds.has(id));
if (missingRequirementIds.length > 0) throw new Error(`Learning requirements lack Problem coverage: ${missingRequirementIds.join(', ')}.`);
const finalLessonProblems = lessons.at(-1).steps.map((step) => problemRegistry[step.problemId]);
if (finalLessonProblems.length !== 4 || finalLessonProblems.some((problem) => !problem.requirements.includes('LR-PART-013'))) {
  throw new Error('Every Lesson 6 integrated Problem must include LR-PART-013.');
}

const frozenManifest = JSON.parse(readFileSync(join(root, 'scripts/frozen-lesson-content.json'), 'utf8'));
const frozenErrors = validateFrozenLessonContent(root, frozenManifest);
if (frozenErrors.length > 0) throw new Error(frozenErrors.join('\n'));

const workflowDir = join(root, '.github/workflows');
const workflowFiles = existsSync(workflowDir)
  ? readdirSync(workflowDir).filter((file) => /\.ya?ml$/i.test(file))
  : [];
if (!workflowFiles.some((file) => file.toLowerCase() === 'ci.yml')) throw new Error('CI workflow is missing.');
const ciWorkflowText = readFileSync(join(workflowDir, workflowFiles.find((file) => file.toLowerCase() === 'ci.yml')), 'utf8');
const forbiddenDeploymentPatterns = [/actions\/deploy-pages/i, /actions\/upload-pages-artifact/i, /pages:\s*write/i, /id-token:\s*write/i, /github-pages environment/i];
if (forbiddenDeploymentPatterns.some((pattern) => pattern.test(ciWorkflowText))) throw new Error('CI workflow must remain validation-only.');

function validateSourceEvidence(evidence, label) {
  const errors = [];
  const ocrSource = evidence ? ocrSources.get(evidence.source) : null;
  if (!ocrSource) errors.push(`${label}.source must reference a repository OCR source`);
  if (!evidence || typeof evidence.heading !== 'string' || !evidence.heading.trim()) errors.push(`${label}.heading is required`);
  else if (ocrSource && !ocrSource.text.includes(evidence.heading)) errors.push(`${label}.heading does not exist in ${evidence.source}: ${evidence.heading}`);
  if (!Number.isInteger(evidence?.lineStart) || evidence.lineStart < 1) errors.push(`${label}.lineStart must be an integer >= 1`);
  if (!Number.isInteger(evidence?.lineEnd) || evidence.lineEnd < evidence.lineStart) errors.push(`${label}.lineEnd must be an integer >= lineStart`);
  if (ocrSource && Number.isInteger(evidence?.lineEnd) && evidence.lineEnd > ocrSource.lines.length) errors.push(`${label}.lineEnd exceeds ${evidence.source} line count`);
  if (!evidence || typeof evidence.concept !== 'string' || !evidence.concept.trim()) errors.push(`${label}.concept is required`);
  return errors;
}

const traceableEvidence = [
  ...lessonContents.flatMap((content) => [
    ...content.sections.map((section) => ({ label: `${content.lessonId}.${section.id}`, evidence: section.sourceEvidence })),
    { label: `${content.lessonId}.lesson`, evidence: content.sourceEvidence },
  ]),
  ...problems
    .filter((problem) => problem.type === 'exam-multiple-choice' || problem.type === 'practice-multiple-choice' || problem.assessmentKind === 'entrance')
    .map((problem) => ({ label: problem.id, evidence: [problem.sourceEvidence] })),
];
const traceabilityErrors = traceableEvidence.flatMap(({ label, evidence }) => (evidence ?? []).flatMap((item, index) => validateSourceEvidence(item, `${label}.sourceEvidence[${index}]`)));
if (traceabilityErrors.length > 0) throw new Error(traceabilityErrors.join('\n'));
const mutationTestErrors = validateSourceEvidence({ source: 'chapter14-ocr.md', heading: 'heading-that-does-not-exist', lineStart: 99999, lineEnd: 99999, concept: 'mutation test' }, 'mutation-test');
if (mutationTestErrors.length === 0) throw new Error('Source evidence mutation test did not fail as expected.');

const consistencyMarkers = ['Explanation is primary', 'Interaction is supportive', 'Assessment confirms transfer'];
for (const documentName of ['PROJECT_GOAL.md', 'DESIGN.md']) {
  const documentText = readFileSync(join(root, documentName), 'utf8');
  const missingMarkers = consistencyMarkers.filter((marker) => !documentText.includes(marker));
  if (missingMarkers.length > 0) throw new Error(`${documentName} is missing consistency markers: ${missingMarkers.join(', ')}`);
}

const active = problems.filter((problem) => problem.semanticVoice === 'active').length;
const passive = problems.filter((problem) => problem.semanticVoice === 'passive').length;
if (active === 0 || passive === 0) throw new Error('Both active and passive problems are required.');
if (problems.some((problem) => 'semanticRelation' in problem || problem.relations?.some((relation) => 'semanticRelation' in relation))) {
  throw new Error('semanticRelation must not be used; use label/explanation instead.');
}
console.log(`Check passed: ${problems.length} problems, ${lessons.length} lessons, ${Object.keys(demoRegistry).length} demo types, active=${active}, passive=${passive}.`);
