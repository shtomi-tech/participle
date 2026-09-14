import { PARTICIPLE_PROGRESS_KEY } from '../data/participle-course.js';

function emptyLesson() {
  return { completed: false, quizScore: 0 };
}

export function defaultParticipleProgress() {
  return { lesson1: emptyLesson(), lesson2: emptyLesson(), lesson3: emptyLesson(), lesson4: emptyLesson(), lesson5: { ...emptyLesson(), finalPassed: false }, currentLesson: 1 };
}

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
    result[key].quizScore = Number.isFinite(source.quizScore) ? Math.max(0, Math.floor(source.quizScore)) : 0;
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
