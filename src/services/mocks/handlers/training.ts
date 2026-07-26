import { delay, http, HttpResponse } from 'msw';
import { mockStudentWorkouts, mockTeacherPlans } from '../fixtures/training';
import { mockScenario } from '../scenario';
import type { CreateTeacherPlanRequest } from '@/services/api/contracts/training.v1';

export const trainingHandlers = [
  http.get('/v1/aluno/treinos', async ({ request }) => {
    await delay(mockScenario.latency);
    if (!request.headers.get('authorization')) {
      return HttpResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }
    return HttpResponse.json({ data: mockStudentWorkouts });
  }),
  http.get('/v1/professor/planos', async ({ request }) => {
    await delay(mockScenario.latency);
    if (!request.headers.get('authorization')) {
      return HttpResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }
    return HttpResponse.json({ data: mockTeacherPlans });
  }),
  http.post('/v1/professor/planos', async ({ request }) => {
    await delay(mockScenario.latency);
    if (!request.headers.get('authorization')) {
      return HttpResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }
    const body = (await request.json()) as CreateTeacherPlanRequest;
    if (body.title.trim().length < 2) {
      return HttpResponse.json({ errors: { title: ['Informe um nome válido.'] } }, { status: 422 });
    }
    const plan = {
      id: `plano-${Date.now()}`,
      title: body.title.trim(),
      students: 0,
      exercises: body.exercises,
      updatedAt: 'Criado agora',
    };
    mockTeacherPlans.unshift(plan);
    return HttpResponse.json({ data: plan }, { status: 201 });
  }),
];
