import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  IGetRowsParams,
  themeQuartz,
} from 'ag-grid-community';
import { getUsers, createUser, updateUser, deleteUser, User } from '../api/users';

const theme = themeQuartz;

const UsersPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<User>>(null);
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const columnDefs = useMemo<ColDef<User>[]>(() => [
    { field: 'id',        headerName: 'ID',       width: 80,  sortable: true },
    { field: 'name',      headerName: '名前',      flex: 1,    sortable: true, filter: true, editable: true },
    { field: 'email',     headerName: 'メール',    flex: 2,    sortable: true, filter: true, editable: true },
    { field: 'role',      headerName: 'ロール',    width: 120, sortable: true, filter: true, editable: true },
    {
      field: 'createdAt',
      headerName: '作成日時',
      flex: 1,
      valueFormatter: ({ value }) =>
        value ? new Date(value).toLocaleString('ja-JP') : '',
    },
    {
      field: 'isActive',
      headerName: '有効',
      width: 90,
      cellRenderer: ({ value }: { value: boolean }) =>
        value ? '✅' : '❌',
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
  }), []);

  const onGridReady = useCallback(async (_params: GridReadyEvent) => {
    try {
      const users = await getUsers();
      gridRef.current?.api.setGridOption('rowData', users);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const handleRefresh = async () => {
    setError(null);
    try {
      const users = await getUsers();
      gridRef.current?.api.setGridOption('rowData', users);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleAdd = async () => {
    const name = prompt('名前');
    if (!name) return;
    const email = prompt('メール') ?? '';
    try {
      await createUser({ name, email, role: 'user' });
      await handleRefresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return alert('行を選択してください');
    if (!window.confirm(`「${selectedRow.name}」を削除しますか？`)) return;
    try {
      await deleteUser(selectedRow.id);
      await handleRefresh();
      setSelectedRow(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onCellValueChanged = useCallback(async (event: any) => {
    try {
      await updateUser(event.data.id, {
        name: event.data.name,
        email: event.data.email,
        role: event.data.role,
      });
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <h2 style={{ flex: 1 }}>ユーザー管理</h2>
        <button onClick={handleRefresh} style={btnStyle('#4e9af1')}>更新</button>
        <button onClick={handleAdd}     style={btnStyle('#27ae60')}>+ 追加</button>
        <button onClick={handleDelete}  style={btnStyle('#e74c3c')} disabled={!selectedRow}>削除</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <div style={{ flex: 1 }}>
        <AgGridReact<User>
          ref={gridRef}
          theme={theme}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="single"
          onGridReady={onGridReady}
          onRowClicked={e => setSelectedRow(e.data ?? null)}
          onCellValueChanged={onCellValueChanged}
          pagination
          paginationPageSize={20}
          animateRows
        />
      </div>
    </div>
  );
};

const btnStyle = (bg: string): React.CSSProperties => ({
  padding: '6px 14px',
  background: bg,
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontWeight: 600,
});

export default UsersPage;
