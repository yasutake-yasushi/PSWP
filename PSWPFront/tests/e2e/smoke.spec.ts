import { expect, test } from '@playwright/test';

test('dashboard is shown on top page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
  await expect(page.getByText('PSWP 社内業務システムへようこそ。')).toBeVisible();
});

test('can navigate from sidebar to strategy page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Strategy' }).click();

  await expect(page).toHaveURL(/\/master\/strategy$/);
  await expect(page.getByRole('heading', { name: 'Strategy' })).toBeVisible();
});