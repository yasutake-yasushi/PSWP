const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5232';

export interface Strategy {
  id: string;
  strategyType: string;
  portId: string;
  createdAt: string;
  updatedAt: string;
}

export type StrategyInput = Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>;

export async function getStrategies(): Promise<Strategy[]> {
  const res = await fetch(`${BASE_URL}/api/strategies`);
  if (!res.ok) throw new Error('Failed to fetch strategies');
  return res.json();
}

export async function createStrategy(input: StrategyInput): Promise<Strategy> {
  const res = await fetch(`${BASE_URL}/api/strategies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create strategy');
  return res.json();
}

export async function updateStrategy(id: string, input: StrategyInput): Promise<Strategy> {
  const res = await fetch(`${BASE_URL}/api/strategies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update strategy');
  return res.json();
}

export async function deleteStrategy(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/strategies/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete strategy');
}
