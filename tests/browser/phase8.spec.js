import { expect, test } from '@playwright/test';

test('Lesson 6 practical mode exposes the staged 13-question flow', async ({ page }) => {
  await page.goto('/#lessons/integrated-judgment');

  await expect(page.locator('h1')).toHaveText('実践演習 — 入試問題で分詞を見抜く');
  await expect(page.locator('[data-practice-strategy]')).toBeVisible();
  const practical = page.locator('[data-assessment-section="practical"]');
  await expect(practical).toBeVisible();
  await expect(page.locator('[data-lesson-interactive]')).toHaveCount(0);
  await expect(page.locator('[data-assessment-section="exam"]')).toHaveCount(0);
  await expect(page.locator('[data-assessment-section="word-order"]')).toHaveCount(0);
  await expect(practical.locator('[data-practical-counter]')).toHaveText('1 / 13');
  await expect(practical.locator('[data-practical-stage]')).toHaveText('Stage 1 / 3');
  await expect(practical.locator('[data-practical-stage-title]')).toHaveText('Quick Check');

  for (let index = 0; index < 3; index += 1) await practical.locator('[data-practical-next]').click();
  await expect(practical.locator('[data-practical-counter]')).toHaveText('4 / 13');
  await expect(practical.locator('[data-practical-stage]')).toHaveText('Stage 2 / 3');
  await expect(practical.locator('[data-practical-stage-title]')).toHaveText('-ing / p.p. を判断する');

  for (let index = 0; index < 5; index += 1) await practical.locator('[data-practical-next]').click();
  await expect(practical.locator('[data-practical-counter]')).toHaveText('9 / 13');
  await expect(practical.locator('[data-practical-stage]')).toHaveText('Stage 3 / 3');
  await expect(practical.locator('[data-practical-stage-title]')).toHaveText('文構造から判断する');

  await expect(practical.locator('.exam-mc-choice-text')).toHaveText(['describing', 'described']);
  await practical.locator('[data-exam-choice-id="l6p106-c2"]').click();
  await practical.locator('[data-exam-submit]').click();
  const analysis = practical.locator('[data-practice-analysis]');
  await expect(analysis).toBeVisible();
  await expect(analysis).toContainText('seem');
  await expect(analysis).toContainText('The steps');
  await expect(analysis).toContainText('describe');
  await expect(analysis).toContainText('passive');
  await expect(analysis).toContainText('described');

  for (let index = 0; index < 3; index += 1) await practical.locator('[data-practical-next]').click();
  await expect(practical.locator('[data-practical-counter]')).toHaveText('12 / 13');
  await expect(practical.locator('.exam-mc-stem')).toContainText('English words');
  await practical.locator('[data-exam-choice-id="l6p109-c2"]').click();
  await practical.locator('[data-exam-submit]').click();
  await expect(practical.locator('[data-practice-analysis]')).toContainText('has');
  await expect(practical.locator('[data-practice-analysis]')).toContainText('consist of');
  await expect(practical.locator('[data-practice-analysis]')).toContainText('consisting of');
});

test('Lesson 6 practical mode has no horizontal overflow at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#lessons/integrated-judgment');
  await expect(page.locator('[data-practice-strategy]')).toBeVisible();
  const layout = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
});
