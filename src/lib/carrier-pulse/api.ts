const BASE_URL = '/api/carrier-pulse';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function fetchApi<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getAuthHeaders(),
    ...options,
  });
  if (!res.ok) {
    const error = new Error(`API error: ${res.status}`) as Error & { status: number };
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function patchApi<T = unknown>(path: string, data: unknown): Promise<T> {
  return fetchApi(path, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function postApi<T = unknown>(path: string, data?: unknown): Promise<T> {
  return fetchApi(path, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function deleteApi<T = unknown>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = new Error(`API error: ${res.status}`) as Error & { status: number };
    error.status = res.status;
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
}
