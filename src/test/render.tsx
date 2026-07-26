import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppServicesContext } from '@/app/providers/app-context';
import { ApiClient } from '@/services/api/http/api-client';
import type { SessionController, SessionStatus } from '@/features/auth/session/session-controller';
import { ThemeProvider } from '@/app/providers/theme-provider';

export function renderWithServices(
  element: ReactElement,
  {
    session,
    status = 'anonymous',
    route = '/login',
  }: {
    session?: Partial<SessionController>;
    status?: SessionStatus;
    route?: string;
  } = {},
) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const sessionService = {
    status,
    login: async () => undefined,
    refresh: async () => '',
    logout: async () => undefined,
    bootstrap: async () => false,
    clear: async () => undefined,
    ...session,
  } as SessionController;
  const apiClient = new ApiClient(() => sessionService);
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppServicesContext.Provider
          value={{ queryClient, apiClient, session: sessionService, sessionStatus: status }}
        >
          <MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>
        </AppServicesContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>,
  );
}
