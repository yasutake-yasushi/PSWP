import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import CrudGridPage from '../../../src/components/CrudGridPage';

vi.mock('ag-grid-enterprise', () => ({
  AllEnterpriseModule: {},
}));

vi.mock('ag-grid-community', () => ({
  ModuleRegistry: {
    registerModules: vi.fn(),
  },
  themeQuartz: {},
}));

vi.mock('ag-grid-react', async () => {
  const ReactModule = await import('react');
  const FakeGrid = ({ onGridReady, columnDefs }: any) => {
    ReactModule.useEffect(() => {
      onGridReady?.({});
    }, [onGridReady]);

    const actionCol = (columnDefs ?? []).find((c: any) => c.headerName === 'Actions');
    return (
      <div>
        {actionCol?.cellRenderer?.({ data: { id: 1, name: 'row1' } })}
      </div>
    );
  };

  return {
    AgGridReact: FakeGrid,
  };
});

describe('CrudGridPage', () => {
  test('loads rows, opens modal, and confirms delete', async () => {
    const fetchAll = vi.fn().mockResolvedValue([{ id: 1, name: 'row1' }]);
    const onCreate = vi.fn().mockResolvedValue(undefined);
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    const onDelete = vi.fn().mockResolvedValue(undefined);

    render(
      <CrudGridPage<{ id: number; name: string }, { name: string }>
        title="Dummy"
        columnDefs={[{ field: 'name', headerName: 'Name' } as any]}
        fetchAll={fetchAll}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        getDeleteMessage={() => 'delete me'}
        renderModal={({ mode }) => <div>Modal:{mode}</div>}
      />
    );

    await waitFor(() => expect(fetchAll).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: '+ Add Row' }));
    expect(screen.getByText('Modal:add')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '⟳ Reload' }));
    expect(fetchAll).toHaveBeenCalledTimes(2);

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1]);
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(1));
  });

  test('shows error when initial fetch fails', async () => {
    const fetchAll = vi.fn().mockRejectedValue(new Error('fetch failed'));

    render(
      <CrudGridPage<{ id: number; name: string }, { name: string }>
        title="Dummy"
        columnDefs={[{ field: 'name', headerName: 'Name' } as any]}
        fetchAll={fetchAll}
        onCreate={vi.fn().mockResolvedValue(undefined)}
        onUpdate={vi.fn().mockResolvedValue(undefined)}
        onDelete={vi.fn().mockResolvedValue(undefined)}
        getDeleteMessage={() => 'delete me'}
        renderModal={() => null}
      />
    );

    expect(await screen.findByText('fetch failed')).toBeInTheDocument();
  });

  test('shows error when delete fails', async () => {
    const fetchAll = vi.fn().mockResolvedValue([{ id: 1, name: 'row1' }]);
    const onDelete = vi.fn().mockRejectedValue(new Error('delete failed'));

    render(
      <CrudGridPage<{ id: number; name: string }, { name: string }>
        title="Dummy"
        columnDefs={[{ field: 'name', headerName: 'Name' } as any]}
        fetchAll={fetchAll}
        onCreate={vi.fn().mockResolvedValue(undefined)}
        onUpdate={vi.fn().mockResolvedValue(undefined)}
        onDelete={onDelete}
        getDeleteMessage={() => 'delete me'}
        renderModal={() => null}
      />
    );

    await waitFor(() => expect(fetchAll).toHaveBeenCalled());
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1]);

    expect(await screen.findByText('delete failed')).toBeInTheDocument();
  });

  test('calls onCreate and onUpdate from modal save callback', async () => {
    const fetchAll = vi.fn().mockResolvedValue([{ id: 1, name: 'row1' }]);
    const onCreate = vi.fn().mockResolvedValue(undefined);
    const onUpdate = vi.fn().mockResolvedValue(undefined);

    render(
      <CrudGridPage<{ id: number; name: string }, { name: string }>
        title="Dummy"
        columnDefs={[{ field: 'name', headerName: 'Name' } as any]}
        fetchAll={fetchAll}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={vi.fn().mockResolvedValue(undefined)}
        getDeleteMessage={() => 'delete me'}
        renderModal={({ mode, onSave }) => (
          <button type="button" onClick={() => onSave({ name: mode })}>Save {mode}</button>
        )}
      />
    );

    await waitFor(() => expect(fetchAll).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: '+ Add Row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save add' }));
    await waitFor(() => expect(onCreate).toHaveBeenCalledWith({ name: 'add' }));

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save edit' }));
    await waitFor(() => expect(onUpdate).toHaveBeenCalledWith(1, { name: 'edit' }));
  });
});