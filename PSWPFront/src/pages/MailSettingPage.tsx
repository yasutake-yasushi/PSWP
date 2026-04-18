import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import {
  MailSetting,
  MailSettingInput,
  getMailSettings,
  createMailSetting,
  updateMailSetting,
  deleteMailSetting,
} from '../api/mailSettings';
import CrudGridPage from '../components/CrudGridPage';
import MailSettingModal from '../components/MailSettingModal';

const MailSettingPage: React.FC = () => {
  const columnDefs = useMemo<ColDef<MailSetting>[]>(() => [
    {
      field: 'id',
      headerName: 'UUID',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
      valueFormatter: ({ value }) => value ? String(value).substring(0, 8) + '…' : '',
      tooltipValueGetter: ({ value }) => value,
    },
    { field: 'eventType',   headerName: 'Event Type',   flex: 1.5, sortable: true, filter: 'agSetColumnFilter',  resizable: true },
    { field: 'templateId',  headerName: 'Template ID',  flex: 1.5, sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'description', headerName: 'Description',  flex: 3,   sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'updateUser',  headerName: 'Update User',  width: 140, sortable: true, filter: 'agTextColumnFilter', resizable: true },
    { field: 'updateTime',  headerName: 'Update Time',  width: 180, sortable: true, filter: 'agDateColumnFilter', resizable: true,
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleString() : '',
    },
  ], []);

  return (
    <CrudGridPage<MailSetting, MailSettingInput>
      title="Mail Setting"
      columnDefs={columnDefs}
      fetchAll={getMailSettings}
      onCreate={createMailSetting}
      onUpdate={(id, input) => updateMailSetting(id, input)}
      onDelete={deleteMailSetting}
      getDeleteMessage={item =>
        `Are you sure you want to delete mail setting "${item.templateId}" (${item.eventType})?\nThis action cannot be undone.`
      }
      renderModal={({ mode, item, onClose, onSave }) => (
        <MailSettingModal mode={mode} item={item} onClose={onClose} onSave={onSave} />
      )}
    />
  );
};

export default MailSettingPage;
