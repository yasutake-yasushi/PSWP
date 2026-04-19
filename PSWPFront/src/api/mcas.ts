import { createCrudApi } from './crudApi';

export interface MCA {
  id: number;
  mcaId: string;
  cpty: string;
  agreementDate: string | null;
  executionDate: string | null;
  contractItems: string; // JSON array e.g. '["PaymentTerm","Notional"]'
  updateUser: string;
  updateTime: string;
}

export interface MCAInput {
  mcaId: string;
  cpty: string;
  agreementDate: string | null;
  executionDate: string | null;
  contractItems: string;
}


const mcaApi = createCrudApi<MCA, MCAInput>('/api/mcas', {
  list: 'Failed to fetch MCAs',
  create: 'Failed to create MCA',
  update: 'Failed to update MCA',
  delete: 'Failed to delete MCA',
});

export const getMCAs = mcaApi.getAll;
export const getMCA = mcaApi.getById;
export const createMCA = mcaApi.create;
export const updateMCA = mcaApi.update;
export const deleteMCA = mcaApi.remove;
