const allowedSources = new Set(['chapter14-ocr.md', 'chapter14-ocr.json']);

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateStringList(value, label, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${label} must contain at least one item`);
    return;
  }
  value.forEach((item, index) => {
    if (!hasText(item)) errors.push(`${label}[${index}] must be non-empty text`);
  });
}

function validateExamples(examples, label, errors) {
  if (!Array.isArray(examples) || examples.length === 0) {
    errors.push(`${label} must contain at least one example`);
    return;
  }
  const ids = new Set();
  examples.forEach((example, index) => {
    const itemLabel = `${label}[${index}]`;
    if (!isRecord(example) || !hasText(example.english) || !hasText(example.translation)) {
      errors.push(`${itemLabel} needs english and translation`);
    }
    if (hasText(example?.id)) {
      if (ids.has(example.id)) errors.push(`${itemLabel}.id is duplicated: ${example.id}`);
      ids.add(example.id);
    }
  });
}

function validateSections(sections, label, errors) {
  if (!Array.isArray(sections) || sections.length === 0) {
    errors.push(`${label} must contain at least one section`);
    return;
  }
  const ids = new Set();
  sections.forEach((section, index) => {
    const sectionLabel = `${label}[${index}]`;
    if (!isRecord(section) || !hasText(section.id) || !hasText(section.title)) {
      errors.push(`${sectionLabel} needs id and title`);
    } else if (ids.has(section.id)) {
      errors.push(`${sectionLabel}.id is duplicated: ${section.id}`);
    } else {
      ids.add(section.id);
    }
    validateStringList(section?.paragraphs, `${sectionLabel}.paragraphs`, errors);
    validateExamples(section?.examples, `${sectionLabel}.examples`, errors);
    validateSources(section?.sourceEvidence, `${sectionLabel}.sourceEvidence`, errors);
    if (section?.callouts !== undefined) {
      if (!Array.isArray(section.callouts)) errors.push(`${sectionLabel}.callouts must be an array`);
      else section.callouts.forEach((callout, calloutIndex) => {
        if (!isRecord(callout) || !hasText(callout.kind) || !hasText(callout.text)) errors.push(`${sectionLabel}.callouts[${calloutIndex}] needs kind and text`);
      });
    }
  });
}

function validateReviewItems(items, label, errors) {
  if (items === undefined) return;
  if (!Array.isArray(items) || items.length === 0) {
    errors.push(`${label} must contain at least one item when provided`);
    return;
  }
  items.forEach((item, index) => {
    if (!isRecord(item) || !hasText(item.title)) errors.push(`${label}[${index}] needs title`);
    validateStringList(item?.paragraphs, `${label}[${index}].paragraphs`, errors);
  });
}

function validateSources(sourceEvidence, label, errors) {
  if (!Array.isArray(sourceEvidence) || sourceEvidence.length === 0) {
    errors.push(`${label} must contain at least one source evidence item`);
    return;
  }
  sourceEvidence.forEach((evidence, index) => {
    const evidenceLabel = `${label}[${index}]`;
    if (!isRecord(evidence) || !hasText(evidence.source) || !hasText(evidence.section) || !hasText(evidence.concept)) {
      errors.push(`${evidenceLabel} needs source, section, and concept`);
      return;
    }
    if (!allowedSources.has(evidence.source)) errors.push(`${evidenceLabel}.source is not an allowed OCR source: ${evidence.source}`);
  });
}

export function validateLessonContents(contents, { lessons = [] } = {}) {
  const errors = [];
  if (!Array.isArray(contents)) return { valid: false, errors: ['Lesson contents must be an array'] };
  const lessonIds = new Set(lessons.map((lesson) => lesson?.id).filter(hasText));
  const contentIds = new Set();
  contents.forEach((content, index) => {
    const label = `LessonContent[${index}]`;
    if (!isRecord(content)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (!hasText(content.lessonId)) errors.push(`${label}.lessonId is required`);
    else if (contentIds.has(content.lessonId)) errors.push(`${label}.lessonId is duplicated: ${content.lessonId}`);
    else contentIds.add(content.lessonId);
    if (lessonIds.size > 0 && !lessonIds.has(content.lessonId)) errors.push(`${label}.lessonId references an unknown Lesson: ${content.lessonId}`);
    if (!hasText(content.introduction)) errors.push(`${label}.introduction is required`);
    validateSections(content.sections, `${label}.sections`, errors);
    validateStringList(content.keyRules, `${label}.keyRules`, errors);
    validateStringList(content.commonMistakes, `${label}.commonMistakes`, errors);
    validateStringList(content.examPoints, `${label}.examPoints`, errors);
    validateStringList(content.summary, `${label}.summary`, errors);
    validateReviewItems(content.detailedReview, `${label}.detailedReview`, errors);
    validateSources(content.sourceEvidence, `${label}.sourceEvidence`, errors);
  });
  if (lessonIds.size > 0) {
    lessons.forEach((lesson) => {
      if (!contentIds.has(lesson.id)) errors.push(`Missing LessonContent for Lesson: ${lesson.id}`);
    });
  }
  return { valid: errors.length === 0, errors };
}
