const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5232';

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
  createdAt: string;
  updatedAt: string;
}

export type MailSettingInput = Omit<MailSetting, 'id' | 'createdAt' | 'updatedAt'>;

export async function getMailSettings(): Promise<MailSetting[]> {
  const res = await fetch(`${BASE_URL}/api/mailsettings`);
  if (!res.ok) throw new Error('Failed to fetch mail settings');
  return res.json();
}

export async function getMailSetting(id: number): Promise<MailSetting> {
  const res = await fetch(`${BASE_URL}/api/mailsettings/${id}`);
  if (!res.ok) throw new Error('Failed to fetch mail setting');
  return res.json();
}

export async function createMailSetting(input: MailSettingInput): Promise<MailSetting> {
  const res = await fetch(`${BASE_URL}/api/mailsettings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create mail setting');
  return res.json();
}

export async function updateMailSetting(id: number, input: MailSettingInput): Promise<MailSetting> {
  const res = await fetch(`${BASE_URL}/api/mailsettings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update mail setting');
  return res.json();
}

export async function deleteMailSetting(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/mailsettings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete mail setting');
}
