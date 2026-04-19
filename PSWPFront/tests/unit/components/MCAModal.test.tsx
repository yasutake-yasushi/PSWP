import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import MCAModal from '../../../src/components/MCAModal';

vi.mock('../../../src/components/ContractItemSelector', () => ({
  default: ({ onClose, onOk }: { onClose: () => void; onOk: (names: string[]) => void }) => (
    <div>
      <button type="button" onClick={() => onOk(['PaymentTerm'])}>Mock Select</button>
      <button type="button" onClick={onClose}>Mock Close</button>
    </div>
  ),
}));

describe('MCAModal', () => {
  test('shows required error when mca id is empty', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<MCAModal mode="add" onSave={onSave} onClose={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(screen.getByText('MCA ID is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('allows only alphanumeric input for mca id and cpty', async () => {
    render(<MCAModal mode="add" onSave={vi.fn().mockResolvedValue(undefined)} onClose={vi.fn()} />);

    const mcaIdInput = screen.getAllByPlaceholderText('Alphanumeric only')[0] as HTMLInputElement;
    const cptyInput = screen.getAllByPlaceholderText('Alphanumeric only')[1] as HTMLInputElement;

    await userEvent.type(mcaIdInput, 'MCA001');
    await userEvent.type(mcaIdInput, '!');
    await userEvent.type(cptyInput, 'CP001');
    await userEvent.type(cptyInput, '@');

    expect(mcaIdInput.value).toBe('MCA001');
    expect(cptyInput.value).toBe('CP001');
  });

  test('can update contract items via selector and submit', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<MCAModal mode="add" onSave={onSave} onClose={onClose} />);

    const [mcaIdInput, cptyInput] = screen.getAllByPlaceholderText('Alphanumeric only');
    await userEvent.type(mcaIdInput, 'MCA001');
    await userEvent.type(cptyInput, 'CP001');

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Mock Select' }));

    expect(screen.getByText('PaymentTerm')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        mcaId: 'MCA001',
        cpty: 'CP001',
        agreementDate: null,
        executionDate: null,
        contractItems: JSON.stringify(['PaymentTerm']),
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('view mode hides edit and submit buttons', () => {
    render(
      <MCAModal
        mode="view"
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
        item={{
          id: 1,
          mcaId: 'MCA001',
          cpty: 'CP001',
          agreementDate: null,
          executionDate: null,
          contractItems: JSON.stringify(['PaymentTerm']),
          updateUser: 'tester',
          updateTime: '2026-04-19T00:00:00Z',
        }}
      />
    );

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
  });
});