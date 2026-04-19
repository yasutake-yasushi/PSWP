import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

vi.mock('../../../src/components/CrudGridPage', () => ({
  default: ({ title, onCreate, onUpdate, onDelete, getDeleteMessage, renderModal }: any) => {
    void onCreate?.({});
    void onUpdate?.(1, {});
    void onDelete?.(1);
    void getDeleteMessage?.({
      id: 1,
      itemName: 'x',
      mcaId: 'x',
      mcaPatternId: 'x',
      templateId: 'x',
      eventType: 'x',
      strategyType: 'x',
      portId: 'x',
    });
    void renderModal?.({ mode: 'add', item: undefined, onClose: vi.fn(), onSave: vi.fn() });
    return <div>{title}</div>;
  },
}));

vi.mock('../../../src/api/systemSetting', () => ({
  getSystemSetting: vi.fn().mockResolvedValue({
    id: 1,
    mipsFilePath: 'mips.csv',
    strikeFilePath: 'strike.csv',
    updateUser: 'tester',
    updateTime: '2026-04-19T00:00:00Z',
  }),
  updateSystemSetting: vi.fn().mockResolvedValue({
    id: 1,
    mipsFilePath: 'mips2.csv',
    strikeFilePath: 'strike2.csv',
    updateUser: 'tester2',
    updateTime: '2026-04-19T01:00:00Z',
  }),
}));

vi.mock('../../../src/api/mcas', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/api/mcas')>();
  return {
    ...actual,
    getMCAs: vi.fn().mockResolvedValue([]),
    createMCA: vi.fn().mockResolvedValue(undefined),
    updateMCA: vi.fn().mockResolvedValue(undefined),
    deleteMCA: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('../../../src/api/contractItems', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/api/contractItems')>();
  return {
    ...actual,
    getContractItems: vi.fn().mockResolvedValue([]),
    createContractItem: vi.fn().mockResolvedValue(undefined),
    updateContractItem: vi.fn().mockResolvedValue(undefined),
    deleteContractItem: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('../../../src/api/mcaPatterns', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/api/mcaPatterns')>();
  return {
    ...actual,
    getMCAPatterns: vi.fn().mockResolvedValue([]),
    createMCAPattern: vi.fn().mockResolvedValue(undefined),
    updateMCAPattern: vi.fn().mockResolvedValue(undefined),
    deleteMCAPattern: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('../../../src/api/mailSettings', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/api/mailSettings')>();
  return {
    ...actual,
    getMailSettings: vi.fn().mockResolvedValue([]),
    createMailSetting: vi.fn().mockResolvedValue(undefined),
    updateMailSetting: vi.fn().mockResolvedValue(undefined),
    deleteMailSetting: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('../../../src/api/strategies', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/api/strategies')>();
  return {
    ...actual,
    getStrategies: vi.fn().mockResolvedValue([]),
    createStrategy: vi.fn().mockResolvedValue(undefined),
    updateStrategy: vi.fn().mockResolvedValue(undefined),
    deleteStrategy: vi.fn().mockResolvedValue(undefined),
  };
});

import ContractItemPage from '../../../src/pages/ContractItemPage';
import MCAPage from '../../../src/pages/MCAPage';
import MCAPatternPage from '../../../src/pages/MCAPatternPage';
import MailSettingPage from '../../../src/pages/MailSettingPage';
import StrategyPage from '../../../src/pages/StrategyPage';
import SystemSettingPage from '../../../src/pages/SystemSettingPage';
import PlaceholderPage from '../../../src/pages/PlaceholderPage';
import { getSystemSetting, updateSystemSetting } from '../../../src/api/systemSetting';

describe('pages smoke', () => {
  test('renders CRUD pages via mocked grid shell', async () => {
    render(<ContractItemPage />);
    render(<MCAPage />);
    render(<MCAPatternPage />);
    render(<MailSettingPage />);
    render(<StrategyPage />);

    expect(screen.getByText('Contract Item')).toBeInTheDocument();
    expect(screen.getByText('MCA')).toBeInTheDocument();
    expect(screen.getByText('MCA Pattern')).toBeInTheDocument();
    expect(screen.getByText('Mail Setting')).toBeInTheDocument();
    expect(screen.getByText('Strategy')).toBeInTheDocument();
  });

  test('renders system setting and can save', async () => {
    render(<SystemSettingPage />);

    await screen.findByDisplayValue('mips.csv');
    await userEvent.clear(screen.getByDisplayValue('mips.csv'));
    await userEvent.type(screen.getByPlaceholderText('e.g. C:\\data\\mips\\input.csv'), 'next.csv');
    await userEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(screen.getByText('Saved successfully.')).toBeInTheDocument();
    });
  });

  test('shows error when loading system setting fails', async () => {
    vi.mocked(getSystemSetting).mockRejectedValueOnce(new Error('load failed'));

    render(<SystemSettingPage />);

    expect(await screen.findByText('load failed')).toBeInTheDocument();
  });

  test('shows error when saving system setting fails', async () => {
    vi.mocked(updateSystemSetting).mockRejectedValueOnce(new Error('save failed'));

    render(<SystemSettingPage />);
    await screen.findByDisplayValue('mips.csv');

    await userEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(await screen.findByText('save failed')).toBeInTheDocument();
  });

  test('renders placeholder page', () => {
    render(<PlaceholderPage title="Test Page" />);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('このページは現在開発中です。')).toBeInTheDocument();
  });
});