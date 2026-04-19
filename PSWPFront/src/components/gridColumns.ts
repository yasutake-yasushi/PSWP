import { ColDef } from 'ag-grid-community';

type WithId = { id: number };
type WithUpdateUser = { updateUser: string };
type WithUpdateTime = { updateTime: string };

export function createIdColumn<T extends WithId>(): ColDef<T> {
  return {
    field: 'id' as any,
    headerName: 'ID',
    width: 130,
    sortable: true,
    filter: 'agTextColumnFilter',
    valueFormatter: ({ value }) => value ? `${String(value).substring(0, 8)}...` : '',
    tooltipValueGetter: ({ value }) => value,
  };
}

export function createUpdateUserColumn<T extends WithUpdateUser>(): ColDef<T> {
  return {
    field: 'updateUser' as any,
    headerName: 'Update User',
    width: 140,
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true,
  };
}

export function createUpdateTimeColumn<T extends WithUpdateTime>(): ColDef<T> {
  return {
    field: 'updateTime' as any,
    headerName: 'Update Time',
    width: 180,
    sortable: true,
    filter: 'agDateColumnFilter',
    resizable: true,
    valueFormatter: ({ value }) => value ? new Date(value).toLocaleString() : '',
  };
}
