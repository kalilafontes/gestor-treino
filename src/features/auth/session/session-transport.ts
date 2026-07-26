import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
} from '@/services/api/contracts/auth.v1';
import { toApiError } from '@/services/api/http/api-error';

const API_URL = import.meta.env.VITE_API_URL ?? '';

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) throw await toApiError(response);
  return response.json() as Promise<T>;
}

export interface SessionTransport {
  login(input: LoginRequest): Promise<LoginResponse>;
  refresh(): Promise<RefreshResponse>;
  logout(accessToken: string | null): Promise<void>;
}

export const cookieSessionTransport: SessionTransport = {
  login: (input) =>
    fetch(`${API_URL}/v1/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then(parse<LoginResponse>),
  refresh: () =>
    fetch(`${API_URL}/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    }).then(parse<RefreshResponse>),
  async logout(accessToken) {
    const response = await fetch(`${API_URL}/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    if (!response.ok) throw await toApiError(response);
  },
};
