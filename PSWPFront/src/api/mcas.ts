export interface Mca {
  id: string;
  mcaId: string;
  cpty: string;
  agreementDate: string | null;
  executionDate: string | null;
  contractItems: string; // JSON array e.g. '["PaymentTerm","Notional"]'
  createdAt: string;
  updatedAt: string;
}

export interface McaInput {
  mcaId: string;
  cpty: string;
  agreementDate: string | null;
  executionDate: string | null;
  contractItems: string;
}

const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5232';

export const getMcas = async (): Promise<Mca[]> => {
  const res = await fetch(`${BASE_URL}/api/mcas`);
  if (!res.ok) throw new Error(`GET /api/mcas failed: ${res.status}`);
  return res.json();
};

export const getMca = async (id: string): Promise<Mca> => {
  const res = await fetch(`${BASE_URL}/api/mcas/${id}`);
  if (!res.ok) throw new Error(`GET /api/mcas/${id} failed: ${res.status}`);
  return res.json();
};

export const createMca = async (input: McaInput): Promise<Mca> => {
  const res = await fetch(`${BASE_URL}/api/mcas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`POST /api/mcas failed: ${res.status}`);
  return res.json();
};

export const updateMca = async (id: string, input: McaInput): Promise<Mca> => {
  const res = await fetch(`${BASE_URL}/api/mcas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`PUT /api/mcas/${id} failed: ${res.status}`);
  return res.json();
};

export const deleteMca = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/mcas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE /api/mcas/${id} failed: ${res.status}`);
};
