import { markPartsProblems } from './mark-parts.js';
import { modifierConnectionProblems } from './modifier-connection-viewer.js';
import { grammarClassifierProblems } from './grammar-classifier.js';
import { wordOrderProblems } from './word-order.js';
import { sentenceComparisonProblems } from './sentence-comparison.js';
import { errorCorrectorProblems } from './error-corrector.js';
import { modifierPositionerProblems } from './modifier-positioner.js';
import { contextGrammarProblems } from './context-grammar.js';
import { examMultipleChoiceProblems } from './exam-multiple-choice.js';
import { entranceWordOrderProblems } from './entrance-word-order.js';

export const problemSets = {
  'mark-parts': markPartsProblems,
  'modifier-connection-viewer': modifierConnectionProblems,
  'grammar-classifier': grammarClassifierProblems,
  'word-order': [...wordOrderProblems, ...entranceWordOrderProblems],
  'sentence-comparison': sentenceComparisonProblems,
  'error-corrector': errorCorrectorProblems,
  'modifier-positioner': modifierPositionerProblems,
  'context-grammar': contextGrammarProblems,
  'exam-multiple-choice': examMultipleChoiceProblems,
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
  contextGrammarProblems,
  examMultipleChoiceProblems,
  entranceWordOrderProblems,
};
