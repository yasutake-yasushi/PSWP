import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import {
  MCA,
  MCAInput,
  getMCAs,
  createMCA,
  updateMCA,
  deleteMCA,
} from '../api/mcas';
import CrudGridPage from '../components/CrudGridPage';
import MCAModal from '../components/MCAModal';

const MCAPage: React.FC = () => {
  const columnDefs = useMemo<ColDef<MCA>[]>(() => [
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
    <CrudGridPage<MCA, MCAInput>
      title="MCA"
      columnDefs={columnDefs}
      fetchAll={getMCAs}
      onCreate={createMCA}
      onUpdate={(id, input) => updateMCA(id, input)}
      onDelete={deleteMCA}
      getDeleteMessage={item => `Are you sure you want to delete MCA "${item.mcaId}"?\nThis action cannot be undone.`}
      renderModal={({ mode, item, onClose, onSave }) => (
        <MCAModal mode={mode} item={item} onClose={onClose} onSave={onSave} />
      )}
    />
  );
};

export default MCAPage;
