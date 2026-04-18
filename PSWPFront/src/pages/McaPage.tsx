import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import {
  Mca,
  McaInput,
  getMcas,
  createMca,
  updateMca,
  deleteMca,
} from '../api/mcas';
import CrudGridPage from '../components/CrudGridPage';
import McaModal from '../components/McaModal';

const McaPage: React.FC = () => {
  const columnDefs = useMemo<ColDef<Mca>[]>(() => [
    {
      field: 'id',
      headerName: 'UUID',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
      valueFormatter: ({ value }) => value ? String(value).substring(0, 8) + '...' : '',
      tooltipValueGetter: ({ value }) => value,
    },
    { field: 'mcaId', headerName: 'MCA ID',         flex: 1, sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'cpty',  headerName: 'CPTY',           flex: 1, sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'agreementDate', headerName: 'Agreement Date', flex: 1, sortable: true, filter: 'agDateColumnFilter', resizable: true },
    { field: 'executionDate', headerName: 'Execution Date', flex: 1, sortable: true, filter: 'agDateColumnFilter', resizable: true },
    {
      field: 'contractItems',
      headerName: 'Contract Item',
      flex: 2,
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      valueFormatter: ({ value }) => {
        try { const arr: string[] = JSON.parse(value ?? '[]'); return arr.join(', '); }
        catch { return value ?? ''; }
      },
    },
  ], []);

  return (
    <CrudGridPage<Mca, McaInput>
      title="MCA"
      columnDefs={columnDefs}
      fetchAll={getMcas}
      onCreate={createMca}
      onUpdate={(id, input) => updateMca(id, input)}
      onDelete={deleteMca}
      getDeleteMessage={item => `Are you sure you want to delete MCA "${item.mcaId}"?\nThis action cannot be undone.`}
      renderModal={({ mode, item, onClose, onSave }) => (
        <McaModal mode={mode} item={item} onClose={onClose} onSave={onSave} />
      )}
    />
  );
};

export default McaPage;
