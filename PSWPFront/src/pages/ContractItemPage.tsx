import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  themeQuartz,
} from 'ag-grid-community';
import {
  ContractItem,
  ContractItemInput,
  getContractItems,
  createContractItem,
  updateContractItem,
  deleteContractItem,
} from '../api/contractItems';
import ContractItemModal, { ModalMode } from '../components/ContractItemModal';
import ConfirmDialog from '../components/ConfirmDialog';

const theme = themeQuartz;

interface ModalState {
  open: boolean;
  mode: ModalMode;
  item?: ContractItem;
}

interface ConfirmState {
  open: boolean;
  item?: ContractItem;
}

const ContractItemPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<ContractItem>>(null);
  const [rowData, setRowData] = useState<ContractItem[]>([]);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'add' });
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---- アクションボタン セルレンダラー ----
  const ActionCellRenderer = useCallback((params: ICellRendererParams<ContractItem>) => {
    const item = params.data!;
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: '100%' }}>
        <button style={actionBtn('#4e9af1')} onClick={() => setModal({ open: true, mode: 'view', item })}>参照</button>
        <button style={actionBtn('#27ae60')} onClick={() => setModal({ open: true, mode: 'edit', item })}>更新</button>
        <button style={actionBtn('#e74c3c')} onClick={() => setConfirm({ open: true, item })}>削除</button>
      </div>
    );
  }, []);

  const columnDefs = useMemo<ColDef<ContractItem>[]>(() => [
    {
      field: 'id',
      headerName: 'UUID',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
      valueFormatter: ({ value }) => value ? String(value).substring(0, 8) + '…' : '',
      tooltipValueGetter: ({ value }) => value,
    },
    { field: 'category',     headerName: 'Category',      flex: 1,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'itemName',     headerName: 'Item Name',     flex: 1.5, sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'dataType',     headerName: 'Data Type',     width: 120, sortable: true, filter: 'agSetColumnFilter', resizable: true },
    { field: 'values',       headerName: 'Values',        flex: 1.5, sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'defaultValue', headerName: 'Default Value', flex: 1,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'description',  headerName: 'Description',   flex: 2,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
    {
      headerName: '操作',
      width: 180,
      pinned: 'right',
      sortable: false,
      filter: false,
      cellRenderer: ActionCellRenderer,
      cellStyle: { padding: '4px 8px' },
    },
  ], [ActionCellRenderer]);

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    floatingFilter: true,
  }), []);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await getContractItems();
      setRowData(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const onGridReady = useCallback((_params: GridReadyEvent) => {
    loadData();
  }, [loadData]);

  // ---- Modal save ----
  const handleSave = useCallback(async (input: ContractItemInput) => {
    if (modal.mode === 'add') {
      await createContractItem(input);
    } else if (modal.mode === 'edit' && modal.item) {
      await updateContractItem(modal.item.id, input);
    }
    await loadData();
  }, [modal, loadData]);

  // ---- Delete confirm ----
  const handleDeleteConfirm = useCallback(async () => {
    if (!confirm.item) return;
    setDeleting(true);
    try {
      await deleteContractItem(confirm.item.id);
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
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <h2 style={{ flex: 1, fontSize: '1.1rem' }}>Contract Item</h2>
        <button style={toolbarBtn('#27ae60')} onClick={() => setModal({ open: true, mode: 'add' })}>+ 行追加</button>
        <button style={toolbarBtn('#4e9af1')} onClick={loadData}>更新</button>
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

      {/* グリッド */}
      <div style={{ flex: 1 }}>
        <AgGridReact<ContractItem>
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

      {/* モーダル */}
      {modal.open && (
        <ContractItemModal
          mode={modal.mode}
          item={modal.item}
          onClose={() => setModal({ open: false, mode: 'add' })}
          onSave={handleSave}
        />
      )}

      {/* 削除確認ダイアログ */}
      {confirm.open && confirm.item && (
        <ConfirmDialog
          title="削除確認"
          message={`「${confirm.item.itemName}」を削除してもよろしいですか？\nこの操作は元に戻せません。`}
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

export default ContractItemPage;
