import { expect, test } from '@playwright/test';

test('Lesson 6 Practical exposes the 13-question OCR-based practice flow', async ({ page }) => {
  await page.goto('/#lessons/integrated-judgment');
  const practical = page.locator('[data-assessment-section="practical"]');

  await expect(practical).toBeVisible();
  await expect(practical.locator('[data-practical-counter]')).toHaveText('1 / 13');
  await expect(practical.locator('[data-practice-choice-id]')).toHaveCount(2);
  await expect(practical.locator('.exam-mc-stem')).toHaveText('「割れた窓」を英語にすると？');

  for (let index = 0; index < 3; index += 1) await practical.locator('[data-practical-next]').click();
  await expect(practical.locator('[data-practical-counter]')).toHaveText('4 / 13');
  await expect(practical.locator('.exam-mc-stem')).toHaveText('For more information about the party, please see the (     ) PDF file.');
  await expect(practical.locator('[data-practice-choice-id="l6p101-c2"]')).toHaveText(/attached/);
  await expect(practical).not.toContainText('OCRから復元しました');

  await practical.locator('[data-practice-choice-id="l6p101-c2"]').click();
  await practical.locator('[data-practice-submit]').click();
  await expect(practical.locator('[data-practice-result]')).toHaveText('○ 正解です');

  for (let index = 0; index < 3; index += 1) await practical.locator('[data-practical-next]').click();
  await expect(practical.locator('[data-practical-counter]')).toHaveText('7 / 13');
  await expect(practical.locator('[data-practice-choice-id="l6p104-c2"]')).toHaveText(/drowned/);
});
