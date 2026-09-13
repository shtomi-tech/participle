import { markPartsProblems } from './mark-parts.js';
import { modifierConnectionProblems } from './modifier-connection-viewer.js';
import { grammarClassifierProblems } from './grammar-classifier.js';
import { wordOrderProblems } from './word-order.js';
import { sentenceComparisonProblems } from './sentence-comparison.js';
import { errorCorrectorProblems } from './error-corrector.js';
import { modifierPositionerProblems } from './modifier-positioner.js';

export const problemSets = {
  'mark-parts': markPartsProblems,
  'modifier-connection-viewer': modifierConnectionProblems,
  'grammar-classifier': grammarClassifierProblems,
  'word-order': wordOrderProblems,
  'sentence-comparison': sentenceComparisonProblems,
  'error-corrector': errorCorrectorProblems,
  'modifier-positioner': modifierPositionerProblems,
};

export const problems = Object.values(problemSets).flat();
export const problemRegistry = Object.fromEntries(problems.map((problem) => [problem.id, problem]));

export function getProblemById(problemId) {
  return problemRegistry[problemId];
}

export function getProblemsByType(type) {
  return problemSets[type] ? [...problemSets[type]] : [];
}

export {
  markPartsProblems,
  modifierConnectionProblems,
  grammarClassifierProblems,
  wordOrderProblems,
  sentenceComparisonProblems,
  errorCorrectorProblems,
  modifierPositionerProblems,
};
