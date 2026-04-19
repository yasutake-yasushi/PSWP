const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5232';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  errorMessage: string;
  body?: unknown;
}

async function request<T>(path: string, { errorMessage, headers, body, ...init }: RequestOptions): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: body
      ? { 'Content-Type': 'application/json', ...headers }
      : headers,
    body: typeof body === 'string' ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, errorMessage: string): Promise<T> {
  return request<T>(path, { method: 'GET', errorMessage });
}

export function apiPost<T>(path: string, body: unknown, errorMessage: string): Promise<T> {
  return request<T>(path, { method: 'POST', body, errorMessage });
}

export function apiPut<T>(path: string, body: unknown, errorMessage: string): Promise<T> {
  return request<T>(path, { method: 'PUT', body, errorMessage });
}

export function apiDelete(path: string, errorMessage: string): Promise<void> {
  return request<void>(path, { method: 'DELETE', errorMessage });
}
