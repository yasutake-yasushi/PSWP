import { apiDelete, apiGet, apiPost, apiPut } from './http';

export function createCrudApi<TEntity, TInput>(resourcePath: string, messages: {
  list: string;
  detail?: string;
  create: string;
  update: string;
  delete: string;
}) {
  return {
    getAll: () => apiGet<TEntity[]>(resourcePath, messages.list),
    getById: (id: number) => apiGet<TEntity>(`${resourcePath}/${id}`, messages.detail ?? messages.list),
    create: (input: TInput) => apiPost<TEntity>(resourcePath, input, messages.create),
    update: (id: number, input: TInput) => apiPut<TEntity>(`${resourcePath}/${id}`, input, messages.update),
    remove: (id: number) => apiDelete(`${resourcePath}/${id}`, messages.delete),
  };
}
