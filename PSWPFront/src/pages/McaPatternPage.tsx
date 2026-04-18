import React, { useEffect, useMemo, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import {
  McaPattern,
  McaPatternInput,
  getMcaPatterns,
  createMcaPattern,
  updateMcaPattern,
  deleteMcaPattern,
} from '../api/mcaPatterns';
import { getMcas, Mca } from '../api/mcas';
import { getContractItems, ContractItem } from '../api/contractItems';
import CrudGridPage from '../components/CrudGridPage';
import McaPatternModal from '../components/McaPatternModal';

const McaPatternPage: React.FC = () => {
  const [mcaList, setMcaList] = useState<Mca[]>([]);
  const [contractItemList, setContractItemList] = useState<ContractItem[]>([]);

  useEffect(() => {
    getMcas().then(list => setMcaList(list)).catch(() => {});
    getContractItems().then(list => setContractItemList(list)).catch(() => {});
  }, []);

  const columnDefs = useMemo<ColDef<McaPattern>[]>(() => [
    {
      field: 'id',
      headerName: 'UUID',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
      valueFormatter: ({ value }) => value ? String(value).substring(0, 8) + '...' : '',
      tooltipValueGetter: ({ value }) => value,
    },
    { field: 'mcaPatternId', headerName: 'MCA Pattern ID', flex: 1.5, sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'mcaId',        headerName: 'MCA ID',         flex: 1,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'specialNotes', headerName: 'Description',    flex: 2,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
  ], []);

  return (
    <CrudGridPage<McaPattern, McaPatternInput>
      title="MCA Pattern"
      columnDefs={columnDefs}
      fetchAll={getMcaPatterns}
      onCreate={createMcaPattern}
      onUpdate={(id, input) => updateMcaPattern(id, input)}
      onDelete={deleteMcaPattern}
      getDeleteMessage={item => `Are you sure you want to delete Pattern "${item.mcaPatternId}"?\nThis action cannot be undone.`}
      renderModal={({ mode, item, onClose, onSave }) => (
        <McaPatternModal
          mode={mode}
          item={item}
          mcas={mcaList}
          contractItemMaster={contractItemList}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    />
  );
};

export default McaPatternPage;
