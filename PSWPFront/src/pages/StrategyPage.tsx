import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import {
  Strategy,
  StrategyInput,
  getStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
} from '../api/strategies';
import CrudGridPage from '../components/CrudGridPage';
import StrategyModal from '../components/StrategyModal';

const StrategyPage: React.FC = () => {
  const columnDefs = useMemo<ColDef<Strategy>[]>(() => [
    {
      field: 'id',
      headerName: 'UUID',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
      valueFormatter: ({ value }) => value ? String(value).substring(0, 8) + '…' : '',
      tooltipValueGetter: ({ value }) => value,
    },
    { field: 'strategyType', headerName: 'Strategy', flex: 1.5, sortable: true, filter: 'agSetColumnFilter',  resizable: true },
    { field: 'portId',       headerName: 'Port ID',  flex: 2,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
  ], []);

  return (
    <CrudGridPage<Strategy, StrategyInput>
      title="Strategy"
      columnDefs={columnDefs}
      fetchAll={getStrategies}
      onCreate={createStrategy}
      onUpdate={(id, input) => updateStrategy(id, input)}
      onDelete={deleteStrategy}
      getDeleteMessage={item =>
        `Are you sure you want to delete strategy "${item.strategyType} / ${item.portId}"?\nThis action cannot be undone.`
      }
      renderModal={({ mode, item, onClose, onSave }) => (
        <StrategyModal mode={mode} item={item} onClose={onClose} onSave={onSave} />
      )}
    />
  );
};

export default StrategyPage;
