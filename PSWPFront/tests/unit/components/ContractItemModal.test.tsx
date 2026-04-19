import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import ContractItemModal from '../../../src/components/ContractItemModal';

describe('ContractItemModal', () => {
  test('shows required error for empty category', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<ContractItemModal mode="add" onSave={onSave} onClose={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText('英数字のみ (例: PaymentTerm)'), 'PaymentTerm');
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('shows required error for empty item name', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<ContractItemModal mode="add" onSave={onSave} onClose={vi.fn()} />);

    await userEvent.selectOptions(screen.getAllByRole('combobox')[0], 'Contract');
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(screen.getByText('Item Name is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('rejects non-alphanumeric item name input', async () => {
    render(<ContractItemModal mode="add" onSave={vi.fn().mockResolvedValue(undefined)} onClose={vi.fn()} />);

    const input = screen.getByPlaceholderText('英数字のみ (例: PaymentTerm)') as HTMLInputElement;
    await userEvent.type(input, 'ABC');
    await userEvent.type(input, '!');

    expect(input.value).toBe('ABC');
  });

  test('submits valid payload', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<ContractItemModal mode="add" onSave={onSave} onClose={onClose} />);

    await userEvent.selectOptions(screen.getAllByRole('combobox')[0], 'Contract');
    await userEvent.type(screen.getByPlaceholderText('英数字のみ (例: PaymentTerm)'), 'PaymentTerm');
    await userEvent.selectOptions(screen.getAllByRole('combobox')[1], 'String');
    await userEvent.type(screen.getByPlaceholderText('英数字のみ (複数行入力可)'), 'Net30,Net45');
    await userEvent.type(screen.getByPlaceholderText('英数字のみ (例: Net30)'), 'Net30');
    await userEvent.type(screen.getByPlaceholderText('Enter description'), 'desc');

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        category: 'Contract',
        itemName: 'PaymentTerm',
        dataType: 'String',
        values: 'Net30,Net45',
        defaultValue: 'Net30',
        description: 'desc',
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});