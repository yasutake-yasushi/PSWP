import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import {
  ContractItem,
  ContractItemInput,
  getContractItems,
  createContractItem,
  updateContractItem,
  deleteContractItem,
} from '../api/contractItems';
import CrudGridPage from '../components/CrudGridPage';
import ContractItemModal from '../components/ContractItemModal';

const ContractItemPage: React.FC = () => {
  const columnDefs = useMemo<ColDef<ContractItem>[]>(() => [
    {
      field: 'id',
      headerName: 'UUID',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
      valueFormatter: ({ value }) => value ? String(value).substring(0, 8) + '...' : '',
      tooltipValueGetter: ({ value }) => value,
    },
    { field: 'category',     headerName: 'Category',      flex: 1,    sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'itemName',     headerName: 'Item Name',     flex: 1.5,  sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'dataType',     headerName: 'Data Type',     width: 120, sortable: true, filter: 'agSetColumnFilter',  resizable: true },
    { field: 'values', headerName: 'Values', flex: 1.5, sortable: true, filter: 'agTextColumnFilter', resizable: true,
      valueFormatter: ({ value }) => value ? (value as string).split('\n').map((v: string) => v.trim()).filter(Boolean).join(' / ') : '',
    },
    { field: 'defaultValue', headerName: 'Default Value', flex: 1,    sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'description',  headerName: 'Description',   flex: 2,    sortable: true, filter: 'agTextColumnFilter', resizable: true },
  ], []);

  return (
    <CrudGridPage<ContractItem, ContractItemInput>
      title="Contract Item"
      columnDefs={columnDefs}
      fetchAll={getContractItems}
      onCreate={createContractItem}
      onUpdate={(id, input) => updateContractItem(id, input)}
      onDelete={deleteContractItem}
      getDeleteMessage={item => `Are you sure you want to delete "${item.itemName}"?\nThis action cannot be undone.`}
      renderModal={({ mode, item, onClose, onSave }) => (
        <ContractItemModal mode={mode} item={item} onClose={onClose} onSave={onSave} />
      )}
    />
  );
};

export default ContractItemPage;
