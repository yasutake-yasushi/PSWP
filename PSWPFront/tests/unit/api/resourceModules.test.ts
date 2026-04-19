import { describe, expect, test, vi } from 'vitest';

describe('resource api modules', () => {
  test('contractItems exports are loadable', async () => {
    const mod = await import('../../../src/api/contractItems');
    expect(typeof mod.getContractItems).toBe('function');
    expect(typeof mod.getContractItem).toBe('function');
    expect(typeof mod.createContractItem).toBe('function');
    expect(typeof mod.updateContractItem).toBe('function');
    expect(typeof mod.deleteContractItem).toBe('function');
  });

  test('mailSettings exports are loadable', async () => {
    const mod = await import('../../../src/api/mailSettings');
    expect(typeof mod.getMailSettings).toBe('function');
    expect(typeof mod.getMailSetting).toBe('function');
    expect(typeof mod.createMailSetting).toBe('function');
    expect(typeof mod.updateMailSetting).toBe('function');
    expect(typeof mod.deleteMailSetting).toBe('function');
  });

  test('mcas exports are loadable', async () => {
    const mod = await import('../../../src/api/mcas');
    expect(typeof mod.getMCAs).toBe('function');
    expect(typeof mod.getMCA).toBe('function');
    expect(typeof mod.createMCA).toBe('function');
    expect(typeof mod.updateMCA).toBe('function');
    expect(typeof mod.deleteMCA).toBe('function');
  });

  test('mcaPatterns exports are loadable', async () => {
    const mod = await import('../../../src/api/mcaPatterns');
    expect(typeof mod.getMCAPatterns).toBe('function');
    expect(typeof mod.getMCAPattern).toBe('function');
    expect(typeof mod.createMCAPattern).toBe('function');
    expect(typeof mod.updateMCAPattern).toBe('function');
    expect(typeof mod.deleteMCAPattern).toBe('function');
  });

  test('strategies exports are loadable', async () => {
    const mod = await import('../../../src/api/strategies');
    expect(typeof mod.getStrategies).toBe('function');
    expect(typeof mod.createStrategy).toBe('function');
    expect(typeof mod.updateStrategy).toBe('function');
    expect(typeof mod.deleteStrategy).toBe('function');
  });
});

vi.mock('../../../src/api/http', () => ({
  apiGet: vi.fn(),
  apiPut: vi.fn(),
}));

describe('systemSetting api module', () => {
  test('getSystemSetting delegates to apiGet', async () => {
    const { apiGet } = await import('../../../src/api/http');
    const { getSystemSetting } = await import('../../../src/api/systemSetting');
    (apiGet as any).mockResolvedValue({ id: 1 });

    await getSystemSetting();

    expect(apiGet).toHaveBeenCalledWith('/api/systemsetting', 'Failed to fetch system setting');
  });

  test('updateSystemSetting delegates to apiPut', async () => {
    const { apiPut } = await import('../../../src/api/http');
    const { updateSystemSetting } = await import('../../../src/api/systemSetting');
    (apiPut as any).mockResolvedValue({ id: 1 });

    await updateSystemSetting({ mipsFilePath: 'a', strikeFilePath: 'b' });

    expect(apiPut).toHaveBeenCalledWith(
      '/api/systemsetting',
      { mipsFilePath: 'a', strikeFilePath: 'b' },
      'Failed to update system setting'
    );
  });
});