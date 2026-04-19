
import { createCrudApi } from './crudApi';

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

const contractItemsApi = createCrudApi<ContractItem, ContractItemInput>('/api/contractitems', {
  list: 'データの取得に失敗しました',
  create: 'データの作成に失敗しました',
  update: 'データの更新に失敗しました',
  delete: 'データの削除に失敗しました',
});

export const getContractItems = contractItemsApi.getAll;
export const getContractItem = contractItemsApi.getById;
export const createContractItem = contractItemsApi.create;
export const updateContractItem = contractItemsApi.update;
export const deleteContractItem = contractItemsApi.remove;
