import { expect, test } from '@playwright/test';

test('Lesson 1 follows LOOK through SUMMARY and restores completion', async ({ page }) => {
  await page.goto('/#lessons/participle-basics');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const spec = page.locator('[data-participle-spec-root]');
  await expect(spec.locator('[data-spec-sentence-display]')).toHaveText(['The girl is tall.', 'The girl is dancing.']);
  await spec.locator('[data-spec-action="intro-select"][data-spec-value="participle"]').click();
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();

  await spec.locator('[data-spec-action="change-tall"]').click();
  await spec.locator('[data-spec-action="change-cute"]').click();
  await spec.locator('[data-spec-action="choose-notice"][data-spec-value="baby"]').click();
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();
  await expect(spec.locator('[data-spec-stage-content]')).toContainText('RULE');
  await expect(spec.locator('[data-spec-stage-content]')).toContainText('CALLBACK');
  await spec.locator('[data-spec-choice-id="surprise-cause"]').press('Enter');
  await spec.locator('[data-spec-stage-next]').click();

  await spec.locator('[data-spec-choice-question="l1-q1"][data-spec-choice-id="baby"]').click();
  await spec.locator('[data-spec-choice-question="l1-q2"][data-spec-choice-id="noun"]').click();
  await spec.locator('[data-spec-stage-next]').click();
  await expect(spec.locator('[data-spec-stage-title]')).toHaveText('今日のまとめ');
  await spec.locator('[data-spec-action="complete-lesson"]').click();
  await expect(spec.locator('[data-spec-complete-panel]')).toContainText('COMPLETE');

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('participle.lesson-progress.v1')));
  expect(saved.lesson1.completed).toBe(true);
  expect(saved.lesson1.completedSteps).toEqual(['look', 'notice', 'try', 'check', 'summary']);
  await page.reload();
  await expect(spec.locator('[data-spec-stage-title]')).toHaveText('今日のまとめ');
  await expect(spec.locator('[data-spec-complete-panel]')).toContainText('COMPLETE');
});

test('Lesson 4 and Lesson 5 use two-stage relation checks and final scores', async ({ page }) => {
  await page.goto('/#lessons/hidden-sv');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const lesson4 = page.locator('[data-participle-spec-root]');
  await lesson4.locator('[data-spec-stage="0"]').click();
  await lesson4.locator('[data-spec-action="complete-stage"]').click();
  await lesson4.locator('[data-spec-stage-next]').click();
  for (const [index, relation, form] of [[0, 'active', 'smiling'], [1, 'passive', 'spoken']]) {
    await lesson4.locator(`[data-spec-case-node="${index}:noun"]`).click();
    await lesson4.locator(`[data-spec-case-node="${index}:verb"]`).click();
    await lesson4.locator(`[data-spec-case-relation="${index}:${relation}"]`).click();
    await lesson4.locator(`[data-spec-case-form="${index}:${form}"]`).click();
  }
  await expect(lesson4.locator('[data-spec-stage-status]')).toContainText('complete');

  await page.goto('/#lessons/emotion-verbs');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const lesson5 = page.locator('[data-participle-spec-root]');
  await lesson5.locator('[data-spec-choice-id="cause"]').click();
  await lesson5.locator('[data-spec-stage-next]').click();
  await lesson5.locator('[data-spec-action="myth-choice"][data-spec-value="no"]').click();
  await lesson5.locator('[data-spec-action="complete-stage"]').click();
  await lesson5.locator('[data-spec-stage-next]').click();
  await lesson5.locator('[data-spec-action="complete-stage"]').click();
  await lesson5.locator('[data-spec-stage-next]').click();

  const answers = [
    ['l5-q1', 'passive', 'spoken'], ['l5-q2', 'active', 'running'], ['l5-q3', 'active', 'boring'],
    ['l5-q4', 'passive', 'excited'], ['l5-q5', 'active', 'interesting'],
  ];
  for (const [id, relation, form] of answers) {
    await lesson5.locator(`[data-spec-final-relation="${id}:${relation}"]`).click();
    await lesson5.locator(`[data-spec-final-form="${id}:${form}"]`).click();
  }
  await lesson5.locator('[data-spec-action="final-submit"]').click();
  await expect(lesson5.locator('[data-spec-final-result]')).toContainText('COMPLETE');
  await expect(lesson5.locator('.spec-score-pair')).toContainText('ANSWERS 5 / 5');
  await expect(lesson5.locator('.spec-score-pair')).toContainText('REASONING 5 / 5');
  const finalSaved = await page.evaluate(() => JSON.parse(localStorage.getItem('participle.lesson-progress.v1')));
  expect(finalSaved.lesson5.answerScore).toBe(5);
  expect(finalSaved.lesson5.reasoningScore).toBe(5);
});

