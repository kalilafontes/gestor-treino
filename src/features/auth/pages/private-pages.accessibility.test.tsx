import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { AppServicesContext } from '@/app/providers/app-context';
import { ApiClient } from '@/services/api/http/api-client';
import { SessionController } from '@/features/auth/session/session-controller';
import { cookieSessionTransport } from '@/features/auth/session/session-transport';
import { tokenStore } from '@/features/auth/session/token-store';
import { setMockScenario } from '@/services/mocks/scenario';
import { ActiveContextProvider } from '@/features/context/model/context-provider';
import { ContextSelectionPage } from '@/features/context/pages/context-selection-page';
import { ProfilePage } from './profile-page';

function renderPrivate(element: React.ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let session!: SessionController;
  const apiClient = new ApiClient(() => session);
  session = new SessionController(cookieSessionTransport, queryClient);
  tokenStore.set('test-token');
  return render(
    <QueryClientProvider client={queryClient}>
      <AppServicesContext.Provider
        value={{ queryClient, apiClient, session, sessionStatus: 'authenticated' }}
      >
        <MemoryRouter>
          <ActiveContextProvider>{element}</ActiveContextProvider>
        </MemoryRouter>
      </AppServicesContext.Provider>
    </QueryClientProvider>,
  );
}

describe('acessibilidade das páginas privadas', () => {
  it('não encontra violações na seleção de contexto', async () => {
    setMockScenario({ authenticated: true, user: 'multi' });
    const view = renderPrivate(<ContextSelectionPage />);
    await screen.findByRole('heading', { name: 'Como você quer entrar?' });
    expect((await axe(view.container)).violations).toEqual([]);
  });

  it('não encontra violações no perfil', async () => {
    setMockScenario({ authenticated: true, user: 'aluno' });
    const view = renderPrivate(<ProfilePage />);
    await screen.findByRole('heading', { name: 'Perfil' });
    expect((await axe(view.container)).violations).toEqual([]);
  });
});
