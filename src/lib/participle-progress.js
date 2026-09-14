import { PARTICIPLE_PROGRESS_KEY } from '../data/participle-course.js';

function emptyLesson() {
  return { completed: false, currentStep: 0, completedSteps: [], quizScore: 0, quizResults: {}, rapidAnswers: {} };
}

export function defaultParticipleProgress() {
  return { lesson1: emptyLesson(), lesson2: emptyLesson(), lesson3: emptyLesson(), lesson4: emptyLesson(), lesson5: { ...emptyLesson(), answerScore: 0, reasoningScore: 0, firstAttemptAnswerScore: 0, firstAttemptReasoningScore: 0, firstAttemptRecorded: false, finalPassed: false }, currentLesson: 1 };
}

const stageIds = new Set(['look', 'notice', 'try', 'check', 'summary']);

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function normalizeParticipleProgress(value) {
  const defaults = defaultParticipleProgress();
  if (!isRecord(value)) return defaults;
  const result = structuredClone(defaults);
  for (let index = 1; index <= 5; index += 1) {
    const key = `lesson${index}`;
    const source = isRecord(value[key]) ? value[key] : {};
    result[key].completed = source.completed === true;
    result[key].currentStep = Number.isInteger(source.currentStep) ? Math.min(4, Math.max(0, source.currentStep)) : source.completed === true ? 4 : 0;
    result[key].completedSteps = Array.isArray(source.completedSteps)
      ? [...new Set(source.completedSteps.filter((step) => typeof step === 'string' && stageIds.has(step)))]
      : [];
    if (result[key].completed && result[key].completedSteps.length === 0) result[key].completedSteps = [...stageIds];
    result[key].quizScore = Number.isFinite(source.quizScore) ? Math.max(0, Math.floor(source.quizScore)) : 0;
    result[key].quizResults = isRecord(source.quizResults) ? structuredClone(source.quizResults) : {};
    result[key].rapidAnswers = isRecord(source.rapidAnswers) ? structuredClone(source.rapidAnswers) : {};
    if (index === 5) {
      result[key].answerScore = Number.isFinite(source.answerScore) ? Math.max(0, Math.floor(source.answerScore)) : 0;
      result[key].reasoningScore = Number.isFinite(source.reasoningScore) ? Math.max(0, Math.floor(source.reasoningScore)) : 0;
      result[key].firstAttemptAnswerScore = Number.isFinite(source.firstAttemptAnswerScore) ? Math.max(0, Math.floor(source.firstAttemptAnswerScore)) : 0;
      result[key].firstAttemptReasoningScore = Number.isFinite(source.firstAttemptReasoningScore) ? Math.max(0, Math.floor(source.firstAttemptReasoningScore)) : 0;
      result[key].firstAttemptRecorded = source.firstAttemptRecorded === true;
    }
    if (index === 5) result[key].finalPassed = source.finalPassed === true;
  }
  result.currentLesson = Number.isInteger(value.currentLesson) ? Math.min(5, Math.max(1, value.currentLesson)) : 1;
  return result;
}

export function loadParticipleProgress(storage = globalThis.localStorage) {
  try {
    return normalizeParticipleProgress(JSON.parse(storage?.getItem(PARTICIPLE_PROGRESS_KEY) ?? 'null'));
  } catch {
    return defaultParticipleProgress();
  }
}

export function saveParticipleProgress(progress, storage = globalThis.localStorage) {
  const normalized = normalizeParticipleProgress(progress);
  try { storage?.setItem(PARTICIPLE_PROGRESS_KEY, JSON.stringify(normalized)); } catch { /* localStorage may be unavailable in private contexts */ }
  return normalized;
}
