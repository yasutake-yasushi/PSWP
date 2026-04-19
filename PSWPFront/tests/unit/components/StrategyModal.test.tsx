import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import StrategyModal from '../../../src/components/StrategyModal';

describe('StrategyModal', () => {
  test('shows required error when strategy is empty', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<StrategyModal mode="add" onSave={onSave} onClose={onClose} />);

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(screen.getByText('Strategy is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('shows required error when port id is blank', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<StrategyModal mode="add" onSave={onSave} onClose={vi.fn()} />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'Lending');
    await userEvent.type(screen.getByPlaceholderText('Port ID'), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(screen.getByText('Port ID is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('submits valid input and closes modal', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<StrategyModal mode="add" onSave={onSave} onClose={onClose} />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'Borrowing');
    await userEvent.type(screen.getByPlaceholderText('Port ID'), 'PORT001');
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({ strategyType: 'Borrowing', portId: 'PORT001' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('view mode is readonly and has close button', () => {
    render(
      <StrategyModal
        mode="view"
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
        item={{
          id: 1,
          strategyType: 'Lending',
          portId: 'PORTX',
          updateUser: 'tester',
          updateTime: '2026-04-19T00:00:00Z',
        }}
      />
    );

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByDisplayValue('PORTX')).toHaveAttribute('readonly');
  });
});