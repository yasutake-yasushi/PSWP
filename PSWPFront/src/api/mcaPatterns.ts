export interface ItemValueRow {
  itemName: string;
  value: string;
}

export interface MCAPattern {
  id: number;
  mcaPatternId: string;
  mcaId: string;
  contractItems: string; // JSON: ItemValueRow[]
  tradeItems: string;    // JSON: ItemValueRow[]
  specialNotes: string | null;
  updateUser: string;
  updateTime: string;
}

export interface MCAPatternInput {
  mcaPatternId: string;
  mcaId: string;
  contractItems: string;
  tradeItems: string;
  specialNotes: string | null;
}

const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5232';

export const getMCAPatterns = async (): Promise<MCAPattern[]> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns`);
  if (!res.ok) throw new Error(`GET /api/mcapatterns failed: ${res.status}`);
  return res.json();
};

export const getMCAPattern = async (id: number): Promise<MCAPattern> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns/${id}`);
  if (!res.ok) throw new Error(`GET /api/mcapatterns/${id} failed: ${res.status}`);
  return res.json();
};

export const createMCAPattern = async (input: MCAPatternInput): Promise<MCAPattern> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`POST /api/mcapatterns failed: ${res.status}`);
  return res.json();
};

export const updateMCAPattern = async (id: number, input: MCAPatternInput): Promise<MCAPattern> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`PUT /api/mcapatterns/${id} failed: ${res.status}`);
  return res.json();
};

export const deleteMCAPattern = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/mcapatterns/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE /api/mcapatterns/${id} failed: ${res.status}`);
};