test('Lesson 2 keeps the drag rule check usable with click fallback', async ({ page }) => {
  await page.goto('/#lessons/ing-vs-pp');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const spec = page.locator('[data-participle-spec-root]');
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();
  await spec.locator('[data-spec-action="active-reveal"]').click();
  await spec.locator('[data-spec-action="passive-relation"][data-spec-value="passive"]').click();
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();
  await spec.locator('[data-spec-word-card="used"]').click();
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();

  await spec.locator('[data-spec-relation-choice="l2-q1:active"]').click();
  await spec.locator('[data-spec-form-choice="l2-q1:smiling"]').click();
  await spec.locator('[data-spec-relation-choice="l2-q2:passive"]').click();
  await spec.locator('[data-spec-form-choice="l2-q2:spoken"]').click();
  await expect(spec.locator('[data-spec-drag-item]')).toHaveCount(2);
  await spec.locator('[data-spec-drag-item="l2-q3:ing"]').click();
  await spec.locator('[data-spec-drag-target="l2-q3:active"]').click();
  await spec.locator('[data-spec-drag-item="l2-q3:pp"]').click();
  await spec.locator('[data-spec-drag-target="l2-q3:passive"]').click();
  await expect(spec.locator('[data-spec-score]')).toHaveText('3 / 3 complete');
  await spec.locator('[data-spec-stage-next]').click();
  await expect(spec.locator('[data-spec-stage-title]')).toHaveText('今日のまとめ');
});

test('Lesson 3 builds a long participle phrase and keeps the rule as a principle', async ({ page }) => {
  await page.goto('/#lessons/modifier-position');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const spec = page.locator('[data-participle-spec-root]');
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();
  await spec.locator('[data-spec-build-chip="extra"]').click();
  await expect(spec.locator('[data-spec-stage-content]')).toContainText('the children laughing at the clown');
  await expect(spec.locator('[data-spec-stage-content]')).toContainText('原則：2語以上');
  await spec.locator('[data-spec-stage-next]').click();
  await expect(spec.locator('[data-spec-advanced="l3-one-word-after"]')).toContainText('1語でも後ろに置くことがあります');
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();
  await expect(spec.locator('[data-spec-stage-title]')).toHaveText('Lesson 3 確認問題');
});

test('Lesson 3 position checks and Lesson 4 Rapid Judge keep their two-step interactions', async ({ page }) => {
  await page.goto('/#lessons/modifier-position');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const lesson3 = page.locator('[data-participle-spec-root]');
  await lesson3.locator('[data-spec-action="complete-stage"]').click();
  await lesson3.locator('[data-spec-stage-next]').click();
  await lesson3.locator('[data-spec-build-chip="extra"]').click();
  await lesson3.locator('[data-spec-stage-next]').click();
  await lesson3.locator('[data-spec-action="complete-stage"]').click();
  await lesson3.locator('[data-spec-stage-next]').click();
  for (const [id, position] of [['l3-q1', 'front'], ['l3-q2', 'back'], ['l3-q3-a', 'front'], ['l3-q3-b', 'back']]) {
    await lesson3.locator(`[data-spec-position-choice="${id}:${position}"]`).click();
  }
  await expect(lesson3.locator('[data-spec-stage-status]')).toContainText('complete');

  await page.goto('/#lessons/hidden-sv');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const lesson4 = page.locator('[data-participle-spec-root]');
  await lesson4.locator('[data-spec-stage="0"]').click();
  await lesson4.locator('[data-spec-action="complete-stage"]').click();
  await lesson4.locator('[data-spec-stage-next]').click();
  for (const [index, relation, form] of [[0, 'active', 'smiling'], [1, 'passive', 'spoken']]) {
    await lesson4.locator(`[data-spec-case-node="${index}:noun"]`).click();
    await lesson4.locator(`[data-spec-case-node="${index}:verb"]`).click();
    await lesson4.locator(`[data-spec-case-relation="${index}:${relation}"]`).click();
    await lesson4.locator(`[data-spec-case-form="${index}:${form}"]`).click();
  }
  await lesson4.locator('[data-spec-stage-next]').click();
  for (const [id, noun, verb, relation, form] of [
    ['l4-rapid-1', 'noun', 'verb', 'active', 'running'],
    ['l4-rapid-2', 'noun', 'verb', 'passive', 'spoken'],
    ['l4-rapid-3', 'noun', 'verb', 'active', 'smiling'],
  ]) {
    await lesson4.locator(`[data-spec-sv-node="${id}:${noun}"]`).click();
    await lesson4.locator(`[data-spec-sv-node="${id}:${verb}"]`).click();
    await lesson4.locator(`[data-spec-sv-relation="${id}:${relation}"]`).click();
    await lesson4.locator(`[data-spec-sv-form="${id}:${form}"]`).click();
  }
  await lesson4.locator('[data-spec-action="complete-stage"]').click();
  await expect(lesson4.locator('[data-spec-stage-status]')).toContainText('complete');
});

