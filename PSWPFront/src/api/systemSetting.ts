const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5232';

export interface SystemSetting {
  id: number;
  mipsFilePath: string;
  strikeFilePath: string;
  updateUser: string;
  updateTime: string;
}

export async function getSystemSetting(): Promise<SystemSetting> {
  const res = await fetch(`${BASE_URL}/api/systemsetting`);
  if (!res.ok) throw new Error('Failed to fetch system setting');
  return res.json();
}

export async function updateSystemSetting(
  input: Pick<SystemSetting, 'mipsFilePath' | 'strikeFilePath'>
): Promise<SystemSetting> {
  const res = await fetch(`${BASE_URL}/api/systemsetting`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update system setting');
  return res.json();
}
