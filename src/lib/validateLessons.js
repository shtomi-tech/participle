function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateLessons(lessons, { problemRegistry = {}, problemTypes = new Set() } = {}) {
  const errors = [];
  if (!Array.isArray(lessons)) return { valid: false, errors: ['Lessons must be an array'] };
  const lessonIds = new Set();
  const slugs = new Set();
  lessons.forEach((lesson, index) => {
    const label = `Lesson[${index}]`;
    if (!lesson || !hasText(lesson.id) || !hasText(lesson.slug) || !hasText(lesson.title)) {
      errors.push(`${label} needs id, slug, and title`);
      return;
    }
    if (lessonIds.has(lesson.id)) errors.push(`${label}.id is duplicated: ${lesson.id}`);
    lessonIds.add(lesson.id);
    if (slugs.has(lesson.slug)) errors.push(`${label}.slug is duplicated: ${lesson.slug}`);
    slugs.add(lesson.slug);
    if (!hasText(lesson.description) || !hasText(lesson.learningGoal)) errors.push(`${label} needs description and learningGoal`);
    if (!Array.isArray(lesson.steps) || lesson.steps.length === 0) {
      errors.push(`${label}.steps must contain at least one step`);
      return;
    }
    const stepIds = new Set();
    lesson.steps.forEach((step, stepIndex) => {
      const stepLabel = `${label}.steps[${stepIndex}]`;
      if (!step || !hasText(step.id) || !hasText(step.interactionType) || !hasText(step.problemId)) {
        errors.push(`${stepLabel} needs id, interactionType, and problemId`);
        return;
      }
      if (stepIds.has(step.id)) errors.push(`${stepLabel}.id is duplicated: ${step.id}`);
      stepIds.add(step.id);
      if (problemTypes.size > 0 && !problemTypes.has(step.interactionType)) errors.push(`${stepLabel}.interactionType is unknown: ${step.interactionType}`);
      const problem = problemRegistry[step.problemId];
      if (!problem) errors.push(`${stepLabel}.problemId is missing: ${step.problemId}`);
      else {
        if (problem.type !== step.interactionType) errors.push(`${stepLabel} type mismatch: ${step.interactionType} vs ${problem.type}`);
        if (problem.lessonId !== lesson.id) errors.push(`${stepLabel}.problemId belongs to ${problem.lessonId}, not ${lesson.id}`);
      }
      if (!hasText(step.title) || !hasText(step.instruction)) errors.push(`${stepLabel} needs title and instruction`);
    });
  });
  return { valid: errors.length === 0, errors };
}
