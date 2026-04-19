import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import MCAPatternModal from '../../../src/components/MCAPatternModal';

describe('MCAPatternModal', () => {
  const mcas = [
    {
      id: 1,
      mcaId: 'MCA001',
      cpty: 'CP',
      agreementDate: null,
      executionDate: null,
      contractItems: JSON.stringify(['ContractA', 'TradeA']),
      updateUser: 'u',
      updateTime: '2026-01-01',
    },
  ];

  const contractItemMaster = [
    { id: 1, category: 'Contract', itemName: 'ContractA', dataType: 'String', updateUser: 'u', updateTime: 't' },
    { id: 2, category: 'Trade', itemName: 'TradeA', dataType: 'String', updateUser: 'u', updateTime: 't' },
    { id: 3, category: 'Trade', itemName: 'FlagItem', dataType: 'Bool', values: 'Yes\nNo', updateUser: 'u', updateTime: 't' },
  ];

  test('validates required fields', async () => {
    render(
      <MCAPatternModal
        mode="add"
        mcas={mcas as any}
        contractItemMaster={contractItemMaster as any}
        onClose={vi.fn()}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.getByText('MCA Pattern ID is required')).toBeInTheDocument();
  });

  test('submits payload after selecting mca', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <MCAPatternModal
        mode="add"
        mcas={mcas as any}
        contractItemMaster={contractItemMaster as any}
        onClose={onClose}
        onSave={onSave}
      />
    );

    await userEvent.type(screen.getByPlaceholderText('Alphanumeric only'), 'PAT001');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'MCA001');
    await userEvent.click(screen.getByRole('button', { name: 'Special Notes' }));
    await userEvent.type(screen.getByPlaceholderText('Free text'), 'note');
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        mcaPatternId: 'PAT001',
        mcaId: 'MCA001',
        contractItems: JSON.stringify([{ itemName: 'ContractA', value: '' }]),
        tradeItems: JSON.stringify([{ itemName: 'TradeA', value: '' }]),
        specialNotes: 'note',
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('shows error when save fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('save failed'));

    await act(async () => {
      render(
        <MCAPatternModal
          mode="add"
          mcas={mcas as any}
          contractItemMaster={contractItemMaster as any}
          onClose={vi.fn()}
          onSave={onSave}
        />
      );
    });

    await userEvent.type(screen.getByPlaceholderText('Alphanumeric only'), 'PAT001');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'MCA001');
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    await waitFor(() => {
      expect(screen.getByText('save failed')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled();
    });
  });

  test('supports add/remove rows and bool select value input', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    const item = {
      id: 1,
      mcaPatternId: 'PATOLD',
      mcaId: 'MCA001',
      contractItems: JSON.stringify([{ itemName: 'ContractA', value: '' }]),
      tradeItems: JSON.stringify([{ itemName: 'FlagItem', value: '' }]),
      specialNotes: null,
      updateUser: 'u',
      updateTime: 't',
    };

    render(
      <MCAPatternModal
        mode="edit"
        item={item as any}
        mcas={mcas as any}
        contractItemMaster={contractItemMaster as any}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Trade' }));
    await userEvent.selectOptions(screen.getAllByRole('combobox')[1], 'Yes');

    await userEvent.click(screen.getAllByRole('button', { name: '+ Add Row' })[0]);
    await userEvent.click(screen.getAllByRole('button', { name: '✕' })[0]);

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });
});