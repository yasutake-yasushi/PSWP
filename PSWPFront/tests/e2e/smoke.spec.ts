import { expect, test } from '@playwright/test';

type StrategyRow = {
  id: number;
  strategyType: string;
  portId: string;
  updateUser: string;
  updateTime: string;
};

type RequestCapture = {
  createdStrategy: { strategyType: string; portId: string } | null;
  deletedStrategyId: number | null;
  updatedSystemSetting: { mipsFilePath: string; strikeFilePath: string } | null;
};

async function mockApi(page: Parameters<typeof test>[0]['page']): Promise<RequestCapture> {
  const now = '2026-04-19T00:00:00.000Z';
  const capture: RequestCapture = {
    createdStrategy: null,
    deletedStrategyId: null,
    updatedSystemSetting: null,
  };

  const strategies: StrategyRow[] = [
    { id: 1, strategyType: 'Lending', portId: 'PORT01', updateUser: 'seed', updateTime: now },
  ];

  let systemSetting = {
    id: 1,
    mipsFilePath: 'C:\\data\\mips\\input.csv',
    strikeFilePath: 'C:\\data\\strike\\input.csv',
    updateUser: 'seed',
    updateTime: now,
  };

  await page.route('http://localhost:5232/api/**', async route => {
    const request = route.request();
    const method = request.method();
    const pathname = new URL(request.url()).pathname.toLowerCase();

    const json = async (body: unknown, status = 200) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    };

    if (pathname === '/api/contractitems' && method === 'GET') return json([]);
    if (pathname === '/api/mcas' && method === 'GET') return json([]);
    if (pathname === '/api/mcapatterns' && method === 'GET') return json([]);
    if (pathname === '/api/mailsettings' && method === 'GET') return json([]);

    if (pathname === '/api/strategies' && method === 'GET') return json(strategies);
    if (pathname === '/api/strategies' && method === 'POST') {
      const payload = request.postDataJSON() as { strategyType: string; portId: string };
      capture.createdStrategy = payload;

      const created: StrategyRow = {
        id: Math.max(...strategies.map(s => s.id), 0) + 1,
        strategyType: payload.strategyType,
        portId: payload.portId,
        updateUser: 'e2e',
        updateTime: now,
      };
      strategies.push(created);
      return json(created, 201);
    }
    if (pathname.startsWith('/api/strategies/') && method === 'DELETE') {
      const id = Number(pathname.split('/').pop());
      capture.deletedStrategyId = id;
      const idx = strategies.findIndex(s => s.id === id);
      if (idx >= 0) strategies.splice(idx, 1);
      await route.fulfill({ status: 204 });
      return;
    }

    if (pathname === '/api/systemsetting' && method === 'GET') return json(systemSetting);
    if (pathname === '/api/systemsetting' && method === 'PUT') {
      const payload = request.postDataJSON() as { mipsFilePath: string; strikeFilePath: string };
      capture.updatedSystemSetting = payload;
      systemSetting = {
        ...systemSetting,
        ...payload,
        updateUser: 'e2e',
        updateTime: now,
      };
      return json(systemSetting);
    }

    await route.fulfill({
      status: 501,
      contentType: 'application/json',
      body: JSON.stringify({ message: `Unhandled API route: ${method} ${pathname}` }),
    });
  });

  return capture;
}

test('dashboard is shown on top page', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
  await expect(page.getByText('PSWP 社内業務システムへようこそ。')).toBeVisible();
});

test('can navigate from sidebar to all major pages', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');

  const content = page.locator('main.content');

  await page.getByRole('button', { name: /definition/i }).click();

  await page.getByRole('link', { name: 'Contract Item' }).click();
  await expect(page).toHaveURL(/\/master\/definition\/contract-item$/);
  await expect(content.getByRole('heading', { name: /contract item/i })).toBeVisible();

  await page.getByRole('link', { name: 'MCA', exact: true }).click();
  await expect(page).toHaveURL(/\/master\/definition\/mca$/);
  await expect(content.getByRole('heading', { name: /^mca$/i })).toBeVisible();

  await page.getByRole('link', { name: 'MCA Pattern' }).click();
  await expect(page).toHaveURL(/\/master\/mca-pattern$/);
  await expect(content.getByRole('heading', { name: /mca pattern/i })).toBeVisible();

  await page.getByRole('link', { name: 'Mail Setting' }).click();
  await expect(page).toHaveURL(/\/master\/mail-setting$/);
  await expect(content.getByRole('heading', { name: /mail setting/i })).toBeVisible();

  await page.getByRole('link', { name: 'Strategy' }).click();
  await expect(page).toHaveURL(/\/master\/strategy$/);
  await expect(content.getByRole('heading', { name: /strategy/i })).toBeVisible();

  await page.getByRole('link', { name: 'System Setting' }).click();
  await expect(page).toHaveURL(/\/system\/setting$/);
  await expect(content.getByRole('heading', { name: /system setting/i })).toBeVisible();
});

test('can create strategy from modal', async ({ page }) => {
  const capture = await mockApi(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Strategy' }).click();
  await expect(page).toHaveURL(/\/master\/strategy$/);

  await page.getByRole('button', { name: '+ Add Row' }).click();
  await expect(page.getByText(/strategy\s*[—-]\s*add/i)).toBeVisible();

  const modal = page.locator('.modal-box').last();
  await modal.locator('select').first().selectOption('Borrowing');
  await modal.locator('input').first().fill('PORT99');
  await modal.getByRole('button', { name: 'OK' }).click();

  await expect.poll(() => capture.createdStrategy?.portId ?? null).toBe('PORT99');
});

test('can delete strategy with confirmation dialog', async ({ page }) => {
  const capture = await mockApi(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Strategy' }).click();
  await expect(page).toHaveURL(/\/master\/strategy$/);

  await page.getByRole('button', { name: 'Delete' }).first().click();
  await expect(page.getByText('Delete Confirmation')).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).last().click();

  await expect.poll(() => capture.deletedStrategyId).toBe(1);
});

test('can update system setting', async ({ page }) => {
  const capture = await mockApi(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'System Setting' }).click();
  await expect(page).toHaveURL(/\/system\/setting$/);

  const content = page.locator('main.content');
  await content.locator('input').nth(0).fill('D:\\files\\mips.csv');
  await content.locator('input').nth(1).fill('D:\\files\\strike.csv');
  await content.getByRole('button', { name: 'Update' }).click();

  await expect(content.getByText('Saved successfully.')).toBeVisible();
  await expect.poll(() => capture.updatedSystemSetting?.mipsFilePath ?? null).toBe('D:\\files\\mips.csv');
});

test('shows validation message when Strategy form is empty', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Strategy' }).click();
  await expect(page).toHaveURL(/\/master\/strategy$/);

  await page.getByRole('button', { name: '+ Add Row' }).click();

  const modal = page.locator('.modal-box').last();
  await modal.getByRole('button', { name: 'OK' }).click();

  await expect(page.getByText('Strategy is required')).toBeVisible();
});