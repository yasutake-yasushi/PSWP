import { expect, Page } from '@playwright/test';

export type ContractItemInput = {
  category: string;
  itemName: string;
  dataType: string;
  values?: string;
  defaultValue?: string;
  description?: string;
};

export type McaInput = {
  mcaId: string;
  cpty: string;
  agreementDate: string | null;
  executionDate: string | null;
  contractItems: string;
};

export type McaPatternInput = {
  mcaPatternId: string;
  mcaId: string;
  contractItems: string;
  tradeItems: string;
  specialNotes: string | null;
};

export type MailSettingInput = {
  eventType: string;
  templateId: string;
  description: string;
  addresses: string;
  message: string;
};

export type SetupOptions = {
  failSystemUpdate?: boolean;
};

export type Capture = {
  createdContractItem: ContractItemInput | null;
  createdMca: McaInput | null;
  createdMcaPattern: McaPatternInput | null;
  createdMailSetting: MailSettingInput | null;
  updatedSystemSetting: { mipsFilePath: string; strikeFilePath: string } | null;
};

export async function setupApi(page: Page, options: SetupOptions = {}): Promise<Capture> {
  const now = '2026-04-19T00:00:00.000Z';
  const capture: Capture = {
    createdContractItem: null,
    createdMca: null,
    createdMcaPattern: null,
    createdMailSetting: null,
    updatedSystemSetting: null,
  };

  const contractItems = [
    {
      id: 1,
      category: 'Contract',
      itemName: 'PaymentTerm',
      dataType: 'String',
      values: '',
      defaultValue: '',
      description: '',
      updateUser: 'seed',
      updateTime: now,
    },
  ];

  const mcas = [
    {
      id: 1,
      mcaId: 'MCA001',
      cpty: 'CP001',
      agreementDate: null,
      executionDate: null,
      contractItems: JSON.stringify(['PaymentTerm']),
      updateUser: 'seed',
      updateTime: now,
    },
  ];

  const mcaPatterns: unknown[] = [];
  const mailSettings: unknown[] = [];

  let systemSetting = {
    id: 1,
    mipsFilePath: 'C:\\data\\mips\\input.csv',
    strikeFilePath: 'C:\\data\\strike\\input.csv',
    updateUser: 'seed',
    updateTime: now,
  };

  await page.route('http://localhost:5232/api/**', async route => {
    const req = route.request();
    const method = req.method();
    const pathname = new URL(req.url()).pathname.toLowerCase();

    const json = async (body: unknown, status = 200) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    };

    if (pathname === '/api/contractitems' && method === 'GET') return json(contractItems);
    if (pathname === '/api/contractitems' && method === 'POST') {
      const payload = req.postDataJSON() as ContractItemInput;
      capture.createdContractItem = payload;
      return json({ id: 2, ...payload, updateUser: 'e2e', updateTime: now }, 201);
    }

    if (pathname === '/api/mcas' && method === 'GET') return json(mcas);
    if (pathname === '/api/mcas' && method === 'POST') {
      const payload = req.postDataJSON() as McaInput;
      capture.createdMca = payload;
      return json({ id: 2, ...payload, updateUser: 'e2e', updateTime: now }, 201);
    }

    if (pathname === '/api/mcapatterns' && method === 'GET') return json(mcaPatterns);
    if (pathname === '/api/mcapatterns' && method === 'POST') {
      const payload = req.postDataJSON() as McaPatternInput;
      capture.createdMcaPattern = payload;
      return json({ id: 1, ...payload, updateUser: 'e2e', updateTime: now }, 201);
    }

    if (pathname === '/api/mailsettings' && method === 'GET') return json(mailSettings);
    if (pathname === '/api/mailsettings' && method === 'POST') {
      const payload = req.postDataJSON() as MailSettingInput;
      capture.createdMailSetting = payload;
      return json({ id: 1, ...payload, updateUser: 'e2e', updateTime: now }, 201);
    }

    if (pathname === '/api/strategies' && method === 'GET') return json([]);

    if (pathname === '/api/systemsetting' && method === 'GET') return json(systemSetting);
    if (pathname === '/api/systemsetting' && method === 'PUT') {
      if (options.failSystemUpdate) {
        await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'update failed' }) });
        return;
      }
      const payload = req.postDataJSON() as { mipsFilePath: string; strikeFilePath: string };
      capture.updatedSystemSetting = payload;
      systemSetting = { ...systemSetting, ...payload, updateUser: 'e2e', updateTime: now };
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

export async function openContractItem(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /definition/i }).click();
  await page.getByRole('link', { name: 'Contract Item' }).click();
  await expect(page).toHaveURL(/\/master\/definition\/contract-item$/);
}

export async function openMca(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /definition/i }).click();
  await page.getByRole('link', { name: 'MCA', exact: true }).click();
  await expect(page).toHaveURL(/\/master\/definition\/mca$/);
}

export async function openMcaPattern(page: Page) {
  await page.goto('/master/mca-pattern');
  await expect(page).toHaveURL(/\/master\/mca-pattern$/);
}

export async function openMailSetting(page: Page) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Mail Setting' }).click();
  await expect(page).toHaveURL(/\/master\/mail-setting$/);
}

export async function openSystemSetting(page: Page) {
  await page.goto('/');
  await page.getByRole('link', { name: 'System Setting' }).click();
  await expect(page).toHaveURL(/\/system\/setting$/);
}
