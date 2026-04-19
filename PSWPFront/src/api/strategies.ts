
import { createCrudApi } from './crudApi';

export interface Strategy {
  id: number;
  strategyType: string;
  portId: string;
  updateUser: string;
  updateTime: string;
}

export type StrategyInput = Omit<Strategy, 'id' | 'updateUser' | 'updateTime'>;

const strategiesApi = createCrudApi<Strategy, StrategyInput>('/api/strategies', {
  list: 'Failed to fetch strategies',
  create: 'Failed to create strategy',
  update: 'Failed to update strategy',
  delete: 'Failed to delete strategy',
});

export const getStrategies = strategiesApi.getAll;
export const createStrategy = strategiesApi.create;
export const updateStrategy = strategiesApi.update;
export const deleteStrategy = strategiesApi.remove;
