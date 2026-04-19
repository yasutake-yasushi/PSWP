import { afterEach, describe, expect, test, vi } from 'vitest';
import { apiDelete, apiGet, apiPost, apiPut } from '../../../src/api/http';

describe('http helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('apiGet sends GET request and returns json body', async () => {
    const json = vi.fn().mockResolvedValue({ id: 1, name: 'x' });
    const fetchMock = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
      ok: true,
      status: 200,
      json,
    } as any);

    const result = await apiGet<{ id: number; name: string }>('/api/items', 'failed');

    expect(result).toEqual({ id: 1, name: 'x' });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5232/api/items',
      expect.objectContaining({ method: 'GET' })
    );
  });

  test('apiPost/apiPut serialize body and set content-type', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ ok: true }),
    } as any);

    await apiPost('/api/items', { name: 'A' }, 'create failed');
    await apiPut('/api/items/1', { name: 'B' }, 'update failed');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:5232/api/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'A' }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:5232/api/items/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ name: 'B' }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  test('apiDelete resolves void for 204 response', async () => {
    vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
      ok: true,
      status: 204,
      json: vi.fn(),
    } as any);

    const result = await apiDelete('/api/items/1', 'delete failed');

    expect(result).toBeUndefined();
  });

  test('throws configured message when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn(),
    } as any);

    await expect(apiGet('/api/items', 'fetch failed')).rejects.toThrow('fetch failed');
  });
});