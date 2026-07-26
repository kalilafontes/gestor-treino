import type { ValidationEnvelope } from '@/services/api/contracts/auth.v1';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function safeErrorMessage(status: number) {
  if (status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (status === 403) return 'Você não tem permissão para acessar este recurso.';
  if (status >= 500) return 'O serviço está indisponível. Tente novamente.';
  return 'Não foi possível concluir a solicitação.';
}

export async function toApiError(response: Response) {
  let body: Partial<ValidationEnvelope> & { message?: string } = {};
  try {
    body = (await response.json()) as typeof body;
  } catch {
    // Corpos inválidos nunca são expostos.
  }
  const fields = Object.fromEntries(
    Object.entries(body.errors ?? {}).map(([key, value]) => [
      key,
      Array.isArray(value) ? value : [value],
    ]),
  );
  return new ApiError(response.status, safeErrorMessage(response.status), fields);
}
