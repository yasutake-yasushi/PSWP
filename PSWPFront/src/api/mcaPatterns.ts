export interface ItemValueRow {
  itemName: string;
  value: string;
}

export interface McaPattern {
  id: string;
  mcaPatternId: string;
  mcaId: string;
  contractItems: string; // JSON: ItemValueRow[]
  tradeItems: string;    // JSON: ItemValueRow[]
  specialNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface McaPatternInput {
  mcaPatternId: string;
  mcaId: string;
  contractItems: string;
  tradeItems: string;
  specialNotes: string | null;
}

const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5232';

export const getMcaPatterns = async (): Promise<McaPattern[]> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns`);
  if (!res.ok) throw new Error(`GET /api/mcapatterns failed: ${res.status}`);
  return res.json();
};

export const getMcaPattern = async (id: string): Promise<McaPattern> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns/${id}`);
  if (!res.ok) throw new Error(`GET /api/mcapatterns/${id} failed: ${res.status}`);
  return res.json();
};

export const createMcaPattern = async (input: McaPatternInput): Promise<McaPattern> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`POST /api/mcapatterns failed: ${res.status}`);
  return res.json();
};

export const updateMcaPattern = async (id: string, input: McaPatternInput): Promise<McaPattern> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`PUT /api/mcapatterns/${id} failed: ${res.status}`);
  return res.json();
};

export const deleteMcaPattern = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE /api/mcapatterns/${id} failed: ${res.status}`);
};
