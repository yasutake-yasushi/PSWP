
import { createCrudApi } from './crudApi';

export interface AddressRow {
  kind: 'To' | 'CC' | 'BCC';
  address: string;
}

export interface MailSetting {
  id: number;
  eventType: string;
  templateId: string;
  description: string;
  addresses: string; // JSON: AddressRow[]
  message: string;
  updateUser: string;
  updateTime: string;
}

export type MailSettingInput = Omit<MailSetting, 'id' | 'updateUser' | 'updateTime'>;

const mailSettingsApi = createCrudApi<MailSetting, MailSettingInput>('/api/mailsettings', {
  list: 'Failed to fetch mail settings',
  create: 'Failed to create mail setting',
  update: 'Failed to update mail setting',
  delete: 'Failed to delete mail setting',
});

export const getMailSettings = mailSettingsApi.getAll;
export const getMailSetting = mailSettingsApi.getById;
export const createMailSetting = mailSettingsApi.create;
export const updateMailSetting = mailSettingsApi.update;
export const deleteMailSetting = mailSettingsApi.remove;
