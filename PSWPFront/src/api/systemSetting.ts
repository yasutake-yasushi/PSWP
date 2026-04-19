
import { apiGet, apiPut } from './http';

export interface SystemSetting {
  id: number;
  mipsFilePath: string;
  strikeFilePath: string;
  updateUser: string;
  updateTime: string;
}

export async function getSystemSetting(): Promise<SystemSetting> {
  return apiGet<SystemSetting>('/api/systemsetting', 'Failed to fetch system setting');
}

export async function updateSystemSetting(
  input: Pick<SystemSetting, 'mipsFilePath' | 'strikeFilePath'>
): Promise<SystemSetting> {
  return apiPut<SystemSetting>('/api/systemsetting', input, 'Failed to update system setting');
}
