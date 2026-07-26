import type { MockUserKey } from './fixtures/users';

export type MockFailure =
  | 'none'
  | 'refresh-expired'
  | 'logout-network'
  | 'me-forbidden'
  | 'me-server'
  | 'profile-validation';

export interface MockScenario {
  user: MockUserKey;
  failure: MockFailure;
  latency: number;
  authenticated: boolean;
  refreshCount: number;
}

export const mockScenario: MockScenario = {
  user: 'aluno',
  failure: 'none',
  latency: 80,
  authenticated: false,
  refreshCount: 0,
};

export function setMockScenario(input: Partial<MockScenario>) {
  Object.assign(mockScenario, input);
}

export function resetMockScenario() {
  Object.assign(mockScenario, {
    user: 'aluno',
    failure: 'none',
    latency: 0,
    authenticated: false,
    refreshCount: 0,
  });
}
