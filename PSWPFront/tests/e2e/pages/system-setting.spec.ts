import { expect, test } from '@playwright/test';
import { openSystemSetting, setupApi } from '../support/guiTestSetup';

test.describe('System Setting', () => {
  test('loads initial values and updates paths', async ({ page }) => {
    const capture = await setupApi(page);
    await openSystemSetting(page);

    const content = page.locator('main.content');
    await expect(content.locator('input').nth(0)).toHaveValue('C:\\data\\mips\\input.csv');
    await expect(content.locator('input').nth(1)).toHaveValue('C:\\data\\strike\\input.csv');

    await content.locator('input').nth(0).fill('D:\\batch\\mips.csv');
    await content.locator('input').nth(1).fill('D:\\batch\\strike.csv');
    await content.getByRole('button', { name: 'Update' }).click();

    await expect(content.getByText('Saved successfully.')).toBeVisible();
    await expect.poll(() => capture.updatedSystemSetting?.mipsFilePath ?? null).toBe('D:\\batch\\mips.csv');
  });

  test('shows error message when update API fails', async ({ page }) => {
    await setupApi(page, { failSystemUpdate: true });
    await openSystemSetting(page);

    const content = page.locator('main.content');
    await content.getByRole('button', { name: 'Update' }).click();

    await expect(content.getByText('Failed to update system setting')).toBeVisible();
  });
});
