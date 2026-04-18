const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5000';

export interface ContractItem {
  id: number;
  category: string;
  itemName: string;
  dataType: string;
  values?: string;
  defaultValue?: string;
  description?: string;
  updateUser: string;
  updateTime: string;
}

export type ContractItemInput = Omit<ContractItem, 'id' | 'updateUser' | 'updateTime'>;

export async function getContractItems(): Promise<ContractItem[]> {
  const res = await fetch(`${BASE_URL}/api/contractitems`);
  if (!res.ok) throw new Error('データの取得に失敗しました');
  return res.json();
}

export async function getContractItem(id: number): Promise<ContractItem> {
  const res = await fetch(`${BASE_URL}/api/contractitems/${id}`);
  if (!res.ok) throw new Error('データの取得に失敗しました');
  return res.json();
}

export async function createContractItem(input: ContractItemInput): Promise<ContractItem> {
  const res = await fetch(`${BASE_URL}/api/contractitems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('データの作成に失敗しました');
  return res.json();
}

export async function updateContractItem(id: number, input: ContractItemInput): Promise<ContractItem> {
  const res = await fetch(`${BASE_URL}/api/contractitems/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('データの更新に失敗しました');
  return res.json();
}

export async function deleteContractItem(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/contractitems/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('データの削除に失敗しました');
}
