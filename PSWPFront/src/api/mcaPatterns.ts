import { createCrudApi } from './crudApi';

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


const mcaPatternsApi = createCrudApi<MCAPattern, MCAPatternInput>('/api/mcapatterns', {
  list: 'Failed to fetch MCA patterns',
  create: 'Failed to create MCA pattern',
  update: 'Failed to update MCA pattern',
  delete: 'Failed to delete MCA pattern',
});

export const getMCAPatterns = mcaPatternsApi.getAll;
export const getMCAPattern = mcaPatternsApi.getById;
export const createMCAPattern = mcaPatternsApi.create;
export const updateMCAPattern = mcaPatternsApi.update;
export const deleteMCAPattern = mcaPatternsApi.remove;
