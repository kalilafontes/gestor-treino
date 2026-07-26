import { delay, http, HttpResponse } from 'msw';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '@/services/api/contracts/auth.v1';
import { mockUsers } from '../fixtures/users';
import { mockScenario } from '../scenario';

const token = () => ({
  data: { access_token: `mock-access-${Date.now()}`, expires_in: 900 },
});

function findUser(email: string) {
  return Object.entries(mockUsers).find(([, user]) => user.email === email);
}

export const authHandlers = [
  http.post('/v1/auth/login', async ({ request }) => {
    await delay(mockScenario.latency);
    const body = (await request.json()) as LoginRequest;
    const match = findUser(body.email);
    if (!match || body.senha !== 'Prisma123') {
      return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }
    mockScenario.user = match[0] as keyof typeof mockUsers;
    mockScenario.authenticated = true;
    return HttpResponse.json(token(), {
      headers: {
        'Set-Cookie': `prisma_refresh=${match[0]}; HttpOnly; SameSite=Lax; Path=/`,
      },
    });
  }),

  http.post('/v1/auth/register', async ({ request }) => {
    await delay(mockScenario.latency);
    const body = (await request.json()) as RegisterRequest;
    if (findUser(body.email) || body.email === 'duplicado@prisma.test') {
      return HttpResponse.json(
        { message: 'Conflito', errors: { email: ['Este email já está cadastrado.'] } },
        { status: 409 },
      );
    }
    if (body.nome_completo.trim().length < 2) {
      return HttpResponse.json(
        { errors: { nome_completo: ['Informe pelo menos 2 caracteres.'] } },
        { status: 422 },
      );
    }
    return HttpResponse.json(
      {
        data: {
          id: 'usr-novo',
          nome_completo: body.nome_completo.trim(),
          email: body.email,
          role_global: 'padrao',
          academias: [],
        },
      },
      { status: 201 },
    );
  }),

  http.post('/v1/auth/refresh', async ({ cookies }) => {
    await delay(mockScenario.latency);
    mockScenario.refreshCount += 1;
    if (
      mockScenario.failure === 'refresh-expired' ||
      (!mockScenario.authenticated && !cookies.prisma_refresh)
    ) {
      return HttpResponse.json({ message: 'Refresh inválido' }, { status: 401 });
    }
    if (cookies.prisma_refresh && cookies.prisma_refresh in mockUsers) {
      mockScenario.user = cookies.prisma_refresh as keyof typeof mockUsers;
    }
    mockScenario.authenticated = true;
    return HttpResponse.json(token(), {
      headers: { 'Set-Cookie': 'prisma_refresh=rotated; HttpOnly; SameSite=Lax; Path=/' },
    });
  }),

  http.post('/v1/auth/logout', async () => {
    await delay(mockScenario.latency);
    mockScenario.authenticated = false;
    if (mockScenario.failure === 'logout-network') return HttpResponse.error();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/v1/auth/me', async ({ request }) => {
    await delay(mockScenario.latency);
    if (mockScenario.failure === 'me-forbidden') {
      return HttpResponse.json({ message: 'Proibido' }, { status: 403 });
    }
    if (mockScenario.failure === 'me-server') {
      return HttpResponse.json({ message: 'Falha' }, { status: 503 });
    }
    if (!mockScenario.authenticated || !request.headers.get('authorization')) {
      return HttpResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }
    return HttpResponse.json({ data: mockUsers[mockScenario.user] });
  }),

  http.patch('/v1/auth/me', async ({ request }) => {
    await delay(mockScenario.latency);
    if (!mockScenario.authenticated) {
      return HttpResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }
    const body = (await request.json()) as UpdateProfileRequest;
    if (mockScenario.failure === 'profile-validation' || body.nome_completo.trim().length < 2) {
      return HttpResponse.json(
        { errors: { nome_completo: ['O nome informado não é válido.'] } },
        { status: 422 },
      );
    }
    mockUsers[mockScenario.user].nome_completo = body.nome_completo.trim();
    return HttpResponse.json({ data: mockUsers[mockScenario.user] });
  }),
];
