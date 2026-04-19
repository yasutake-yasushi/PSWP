import { expect, test } from '@playwright/test';
import { openMailSetting, setupApi } from '../support/guiTestSetup';

test.describe('Mail Setting', () => {
  test('shows validation when event type is empty', async ({ page }) => {
    await setupApi(page);
    await openMailSetting(page);

    await page.getByRole('button', { name: '+ Add Row' }).click();
    const modal = page.locator('.modal-box').last();
    await modal.getByRole('button', { name: 'OK' }).click();

    await expect(page.getByText('Event Type is required')).toBeVisible();
  });

  test('can create mail setting with message', async ({ page }) => {
    const capture = await setupApi(page);
    await openMailSetting(page);

    await page.getByRole('button', { name: '+ Add Row' }).click();
    const modal = page.locator('.modal-box').last();

    await modal.locator('select').first().selectOption('OTCCross');
    await modal.locator('input').nth(0).fill('TMP001');
    await modal.getByRole('button', { name: 'Message' }).click();
    await modal.locator('textarea').fill('hello from playwright');
    await modal.getByRole('button', { name: 'OK' }).click();

    await expect.poll(() => capture.createdMailSetting?.templateId ?? null).toBe('TMP001');
  });
});
