import type { ApiEnvelope } from '@/services/api/contracts/auth.v1';
import type {
  CreateTeacherPlanRequest,
  StudentWorkout,
  TeacherPlan,
} from '@/services/api/contracts/training.v1';
import type { ApiClient } from '@/services/api/http/api-client';

export const trainingApi = (client: ApiClient) => ({
  studentWorkouts: () =>
    client
      .request<ApiEnvelope<StudentWorkout[]>>('/v1/aluno/treinos')
      .then((response) => response.data),
  teacherPlans: () =>
    client
      .request<ApiEnvelope<TeacherPlan[]>>('/v1/professor/planos')
      .then((response) => response.data),
  createTeacherPlan: (input: CreateTeacherPlanRequest) =>
    client
      .request<ApiEnvelope<TeacherPlan>>('/v1/professor/planos', {
        method: 'POST',
        body: input,
      })
      .then((response) => response.data),
});
