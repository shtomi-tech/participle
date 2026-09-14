import { expect, test } from '@playwright/test';

const lessons = [
  { slug: 'participle-basics', steps: 3, wordOrder: 0 },
  { slug: 'ing-vs-pp', steps: 4, wordOrder: 0 },
  { slug: 'modifier-position', steps: 3, wordOrder: 2 },
  { slug: 'hidden-sv', steps: 6, wordOrder: 2 },
  { slug: 'emotion-verbs', steps: 4, wordOrder: 0 },
];

test('renders explanation, interactive check, exam, optional word order, and review in order', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/#');
  await expect(page.locator('.lesson-card')).toHaveCount(6);

  for (const lesson of lessons) {
    await page.goto(`/#lessons/${lesson.slug}`);
    await expect(page.locator('[data-lesson-explanation]')).toBeVisible();
    await expect(page.locator('[data-lesson-interactive]')).toBeVisible();
    await expect(page.locator('[data-assessment-section="exam"]')).toBeVisible();
    await expect(page.locator('[data-lesson-closing]')).toBeVisible();
    await expect(page.locator('[data-step-label]')).toHaveText(`Step 1 / ${lesson.steps}`);
    const wordOrder = page.locator('[data-assessment-section="word-order"]');
    if (lesson.wordOrder === 0) await expect(wordOrder).toBeHidden();
    else {
      await expect(wordOrder).toBeVisible();
      await expect(wordOrder.locator('[data-word-order-counter]')).toHaveText(`1 / ${lesson.wordOrder}`);
    }
    const order = await page.locator('main > section').evaluateAll((sections) => sections.map((section) => (
      section.dataset.lessonExplanation !== undefined
        ? 'explanation'
        : section.dataset.lessonInteractive !== undefined
          ? 'interactive'
          : section.dataset.assessmentSection ?? section.className
    )));
    expect(order.indexOf('explanation')).toBeLessThan(order.indexOf('interactive'));
    expect(order.indexOf('interactive')).toBeLessThan(order.indexOf('exam'));
    if (lesson.wordOrder > 0) {
      expect(order.indexOf('exam')).toBeLessThan(order.indexOf('word-order'));
      expect(order.indexOf('word-order')).toBeLessThan(order.indexOf('lesson-closing'));
    } else {
      expect(order.indexOf('exam')).toBeLessThan(order.indexOf('lesson-closing'));
    }
  }

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('keeps the reordered existing interactions usable', async ({ page }) => {
  const interactive = page.locator('[data-lesson-component]');

  await page.goto('/#lessons/participle-basics');
  await interactive.locator('[data-comparison-chunk-id="l1c-a-modifier"]').click();
  await expect(interactive.locator('[data-comparison-progress]')).toHaveText('You explored all sentence differences.');
  await page.locator('[data-next]').click();
  await interactive.locator('[data-token-id="l1-lamp"]').click();
  await interactive.locator('[data-parts-check]').click();
  await expect(interactive.locator('[data-parts-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();
  for (const [itemId, categoryId] of [
    ['l1-cheerful', 'ordinary-adjective'], ['l1-smiling', 'participle-adjective'], ['l1-child', 'noun'], ['l1-opened', 'verb'],
  ]) {
    await interactive.locator(`[data-classifier-item-id="${itemId}"]`).first().click();
    await interactive.locator(`[data-classifier-category-id="${categoryId}"]`).click();
  }
  await interactive.locator('[data-classifier-check]').click();
  await expect(interactive.locator('[data-classifier-feedback]')).toHaveText(/Correct/);

  await page.goto('/#lessons/ing-vs-pp');
  await interactive.locator('[data-comparison-chunk-id="l2c-a-form"]').click();
  await page.locator('[data-next]').click();
  for (const [itemId, categoryId] of [
    ['l2-smiling-child', 'active'], ['l2-recommended-book', 'passive'], ['l2-fallen-leaves', 'completion'], ['l2-grown-children', 'completion'],
  ]) {
    await interactive.locator(`[data-classifier-item-id="${itemId}"]`).first().click();
    await interactive.locator(`[data-classifier-category-id="${categoryId}"]`).click();
  }
  await interactive.locator('[data-classifier-check]').click();
  await page.locator('[data-next]').click();
  await interactive.locator('[data-error-correction-id="l2e-voice"]').click();
  await interactive.locator('[data-error-option-id="l2e-opt-spoken"]').click();
  await expect(interactive.locator('[data-error-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();
  await interactive.locator('[data-comparison-chunk-id="l2c2-a-form"]').click();
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
  await interactive.locator('[data-comparison-chunk-id="l3c-a-modifier"]').click();
  await expect(interactive.locator('[data-comparison-selection]')).toContainText('Meaning A: 踊っている女の子。 Meaning B: 踊っている女の子。');
  await expect(interactive.locator('[data-comparison-progress]')).toHaveText('You explored all sentence differences.');
});

test('keeps Lesson 4 at six Hidden S-V steps in the required order', async ({ page }) => {
  await page.goto('/#lessons/hidden-sv');
  const interactive = page.locator('[data-lesson-component]');
  const expected = [
    ['PART-L4-P001-MARK', async () => { await interactive.locator('[data-token-id="p1-baby"]').click(); await interactive.locator('[data-parts-check]').click(); }],
    ['PART-L4-P001-REL', async () => { await interactive.locator('[data-sentence-chunk-id="p1-rel-smiling"]').click(); }],
    ['PART-L4-P002-MARK', async () => { await interactive.locator('[data-token-id="p2-language"]').click(); await interactive.locator('[data-parts-check]').click(); }],
    ['PART-L4-P002-REL', async () => { await interactive.locator('[data-sentence-chunk-id="p2-rel-spoken"]').click(); }],
    ['PART-L4-P003-MARK', async () => { await interactive.locator('[data-token-id="p3-students"]').click(); await interactive.locator('[data-parts-check]').click(); }],
    ['PART-L4-P003-REL', async () => { await interactive.locator('[data-sentence-chunk-id="p3-rel-reading"]').click(); }],
  ];
  for (let index = 0; index < expected.length; index += 1) {
    await expect(page.locator('[data-step-title]')).toBeVisible();
    await expect(page.locator('[data-step-label]')).toHaveText(`Step ${index + 1} / 6`);
    await expected[index][1]();
    if (index < expected.length - 1) await page.locator('[data-next]').click();
  }
});

test('keeps Lesson 5 focused on emotion direction', async ({ page }) => {
  await page.goto('/#lessons/emotion-verbs');
  const interactive = page.locator('[data-lesson-component]');
  await interactive.locator('[data-comparison-chunk-id="l5c-a-form"]').click();
  await page.locator('[data-next]').click();
  for (const [itemId, categoryId] of [
    ['l5-exciting-movie', 'emotion-giver'], ['l5-excited-audience', 'emotion-receiver'], ['l5-boring-speaker', 'emotion-giver'],
    ['l5-bored-students', 'emotion-receiver'], ['l5-surprising-news', 'emotion-giver'], ['l5-surprised-teacher', 'emotion-receiver'],
  ]) {
    await interactive.locator(`[data-classifier-item-id="${itemId}"]`).first().click();
    await interactive.locator(`[data-classifier-category-id="${categoryId}"]`).click();
  }
  await interactive.locator('[data-classifier-check]').click();
  await expect(interactive.locator('[data-classifier-feedback]')).toHaveText(/Correct/);
  await page.locator('[data-next]').click();
  await interactive.locator('[data-comparison-chunk-id="l5c2-a-form"]').click();
  await expect(interactive.locator('[data-comparison-progress]')).toHaveText('You explored all sentence differences.');
  await page.locator('[data-next]').click();
  for (const choiceId of ['l5-context-choice-1a', 'l5-context-choice-2a', 'l5-context-choice-3a']) {
    await interactive.locator(`[data-context-choice-id="${choiceId}"]`).click();
    await interactive.locator('[data-context-continue]').click();
  }
  await expect(interactive.locator('[data-context-progress]')).toHaveText('You completed the scenario.');
});

test('keeps exam keyboard focus and optional word-order sections accessible', async ({ page }) => {
  await page.goto('/#lessons/hidden-sv');
  const exam = page.locator('[data-exam-component]');
  await exam.locator('[data-exam-choice-id="l4e1-c1"]').press('Enter');
  await exam.locator('[data-exam-submit]').press('Enter');
  await expect(exam.locator('[data-exam-result]')).toHaveText('○ 正解です');
  await expect(exam.locator('[data-exam-result]')).toBeFocused();
  await exam.locator('[data-exam-reset]').press('Enter');
  await expect(exam.locator('[data-exam-choice-id="l4e1-c1"]')).toBeFocused();

  const wordOrder = page.locator('[data-word-order-component]');
  for (const id of ['l4w1-the', 'l4w1-guide', 'l4w1-waiting', 'l4w1-for-us']) await wordOrder.locator(`[data-word-id="${id}"]`).press('Enter');
  await wordOrder.locator('[data-check]').press('Enter');
  await expect(wordOrder.locator('[data-feedback]')).toHaveText(/Correct/);
  await expect(wordOrder.locator('[data-explanation-steps]')).toBeVisible();
});

test('has no horizontal overflow at 390px on every Lesson', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const lesson of lessons) {
    await page.goto(`/#lessons/${lesson.slug}`);
    await expect(page.locator('[data-lesson-explanation]')).toBeVisible();
    await expect(page.locator('[data-lesson-interactive]')).toBeVisible();
    await expect(page.locator('[data-assessment-section="exam"]')).toBeVisible();
    await expect(page.locator('[data-lesson-closing]')).toBeVisible();
    const layout = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
  }
});
