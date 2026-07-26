import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from '@/services/mocks/server';
import { resetMockScenario } from '@/services/mocks/scenario';
import { tokenStore } from '@/features/auth/session/token-store';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockScenario();
  tokenStore.clear();
  localStorage.clear();
});
afterAll(() => server.close());
