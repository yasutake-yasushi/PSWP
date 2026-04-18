import React, { useEffect, useMemo, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import {
  MCAPattern,
  MCAPatternInput,
  getMCAPatterns,
  createMCAPattern,
  updateMCAPattern,
  deleteMCAPattern,
} from '../api/mcaPatterns';
import { getMCAs, MCA } from '../api/mcas';
import { getContractItems, ContractItem } from '../api/contractItems';
import CrudGridPage from '../components/CrudGridPage';
import MCAPatternModal from '../components/MCAPatternModal';

const MCAPatternPage: React.FC = () => {
  const [mcaList, setMcaList] = useState<MCA[]>([]);
  const [contractItemList, setContractItemList] = useState<ContractItem[]>([]);

  useEffect(() => {
    getMCAs().then(list => setMcaList(list)).catch(() => {});
    getContractItems().then(list => setContractItemList(list)).catch(() => {});
  }, []);

  const columnDefs = useMemo<ColDef<MCAPattern>[]>(() => [
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
    <CrudGridPage<MCAPattern, MCAPatternInput>
      title="MCA Pattern"
      columnDefs={columnDefs}
      fetchAll={getMCAPatterns}
      onCreate={createMCAPattern}
      onUpdate={(id, input) => updateMCAPattern(id, input)}
      onDelete={deleteMCAPattern}
      getDeleteMessage={item => `Are you sure you want to delete Pattern "${item.mcaPatternId}"?\nThis action cannot be undone.`}
      renderModal={({ mode, item, onClose, onSave }) => (
        <MCAPatternModal
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

export default MCAPatternPage;