test('Lesson 5 Review retries only missed questions and keeps first-attempt scores', async ({ page }) => {
  await page.goto('/#lessons/emotion-verbs');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const spec = page.locator('[data-participle-spec-root]');
  await spec.locator('[data-spec-choice-id="cause"]').click();
  await spec.locator('[data-spec-stage-next]').click();
  await spec.locator('[data-spec-action="myth-choice"][data-spec-value="no"]').click();
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();
  await spec.locator('[data-spec-action="complete-stage"]').click();
  await spec.locator('[data-spec-stage-next]').click();

  const answers = [
    ['l5-q1', 'active', 'speaking'], ['l5-q2', 'passive', 'run'], ['l5-q3', 'passive', 'bored'],
    ['l5-q4', 'active', 'exciting'], ['l5-q5', 'passive', 'interested'],
  ];
  const correctRelations = { 'l5-q1': 'passive', 'l5-q2': 'active', 'l5-q3': 'active', 'l5-q4': 'passive', 'l5-q5': 'active' };
  const correctForms = { 'l5-q1': 'spoken', 'l5-q2': 'running', 'l5-q3': 'boring', 'l5-q4': 'excited', 'l5-q5': 'interesting' };
  for (const [id, wrongRelation, wrongForm] of answers) {
    await spec.locator(`[data-spec-final-relation="${id}:${wrongRelation}"]`).click();
    await spec.locator(`[data-spec-final-relation="${id}:${correctRelations[id]}"]`).click();
    await spec.locator(`[data-spec-final-form="${id}:${wrongForm}"]`).click();
  }
  await spec.locator('[data-spec-action="final-submit"]').click();
  await expect(spec.locator('[data-spec-final-result]')).toContainText('REVIEW');
  await expect(spec.locator('.spec-score-pair')).toContainText('ANSWERS 0 / 5');
  await expect(spec.locator('.spec-score-pair')).toContainText('REASONING 5 / 5');
  const firstSaved = await page.evaluate(() => JSON.parse(localStorage.getItem('participle.lesson-progress.v1')));
  expect(firstSaved.lesson5.firstAttemptAnswerScore).toBe(0);
  expect(firstSaved.lesson5.firstAttemptReasoningScore).toBe(0);

  await spec.locator('[data-spec-action="final-retry"]').click();
  for (const id of Object.keys(correctRelations)) {
    await spec.locator(`[data-spec-final-relation="${id}:${correctRelations[id]}"]`).click();
    await spec.locator(`[data-spec-final-form="${id}:${correctForms[id]}"]`).click();
  }
  await spec.locator('[data-spec-action="final-submit"]').click();
  await expect(spec.locator('[data-spec-final-result]')).toContainText('COMPLETE');
  const completedSaved = await page.evaluate(() => JSON.parse(localStorage.getItem('participle.lesson-progress.v1')));
  expect(completedSaved.lesson5.firstAttemptAnswerScore).toBe(0);
  expect(completedSaved.lesson5.firstAttemptReasoningScore).toBe(0);
  expect(completedSaved.lesson5.finalPassed).toBe(true);
});

test('spec flow has no horizontal overflow on mobile and honors reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const slug of ['participle-basics', 'ing-vs-pp', 'modifier-position', 'hidden-sv', 'emotion-verbs']) {
    await page.goto(`/#lessons/${slug}`);
    const layout = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
    const motion = await page.locator('.spec-course-shell').evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration));
    expect(motion).toBeLessThanOrEqual(0.001);
  }
});
