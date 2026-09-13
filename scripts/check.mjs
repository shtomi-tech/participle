import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { demoRegistry } from '../src/components/demos/registry.js';
import { lessons } from '../src/data/lessons.js';
import { problemRegistry, problems } from '../src/data/problems/index.js';
import { learningRequirementIdSet, learningRequirementIds } from '../src/data/learning-requirements.js';
import { validateDemoRegistry, validateProblems } from '../src/lib/validateProblems.js';
import { validateLessons } from '../src/lib/validateLessons.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceFiles = [
  'src/app.js',
  'src/data/learning-requirements.js',
  'src/data/problems/index.js',
  'src/data/problems/mark-parts.js',
  'src/data/problems/modifier-connection-viewer.js',
  'src/data/problems/grammar-classifier.js',
  'src/data/problems/word-order.js',
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
  'src/lib/validateProblems.js',
  'src/lib/validateLessons.js',
  'src/components/demos/markTheParts.js',
  'src/components/demos/modifierConnectionViewer.js',
  'src/components/demos/grammarClassifier.js',
  'src/components/demos/wordOrderBuilder.js',
  'src/components/demos/sentenceComparison.js',
  'src/components/demos/errorCorrector.js',
  'src/components/demos/modifierPositioner.js',
  'src/components/demos/contextGrammar.js',
  'src/components/demos/registry.js',
  'scripts/build.mjs',
  'scripts/check.mjs',
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

const problemValidation = validateProblems(problems, { knownRequirementIds: learningRequirementIdSet });
if (!problemValidation.valid) throw new Error(problemValidation.errors.join('\n'));
const registryValidation = validateDemoRegistry(demoRegistry, problemRegistry);
if (!registryValidation.valid) throw new Error(registryValidation.errors.join('\n'));
const lessonValidation = validateLessons(lessons, { problemRegistry, problemTypes: new Set(Object.keys(demoRegistry)) });
if (!lessonValidation.valid) throw new Error(lessonValidation.errors.join('\n'));
const expectedLessonIds = ['PART-L1', 'PART-L2', 'PART-L3', 'PART-L4', 'PART-L5', 'PART-L6'];
if (lessons.length !== expectedLessonIds.length || lessons.some((lesson, index) => lesson.id !== expectedLessonIds[index])) {
  throw new Error(`Phase 4 requires lessons in order: ${expectedLessonIds.join(', ')}.`);
}
if (Object.keys(demoRegistry).length !== 8 || !demoRegistry['context-grammar']) throw new Error('Phase 4 requires eight demo types including context-grammar.');

const referencedRequirementIds = new Set(problems.flatMap((problem) => problem.requirements ?? []));
const missingRequirementIds = learningRequirementIds.filter((id) => !referencedRequirementIds.has(id));
if (missingRequirementIds.length > 0) throw new Error(`Learning requirements lack Problem coverage: ${missingRequirementIds.join(', ')}.`);
const finalLessonProblems = lessons.at(-1).steps.map((step) => problemRegistry[step.problemId]);
if (finalLessonProblems.length !== 5 || finalLessonProblems.some((problem) => !problem.requirements.includes('LR-PART-013'))) {
  throw new Error('Every Lesson 6 Problem must include LR-PART-013.');
}

if (existsSync(join(root, '.github/workflows/pages.yml'))) throw new Error('GitHub Pages workflow must not remain.');
const ciPath = join(root, '.github/workflows/ci.yml');
if (!existsSync(ciPath)) throw new Error('CI workflow is missing.');
const ciText = readFileSync(ciPath, 'utf8');
if (/deploy-pages|upload-pages-artifact|pages:\s*write|id-token:\s*write/.test(ciText)) {
  throw new Error('CI workflow must remain validation-only.');
}

const active = problems.filter((problem) => problem.semanticVoice === 'active').length;
const passive = problems.filter((problem) => problem.semanticVoice === 'passive').length;
if (active === 0 || passive === 0) throw new Error('Both active and passive problems are required.');
if (problems.some((problem) => 'semanticRelation' in problem || problem.relations?.some((relation) => 'semanticRelation' in relation))) {
  throw new Error('semanticRelation must not be used; use label/explanation instead.');
}
console.log(`Check passed: ${problems.length} problems, ${lessons.length} lessons, ${Object.keys(demoRegistry).length} demo types, active=${active}, passive=${passive}.`);
