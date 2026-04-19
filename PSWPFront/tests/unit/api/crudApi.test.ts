import { describe, expect, test, vi, beforeEach } from 'vitest';
import { createCrudApi } from '../../../src/api/crudApi';
import { apiDelete, apiGet, apiPost, apiPut } from '../../../src/api/http';

vi.mock('../../../src/api/http', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}));

describe('createCrudApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('wires getAll/getById/create/update/remove to http helpers', () => {
    const api = createCrudApi('/api/items', {
      list: 'list failed',
      detail: 'detail failed',
      create: 'create failed',
      update: 'update failed',
      delete: 'delete failed',
    });

    api.getAll();
    api.getById(10);
    api.create({ name: 'A' });
    api.update(10, { name: 'B' });
    api.remove(10);

    expect(apiGet).toHaveBeenNthCalledWith(1, '/api/items', 'list failed');
    expect(apiGet).toHaveBeenNthCalledWith(2, '/api/items/10', 'detail failed');
    expect(apiPost).toHaveBeenCalledWith('/api/items', { name: 'A' }, 'create failed');
    expect(apiPut).toHaveBeenCalledWith('/api/items/10', { name: 'B' }, 'update failed');
    expect(apiDelete).toHaveBeenCalledWith('/api/items/10', 'delete failed');
  });

  test('falls back to list message when detail message is omitted', () => {
    const api = createCrudApi('/api/items', {
      list: 'list failed',
      create: 'create failed',
      update: 'update failed',
      delete: 'delete failed',
    });

    api.getById(1);

    expect(apiGet).toHaveBeenCalledWith('/api/items/1', 'list failed');
  });
});