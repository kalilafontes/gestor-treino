import { describe, expect, it, vi } from 'vitest';
import { ApiClient } from './api-client';
import { tokenStore } from '@/features/auth/session/token-store';

describe('ApiClient', () => {
  it('repete uma chamada protegida no máximo uma vez após refresh', async () => {
    tokenStore.set('old');
    const refresh = vi.fn(async () => tokenStore.set('new'));
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}', { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    const client = new ApiClient(() => ({ refresh }) as never);
    await expect(client.request('/private')).resolves.toEqual({ data: 'ok' });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]?.headers).toMatchObject({
      Authorization: 'Bearer new',
    });
  });

  it('não tenta refresh em 403', async () => {
    const refresh = vi.fn();
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'forbidden' }), { status: 403 }),
    );
    const client = new ApiClient(() => ({ refresh }) as never);
    await expect(client.request('/private')).rejects.toMatchObject({ status: 403 });
    expect(refresh).not.toHaveBeenCalled();
  });
});
