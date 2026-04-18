import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  themeQuartz,
} from 'ag-grid-community';
import {
  Mca,
  McaInput,
  getMcas,
  createMca,
  updateMca,
  deleteMca,
} from '../api/mcas';
import McaModal, { ModalMode } from '../components/McaModal';
import ConfirmDialog from '../components/ConfirmDialog';

const theme = themeQuartz;

interface ModalState { open: boolean; mode: ModalMode; item?: Mca; }
interface ConfirmState { open: boolean; item?: Mca; }

const McaPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<Mca>>(null);
  const [rowData, setRowData] = useState<Mca[]>([]);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'add' });
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const ActionCellRenderer = useCallback((params: ICellRendererParams<Mca>) => {
    const item = params.data!;
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: '100%' }}>
        <button style={actionBtn('#4e9af1')} onClick={() => setModal({ open: true, mode: 'view', item })}>View</button>
        <button style={actionBtn('#27ae60')} onClick={() => setModal({ open: true, mode: 'edit', item })}>Edit</button>
        <button style={actionBtn('#e74c3c')} onClick={() => setConfirm({ open: true, item })}>Delete</button>
      </div>
    );
  }, []);

  const columnDefs = useMemo<ColDef<Mca>[]>(() => [
    {
      field: 'id',
      headerName: 'UUID',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
      valueFormatter: ({ value }) => value ? String(value).substring(0, 8) + '…' : '',
      tooltipValueGetter: ({ value }) => value,
    },
    { field: 'mcaId',         headerName: 'MCA ID',         flex: 1,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'cpty',          headerName: 'CPTY',           flex: 1,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
    {
      field: 'agreementDate',
      headerName: 'Agreement Date',
      flex: 1,
      sortable: true,
      filter: 'agDateColumnFilter',
      resizable: true,
    },
    {
      field: 'executionDate',
      headerName: 'Execution Date',
      flex: 1,
      sortable: true,
      filter: 'agDateColumnFilter',
      resizable: true,
    },
    {
      field: 'contractItems',
      headerName: 'Contract Item',
      flex: 2,
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      valueFormatter: ({ value }) => {
        try {
          const arr: string[] = JSON.parse(value ?? '[]');
          return arr.join(', ');
        } catch { return value ?? ''; }
      },
    },
    {
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filter: false,
      cellRenderer: ActionCellRenderer,
      cellStyle: { padding: '4px 8px' },
    },
  ], [ActionCellRenderer]);

  const defaultColDef = useMemo<ColDef>(() => ({ resizable: true }), []);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setRowData(await getMcas());
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const onGridReady = useCallback((_params: GridReadyEvent) => {
    loadData();
  }, [loadData]);

  const handleSave = useCallback(async (input: McaInput) => {
    if (modal.mode === 'add') {
      await createMca(input);
    } else if (modal.mode === 'edit' && modal.item) {
      await updateMca(modal.item.id, input);
    }
    await loadData();
  }, [modal, loadData]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!confirm.item) return;
    setDeleting(true);
    try {
      await deleteMca(confirm.item.id);
      setConfirm({ open: false });
      await loadData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }, [confirm.item, loadData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <h2 style={{ flex: 1, fontSize: '1.1rem' }}>MCA</h2>
        <button style={toolbarBtn('#4e9af1')} onClick={loadData}>⟳ Reload</button>
        <button style={toolbarBtn('#27ae60')} onClick={() => setModal({ open: true, mode: 'add' })}>+ Add Row</button>
      </div>

      {error && (
        <div style={{
          marginBottom: 8, padding: '6px 12px',
          background: '#fdf2f2', border: '1px solid #f5c6cb',
          borderRadius: 4, color: '#c0392b', fontSize: '0.85rem',
        }}>
          {error}
        </div>
      )}

      <div style={{ flex: 1 }}>
        <AgGridReact<Mca>
          ref={gridRef}
          theme={theme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination
          paginationPageSize={25}
          paginationPageSizeSelector={[10, 25, 50, 100]}
          animateRows
          tooltipShowDelay={300}
          rowHeight={40}
        />
      </div>

      {modal.open && (
        <McaModal
          mode={modal.mode}
          item={modal.item}
          onClose={() => setModal({ open: false, mode: 'add' })}
          onSave={handleSave}
        />
      )}

      {confirm.open && confirm.item && (
        <ConfirmDialog
          title="Delete Confirmation"
          message={`Are you sure you want to delete MCA "${confirm.item.mcaId}"?\nThis action cannot be undone.`}
          onCancel={() => setConfirm({ open: false })}
          onConfirm={handleDeleteConfirm}
          loading={deleting}
        />
      )}
    </div>
  );
};

const toolbarBtn = (bg: string): React.CSSProperties => ({
  padding: '6px 14px', background: bg, color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
});

const actionBtn = (bg: string): React.CSSProperties => ({
  padding: '2px 8px', background: bg, color: '#fff',
  border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
});

export default McaPage;
