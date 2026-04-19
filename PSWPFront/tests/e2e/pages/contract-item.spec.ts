import { expect, test } from '@playwright/test';
import { openContractItem, setupApi } from '../support/guiTestSetup';

test.describe('Contract Item', () => {
  test('shows validation when required fields are empty', async ({ page }) => {
    await setupApi(page);
    await openContractItem(page);

    await page.getByRole('button', { name: '+ Add Row' }).click();
    const modal = page.locator('.modal-box').last();
    await modal.getByRole('button', { name: 'OK' }).click();

    await expect(page.getByText('Category is required')).toBeVisible();
  });

  test('can create a new contract item', async ({ page }) => {
    const capture = await setupApi(page);
    await openContractItem(page);

    await page.getByRole('button', { name: '+ Add Row' }).click();
    const modal = page.locator('.modal-box').last();

    await modal.locator('select').first().selectOption('Contract');
    await modal.locator('input').first().fill('SettlementDate');
    await modal.getByRole('button', { name: 'OK' }).click();

    await expect.poll(() => capture.createdContractItem?.itemName ?? null).toBe('SettlementDate');
  });
});
