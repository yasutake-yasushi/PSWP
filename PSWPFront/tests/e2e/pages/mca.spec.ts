import { expect, test } from '@playwright/test';
import { openMca, setupApi } from '../support/guiTestSetup';

test.describe('MCA', () => {
  test('shows validation when MCA ID is empty', async ({ page }) => {
    await setupApi(page);
    await openMca(page);

    await page.getByRole('button', { name: '+ Add Row' }).click();
    const modal = page.locator('.modal-box').last();
    await modal.getByRole('button', { name: 'OK' }).click();

    await expect(page.getByText('MCA ID is required')).toBeVisible();
  });

  test('can create MCA with required fields', async ({ page }) => {
    const capture = await setupApi(page);
    await openMca(page);

    await page.getByRole('button', { name: '+ Add Row' }).click();
    const modal = page.locator('.modal-box').last();

    await modal.locator('input').nth(0).fill('MCA777');
    await modal.locator('input').nth(1).fill('CP777');
    await modal.getByRole('button', { name: 'OK' }).click();

    await expect.poll(() => capture.createdMca?.mcaId ?? null).toBe('MCA777');
  });
});
