import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import type { SessionTransport } from './session-transport';
import { SessionController } from './session-controller';
import { tokenStore } from './token-store';

function transport(overrides: Partial<SessionTransport> = {}): SessionTransport {
  return {
    login: vi.fn().mockResolvedValue({
      data: { access_token: 'login-token', expires_in: 900 },
    }),
    refresh: vi.fn().mockResolvedValue({
      data: { access_token: 'refresh-token', expires_in: 900 },
    }),
    logout: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('SessionController', () => {
  it('compartilha um único refresh entre chamadas concorrentes', async () => {
    const sessionTransport = transport();
    const controller = new SessionController(sessionTransport, new QueryClient());
    const results = await Promise.all([
      controller.refresh(),
      controller.refresh(),
      controller.refresh(),
    ]);
    expect(sessionTransport.refresh).toHaveBeenCalledTimes(1);
    expect(results).toEqual(['refresh-token', 'refresh-token', 'refresh-token']);
  });

  it('limpa token e cache quando refresh falha', async () => {
    tokenStore.set('private');
    const client = new QueryClient();
    client.setQueryData(['me'], { id: 'private' });
    const controller = new SessionController(
      transport({ refresh: vi.fn().mockRejectedValue(new Error('expired')) }),
      client,
    );
    await expect(controller.refresh()).rejects.toThrow('expired');
    expect(tokenStore.get()).toBeNull();
    expect(client.getQueryData(['me'])).toBeUndefined();
    expect(controller.status).toBe('anonymous');
  });

  it('limpa sessão mesmo quando revogação falha', async () => {
    tokenStore.set('private');
    const controller = new SessionController(
      transport({ logout: vi.fn().mockRejectedValue(new Error('network')) }),
      new QueryClient(),
    );
    await expect(controller.logout()).rejects.toThrow('network');
    expect(tokenStore.get()).toBeNull();
    expect(controller.status).toBe('anonymous');
  });
});
