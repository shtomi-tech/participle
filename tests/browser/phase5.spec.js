import { expect, test } from '@playwright/test';

const lessonSlugs = [
  'participle-basics',
  'ing-vs-pp',
  'modifier-position',
  'hidden-sv',
  'emotion-verbs',
  'integrated-judgment',
];

test('renders explanation-first content before practice on every Lesson route', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/#');
  await expect(page.locator('.lesson-card')).toHaveCount(6);

  for (const slug of lessonSlugs) {
    await page.goto(`/#lessons/${slug}`);
    await expect(page.locator('[data-lesson-explanation]')).toBeVisible();
    expect(await page.locator('.lesson-example').count()).toBeGreaterThanOrEqual(4);
    expect(await page.locator('[data-explanation-section] .lesson-section-sources').count()).toBe(3);
    await expect(page.locator('[data-explanation-kind="key-rules"]')).toBeVisible();
    await expect(page.locator('[data-explanation-kind="common-mistakes"]')).toBeVisible();
    await expect(page.locator('[data-explanation-kind="exam-points"]')).toBeVisible();
    await expect(page.locator('[data-lesson-interactive]')).toBeVisible();
    await expect(page.locator('[data-assessment-section="exam"]')).toBeVisible();
    await expect(page.locator('[data-lesson-closing]')).toBeVisible();
    const order = await page.locator('main > section').evaluateAll((sections) => sections.map((section) => (
      section.dataset.lessonExplanation !== undefined
        ? 'explanation'
        : section.dataset.lessonInteractive !== undefined
          ? 'interactive'
          : section.dataset.assessmentSection ?? section.className
    )));
    expect(order.indexOf('explanation')).toBeLessThan(order.indexOf('interactive'));
    expect(order.indexOf('interactive')).toBeLessThan(order.indexOf('exam'));
    expect(order.indexOf('exam')).toBeLessThan(order.indexOf('lesson-closing'));
  }

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('regresses every existing interaction type with an accepted path', async ({ page }) => {
  const interactive = page.locator('[data-lesson-component]');

  await page.goto('/#lessons/participle-basics');
  await interactive.locator('[data-token-id="l1-lamp"]').click();
  await interactive.locator('[data-parts-check]').click();
  await expect(interactive.locator('[data-parts-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();

  for (const [itemId, categoryId] of [
    ['l1-cheerful', 'ordinary-adjective'],
    ['l1-smiling', 'participle-adjective'],
    ['l1-child', 'noun'],
    ['l1-opened', 'verb'],
  ]) {
    await interactive.locator(`[data-classifier-item-id="${itemId}"]`).first().click();
    await interactive.locator(`[data-classifier-category-id="${categoryId}"]`).click();
  }
  await interactive.locator('[data-classifier-check]').click();
  await expect(interactive.locator('[data-classifier-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();

  for (const id of ['l1-a', 'l1-smiling', 'l1-baby']) {
    await interactive.locator(`[data-word-id="${id}"]`).click();
  }
  await interactive.locator('[data-check]').click();
  await expect(interactive.locator('[data-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();

  await interactive.locator('[data-comparison-chunk-id="l1c-a-modifier"]').click();
  await expect(interactive.locator('[data-comparison-progress]')).toHaveText('You explored all sentence differences.');

  await page.goto('/#lessons/ing-vs-pp');
  await interactive.locator('[data-comparison-chunk-id="l2c-a-form"]').click();
  await page.locator('[data-next]').click();
  for (const [itemId, categoryId] of [
    ['l2-smiling-child', 'active'],
    ['l2-recommended-book', 'passive'],
    ['l2-fallen-leaves', 'completion'],
    ['l2-grown-children', 'completion'],
  ]) {
    await interactive.locator(`[data-classifier-item-id="${itemId}"]`).first().click();
    await interactive.locator(`[data-classifier-category-id="${categoryId}"]`).click();
  }
  await interactive.locator('[data-classifier-check]').click();
  await expect(interactive.locator('[data-classifier-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();
  await interactive.locator('[data-error-correction-id="l2e-voice"]').click();
  await interactive.locator('[data-error-option-id="l2e-opt-spoken"]').click();
  await expect(interactive.locator('[data-error-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();
  await interactive.locator('[data-comparison-chunk-id="l2c2-a-verb"]').click();
  await expect(interactive.locator('[data-comparison-progress]')).toHaveText('You explored all sentence differences.');

  await page.goto('/#lessons/modifier-position');
  await interactive.locator('[data-modifier]').click();
  await interactive.locator('[data-placement-id="l3p1-before-noun"]').click();
  await expect(interactive.locator('[data-positioner-feedback]')).toHaveText('Goal matched.');
  await page.locator('[data-next]').click();
  await interactive.locator('[data-modifier]').click();
  await interactive.locator('[data-placement-id="l3p2-after-subject"]').click();
  await expect(interactive.locator('[data-positioner-feedback]')).toHaveText('Goal matched.');
  await page.locator('[data-next]').click();
  await interactive.locator('[data-sentence-chunk-id="l3-rel-glowing"]').click();
  await expect(interactive.locator('[data-modifier-progress]')).toHaveText('Relation complete.');
  await page.locator('[data-next]').click();
  await interactive.locator('[data-comparison-chunk-id="l3c-a-modifier"]').click();
  await expect(interactive.locator('[data-comparison-progress]')).toHaveText('You explored all sentence differences.');

  await page.goto('/#lessons/emotion-verbs');
  for (const [itemId, categoryId] of [
    ['l5-surprise', 'emotion-verb'],
    ['l5-interest', 'emotion-verb'],
    ['l5-excite', 'emotion-verb'],
    ['l5-amuse', 'emotion-verb'],
    ['l5-arrive', 'other-verb'],
    ['l5-sleep', 'other-verb'],
  ]) {
    await interactive.locator(`[data-classifier-item-id="${itemId}"]`).first().click();
    await interactive.locator(`[data-classifier-category-id="${categoryId}"]`).click();
  }
  await interactive.locator('[data-classifier-check]').click();
  await expect(interactive.locator('[data-classifier-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();
  await interactive.locator('[data-comparison-chunk-id="l5c-a-form"]').click();
  await page.locator('[data-next]').click();
  for (const [correctionId, optionId] of [
    ['l5e-cause', 'l5e-opt-cause-exciting'],
    ['l5e-experiencer', 'l5e-opt-receiver-excited'],
  ]) {
    await interactive.locator(`[data-error-correction-id="${correctionId}"]`).click();
    await interactive.locator(`[data-error-option-id="${optionId}"]`).click();
  }
  await expect(interactive.locator('[data-error-progress]')).toHaveText('You corrected all errors.');
  await page.locator('[data-next]').click();
  for (const choiceId of ['l5-context-choice-1a', 'l5-context-choice-2a', 'l5-context-choice-3a']) {
    await interactive.locator(`[data-context-choice-id="${choiceId}"]`).click();
    await interactive.locator('[data-context-continue]').click();
  }
  await expect(interactive.locator('[data-context-progress]')).toHaveText('You completed the scenario.');
});

test('supports wrong-answer review, reset, and correct-answer review in an entrance question', async ({ page }) => {
  await page.goto('/#lessons/participle-basics');
  const exam = page.locator('[data-exam-component]');
  await exam.locator('[data-exam-choice-id="l1e1-c1"]').click();
  await exam.locator('[data-exam-submit]').click();
  await expect(exam.locator('[data-exam-result]')).toHaveText('× 不正解です。正解：3. crying');
  await expect(exam.locator('.exam-mc-option-review')).toHaveCount(4);
  await expect(exam.locator('[data-exam-choice-id]')).toHaveCount(4);
  await exam.locator('[data-exam-reset]').click();
  await exam.locator('[data-exam-choice-id="l1e1-c3"]').click();
  await exam.locator('[data-exam-submit]').click();
  await expect(exam.locator('[data-exam-result]')).toHaveText('○ 正解です');
  await expect(exam.locator('[data-exam-overall-text]')).toBeVisible();
  await expect(exam.locator('.exam-mc-option-review')).toHaveCount(4);
});

test('keeps the entrance question keyboard-accessible', async ({ page }) => {
  await page.goto('/#lessons/hidden-sv');
  const exam = page.locator('[data-exam-component]');
  const choice = exam.locator('[data-exam-choice-id="l4e1-c3"]');
  await choice.press('Enter');
  await exam.locator('[data-exam-submit]').press('Enter');
  await expect(exam.locator('[data-exam-result]')).toHaveText('○ 正解です');
  await expect(exam.locator('[data-exam-result]')).toBeFocused();
  await exam.locator('[data-exam-reset]').press('Enter');
  await expect(exam.locator('[data-exam-choice-id="l4e1-c1"]')).toBeFocused();
});

test('supports wrong-answer review, reset, and detailed explanation for entrance word order', async ({ page }) => {
  await page.goto('/#lessons/ing-vs-pp');
  const wordOrder = page.locator('[data-word-order-component]');
  await wordOrder.locator('[data-word-id="l2w1-barking"]').click();
  await wordOrder.locator('[data-check]').click();
  await expect(wordOrder.locator('[data-feedback]')).toHaveText(/Not yet/);
  await wordOrder.locator('[data-reset]').click();
  for (const id of ['l2w1-a', 'l2w1-dog', 'l2w1-barking']) {
    await wordOrder.locator(`[data-word-id="${id}"]`).click();
  }
  await wordOrder.locator('[data-check]').click();
  await expect(wordOrder.locator('[data-feedback]')).toHaveText(/Correct/);
  await expect(wordOrder.locator('[data-explanation-steps]')).toBeVisible();
  await expect(wordOrder.locator('[data-explanation-steps] li')).toHaveCount(3);
});

test('has no horizontal overflow at 390px on a long Lesson', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#lessons/hidden-sv');
  await expect(page.locator('.lesson-example')).toHaveCount(5);
  await expect(page.locator('[data-exam-choice-id]')).toHaveCount(4);
  await expect(page.locator('.exam-mc-stem')).toBeVisible();
  await expect(page.locator('[data-word-order-component]')).toBeVisible();
  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
});
