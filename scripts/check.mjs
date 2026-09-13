import { existsSync } from 'node:fs';
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
  'src/data/lessons.js',
  'src/lib/dom.js',
  'src/lib/lifecycle.js',
  'src/lib/lesson-progress.js',
  'src/lib/grammar/parts.js',
  'src/lib/grammar/modifier-relations.js',
  'src/lib/validateProblems.js',
  'src/lib/validateLessons.js',
  'src/components/demos/markTheParts.js',
  'src/components/demos/modifierConnectionViewer.js',
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

const active = problems.filter((problem) => problem.semanticVoice === 'active').length;
const passive = problems.filter((problem) => problem.semanticVoice === 'passive').length;
if (active === 0 || passive === 0) throw new Error('Both active and passive problems are required.');
if (problems.some((problem) => 'semanticRelation' in problem || problem.relations?.some((relation) => 'semanticRelation' in relation))) {
  throw new Error('semanticRelation must not be used in Phase 1.');
}
console.log(`Check passed: ${problems.length} problems, ${lessons.length} lesson, ${Object.keys(demoRegistry).length} demo types, active=${active}, passive=${passive}.`);
