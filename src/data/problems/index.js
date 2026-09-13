import { markPartsProblems } from './mark-parts.js';
import { modifierConnectionProblems } from './modifier-connection-viewer.js';

export const problemSets = {
  'mark-parts': markPartsProblems,
  'modifier-connection-viewer': modifierConnectionProblems,
};

export const problems = Object.values(problemSets).flat();
export const problemRegistry = Object.fromEntries(problems.map((problem) => [problem.id, problem]));

export function getProblemById(problemId) {
  return problemRegistry[problemId];
}

export function getProblemsByType(type) {
  return problemSets[type] ? [...problemSets[type]] : [];
}

export { markPartsProblems, modifierConnectionProblems };
