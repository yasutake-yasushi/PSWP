import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import ConfirmDialog from './ConfirmDialog';
import { ModalMode } from './modalShared';

// AG Grid Enterprise は CRUD 画面利用時にだけ読み込まれるチャンク側で登録する
ModuleRegistry.registerModules([AllEnterpriseModule]);

interface ModalState<T> { open: boolean; mode: ModalMode; item?: T; }
interface ConfirmState<T> { open: boolean; item?: T; }

export interface CrudGridPageProps<T extends { id: number }, I> {
  /** ページタイトル */
  title: string;
  /** Actions列を除いたカラム定義 */
  columnDefs: ColDef<T>[];
  /** データ取得 */
  fetchAll: () => Promise<T[]>;
  /** 新規作成 */
  onCreate: (input: I) => Promise<unknown>;
  /** 更新 */
  onUpdate: (id: number, input: I) => Promise<unknown>;
  /** 削除 */
  onDelete: (id: number) => Promise<unknown>;
  /** 削除確認メッセージ */
  getDeleteMessage: (item: T) => string;
  /**
   * モーダルのレンダリング。
   * mode / item / onClose / onSave を受け取って JSX を返す関数。
   */
  renderModal: (props: {
    mode: ModalMode;
    item: T | undefined;
    onClose: () => void;
    onSave: (input: I) => Promise<void>;
  }) => React.ReactNode;
}

const theme = themeQuartz;

const toolbarBtn = (bg: string): React.CSSProperties => ({
  padding: '6px 14px', background: bg, color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
});

const actionBtn = (bg: string): React.CSSProperties => ({
  padding: '2px 8px', background: bg, color: '#fff',
  border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
});

function CrudGridPage<T extends { id: number }, I>({
  title,
  columnDefs: propColumnDefs,
  fetchAll,
  onCreate,
  onUpdate,
  onDelete,
  getDeleteMessage,
  renderModal,
}: CrudGridPageProps<T, I>) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const [rowData, setRowData] = useState<T[]>([]);
  const [modal, setModal] = useState<ModalState<T>>({ open: false, mode: 'add' });
  const [confirm, setConfirm] = useState<ConfirmState<T>>({ open: false });
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setRowData(await fetchAll());
    } catch (e: any) {
      setError(e.message);
    }
  }, [fetchAll]);

  const onGridReady = useCallback((_params: GridReadyEvent) => {
    loadData();
  }, [loadData]);

  // ---- Actions セルレンダラー ----
  const ActionCellRenderer = useCallback((params: ICellRendererParams<T>) => {
    const item = params.data!;
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: '100%' }}>
        <button style={actionBtn('#4e9af1')} onClick={() => setModal({ open: true, mode: 'view', item })}>View</button>
        <button style={actionBtn('#27ae60')} onClick={() => setModal({ open: true, mode: 'edit', item })}>Edit</button>
        <button style={actionBtn('#e74c3c')} onClick={() => setConfirm({ open: true, item })}>Delete</button>
      </div>
    );
  }, []);

  const columnDefs = useMemo<ColDef<T>[]>(() => [
    ...propColumnDefs,
    {
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filter: false,
      cellRenderer: ActionCellRenderer,
      cellStyle: { padding: '4px 8px' },
    },
  ], [propColumnDefs, ActionCellRenderer]);

  const defaultColDef = useMemo<ColDef>(() => ({ resizable: true }), []);

  // ---- Modal save ----
  const handleSave = useCallback(async (input: I) => {
    if (modal.mode === 'add') {
      await onCreate(input);
    } else if (modal.mode === 'edit' && modal.item) {
      await onUpdate(modal.item.id, input);
    }
    await loadData();
  }, [modal, onCreate, onUpdate, loadData]);

  const closeModal = useCallback(() => setModal({ open: false, mode: 'add' }), []);

  // ---- Delete confirm ----
  const handleDeleteConfirm = useCallback(async () => {
    if (!confirm.item) return;
    setDeleting(true);
    try {
      await onDelete(confirm.item.id);
      setConfirm({ open: false });
      await loadData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }, [confirm.item, onDelete, loadData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <h2 style={{ flex: 1, fontSize: '1.1rem' }}>{title}</h2>
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

      {/* グリッド */}
      <div style={{ flex: 1 }}>
        <AgGridReact<T>
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
      {modal.open && renderModal({
        mode: modal.mode,
        item: modal.item,
        onClose: closeModal,
        onSave: handleSave,
      })}

      {/* 削除確認ダイアログ */}
      {confirm.open && confirm.item && (
        <ConfirmDialog
          title="Delete Confirmation"
          message={getDeleteMessage(confirm.item)}
          onCancel={() => setConfirm({ open: false })}
          onConfirm={handleDeleteConfirm}
          loading={deleting}
        />
      )}
    </div>
  );
}

export default CrudGridPage;
