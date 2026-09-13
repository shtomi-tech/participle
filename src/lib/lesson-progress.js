export function getLessonProgress(lesson, completedStepIds) {
  const steps = lesson?.steps ?? [];
  const completedCount = steps.filter((step) => completedStepIds?.has(step.id)).length;
  const totalCount = steps.length;
  return {
    completedCount,
    totalCount,
    percentage: totalCount ? Math.round((completedCount / totalCount) * 100) : 0,
    allComplete: totalCount > 0 && completedCount === totalCount,
  };
}

export function markLessonStepComplete(completedStepIds, stepId) {
  const next = new Set(completedStepIds ?? []);
  next.add(stepId);
  return next;
}

export function isLessonStepComplete(completedStepIds, stepId) {
  return Boolean(stepId && completedStepIds?.has(stepId));
}
