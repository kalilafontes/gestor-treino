import type { SessionController } from '@/features/auth/session/session-controller';
import { tokenStore } from '@/features/auth/session/token-store';
import { toApiError } from './api-error';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
  retried?: boolean;
}

export class ApiClient {
  constructor(private readonly getSession: () => SessionController) {}

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { body, auth = true, retried = false, headers, ...init } = options;
    const token = tokenStore.get();
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (response.status === 401 && auth && !retried) {
      await this.getSession().refresh();
      return this.request<T>(path, { ...options, retried: true });
    }
    if (!response.ok) throw await toApiError(response);
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}
