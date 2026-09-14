import { mountMarkTheParts } from './markTheParts.js';
import { mountModifierConnectionViewer } from './modifierConnectionViewer.js';
import { mountGrammarClassifier } from './grammarClassifier.js';
import { mountWordOrderBuilder } from './wordOrderBuilder.js';
import { mountSentenceComparison } from './sentenceComparison.js';
import { mountErrorCorrector } from './errorCorrector.js';
import { mountModifierPositioner } from './modifierPositioner.js';
import { mountContextGrammar } from './contextGrammar.js';
import { mountExamMultipleChoice } from './examMultipleChoice.js';
import { getProblemById } from '../../data/problems/index.js';

export const demoRegistry = {
  'mark-parts': { mount: mountMarkTheParts, demoProblemId: 'PART-L4-P001-MARK' },
  'modifier-connection-viewer': { mount: mountModifierConnectionViewer, demoProblemId: 'PART-L4-P001-REL' },
  'grammar-classifier': { mount: mountGrammarClassifier, demoProblemId: 'PART-L1-P002-CLASS' },
  'word-order': { mount: mountWordOrderBuilder, demoProblemId: 'PART-L3-EXAM-WORD-001' },
  'sentence-comparison': { mount: mountSentenceComparison, demoProblemId: 'PART-L1-P004-COMPARE' },
  'error-corrector': { mount: mountErrorCorrector, demoProblemId: 'PART-L2-P003-ERROR' },
  'modifier-positioner': { mount: mountModifierPositioner, demoProblemId: 'PART-L3-P001-POSITION' },
  'context-grammar': { mount: mountContextGrammar, demoProblemId: 'PART-L5-P004-CONTEXT' },
  'exam-multiple-choice': { mount: mountExamMultipleChoice, demoProblemId: 'PART-L1-EXAM-001' },
};

export function getDemoProblem(type, problemId) {
  const entry = demoRegistry[type];
  if (!entry) throw new Error(`Unknown demo type: ${type}`);
  const problem = getProblemById(problemId ?? entry.demoProblemId);
  if (!problem) throw new Error(`Missing demo problem: ${problemId ?? entry.demoProblemId}`);
  if (problem.type !== type) throw new Error(`Demo problem type mismatch: ${problem.type} vs ${type}`);
  return problem;
}

export function mountDemoProblem(type, root, problem, options = {}) {
  const entry = demoRegistry[type];
  if (!entry) throw new Error(`Unknown demo type: ${type}`);
  if (!problem || problem.type !== type) throw new Error(`Demo problem type mismatch for ${type}`);
  return entry.mount(root, problem, options);
}

export function mountDemo(type, root, options = {}) {
  const { problemId, ...componentOptions } = options;
  return mountDemoProblem(type, root, getDemoProblem(type, problemId), componentOptions);
}
