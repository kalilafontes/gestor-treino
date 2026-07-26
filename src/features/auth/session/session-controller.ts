import type { QueryClient } from '@tanstack/react-query';
import type { SessionTransport } from './session-transport';
import { tokenStore } from './token-store';

export type SessionStatus =
  'unknown' | 'anonymous' | 'authenticating' | 'refreshing' | 'authenticated' | 'signingOut';

export class SessionController {
  private refreshPromise: Promise<string> | null = null;
  private clearPromise: Promise<void> | null = null;
  status: SessionStatus = 'unknown';

  constructor(
    private readonly transport: SessionTransport,
    private readonly queryClient: QueryClient,
    private readonly onChange: () => void = () => undefined,
  ) {}

  private setStatus(status: SessionStatus) {
    this.status = status;
    this.onChange();
  }

  async login(email: string, senha: string) {
    this.setStatus('authenticating');
    try {
      const response = await this.transport.login({ email, senha });
      tokenStore.set(response.data.access_token);
      this.setStatus('authenticated');
    } catch (error) {
      this.setStatus('anonymous');
      throw error;
    }
  }

  async refresh() {
    if (this.refreshPromise) return this.refreshPromise;
    this.setStatus('refreshing');
    this.refreshPromise = this.transport
      .refresh()
      .then((response) => {
        tokenStore.set(response.data.access_token);
        this.setStatus('authenticated');
        return response.data.access_token;
      })
      .catch(async (error: unknown) => {
        await this.clear();
        throw error;
      })
      .finally(() => {
        this.refreshPromise = null;
      });
    return this.refreshPromise;
  }

  async bootstrap() {
    try {
      await this.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async clear() {
    if (this.clearPromise) return this.clearPromise;
    tokenStore.clear();
    this.setStatus('anonymous');
    this.clearPromise = this.queryClient
      .cancelQueries()
      .then(() => this.queryClient.clear())
      .finally(() => {
        this.clearPromise = null;
      });
    return this.clearPromise;
  }

  async logout() {
    const token = tokenStore.get();
    this.setStatus('signingOut');
    try {
      await this.transport.logout(token);
    } finally {
      await this.clear();
    }
  }
}
