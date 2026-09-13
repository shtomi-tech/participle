import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { demoRegistry } from '../src/components/demos/registry.js';
import { lessons } from '../src/data/lessons.js';
import { problemRegistry, problems } from '../src/data/problems/index.js';
import { learningRequirementIdSet } from '../src/data/learning-requirements.js';
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
  'src/lib/validateProblems.js',
  'src/lib/validateLessons.js',
  'src/components/demos/markTheParts.js',
  'src/components/demos/modifierConnectionViewer.js',
  'src/components/demos/grammarClassifier.js',
  'src/components/demos/wordOrderBuilder.js',
  'src/components/demos/sentenceComparison.js',
  'src/components/demos/errorCorrector.js',
  'src/components/demos/modifierPositioner.js',
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

if (existsSync(join(root, '.github/workflows/pages.yml'))) throw new Error('GitHub Pages workflow must not remain in Phase 2.');
const ciPath = join(root, '.github/workflows/ci.yml');
if (!existsSync(ciPath)) throw new Error('CI workflow is missing.');
const ciText = readFileSync(ciPath, 'utf8');
if (/deploy-pages|upload-pages-artifact|pages:\s*write|id-token:\s*write/.test(ciText)) {
  throw new Error('CI workflow must remain validation-only in Phase 2.');
}

const active = problems.filter((problem) => problem.semanticVoice === 'active').length;
const passive = problems.filter((problem) => problem.semanticVoice === 'passive').length;
if (active === 0 || passive === 0) throw new Error('Both active and passive problems are required.');
if (problems.some((problem) => 'semanticRelation' in problem || problem.relations?.some((relation) => 'semanticRelation' in relation))) {
  throw new Error('semanticRelation must not be used; use label/explanation instead.');
}
console.log(`Check passed: ${problems.length} problems, ${lessons.length} lessons, ${Object.keys(demoRegistry).length} demo types, active=${active}, passive=${passive}.`);
