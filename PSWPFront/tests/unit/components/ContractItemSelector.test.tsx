import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import ContractItemSelector from '../../../src/components/ContractItemSelector';

vi.mock('../../../src/api/contractItems', () => ({
  getContractItems: vi.fn().mockResolvedValue([
    { id: 1, itemName: 'ItemA' },
    { id: 2, itemName: 'ItemB' },
  ]),
}));

describe('ContractItemSelector', () => {
  test('loads items and moves selection to right list', async () => {
    const onOk = vi.fn();

    render(<ContractItemSelector selected={[]} onClose={vi.fn()} onOk={onOk} />);

    await screen.findByText('ItemA');
    await userEvent.click(screen.getByText('ItemA'));
    await userEvent.click(screen.getByRole('button', { name: '▶' }));

    await waitFor(() => {
      expect(screen.getAllByText('ItemA').length).toBeGreaterThan(0);
    });

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onOk).toHaveBeenCalledWith(['ItemA']);
  });
});