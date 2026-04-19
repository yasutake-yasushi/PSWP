import { expect, test } from '@playwright/test';
import { openMcaPattern, setupApi } from '../support/guiTestSetup';

test.describe('MCA Pattern', () => {
  test('shows validation when pattern id is empty', async ({ page }) => {
    await setupApi(page);
    await openMcaPattern(page);

    await page.getByRole('button', { name: '+ Add Row' }).click();
    const modal = page.locator('.modal-box').last();
    await modal.getByRole('button', { name: 'OK' }).click();

    await expect(page.getByText('MCA Pattern ID is required')).toBeVisible();
  });

  test('can create MCA pattern by selecting MCA ID', async ({ page }) => {
    const capture = await setupApi(page);
    await openMcaPattern(page);

    await page.getByRole('button', { name: '+ Add Row' }).click();
    const modal = page.locator('.modal-box').last();

    await modal.locator('input').first().fill('PTN001');
    await modal.locator('select').first().selectOption('MCA001');
    await modal.getByRole('button', { name: 'Special Notes' }).click();
    await modal.locator('textarea').fill('note for E2E');
    await modal.getByRole('button', { name: 'OK' }).click();

    await expect.poll(() => capture.createdMcaPattern?.mcaId ?? null).toBe('MCA001');
  });
});
