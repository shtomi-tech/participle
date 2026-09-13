import { mountMarkTheParts } from './markTheParts.js';
import { mountModifierConnectionViewer } from './modifierConnectionViewer.js';
import { getProblemById } from '../../data/problems/index.js';

export const demoRegistry = {
  'mark-parts': { mount: mountMarkTheParts, demoProblemId: 'PART-L4-P001-MARK' },
  'modifier-connection-viewer': { mount: mountModifierConnectionViewer, demoProblemId: 'PART-L4-P001-REL' },
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
