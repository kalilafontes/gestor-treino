import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppServicesContext } from './app-context';
import { ApiClient } from '@/services/api/http/api-client';
import { ApiError } from '@/services/api/http/api-error';
import { SessionController } from '@/features/auth/session/session-controller';
import { cookieSessionTransport } from '@/features/auth/session/session-transport';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry(failureCount, error) {
          if (error instanceof ApiError && [401, 403].includes(error.status)) return false;
          return failureCount < 1;
        },
      },
      mutations: { retry: false },
    },
  });
}

export function AppProviders({ children }: PropsWithChildren) {
  const [sessionStatus, setSessionStatus] = useState<
    'unknown' | 'anonymous' | 'authenticating' | 'refreshing' | 'authenticated' | 'signingOut'
  >('unknown');
  const services = useMemo(() => {
    const queryClient = createQueryClient();
    // A referência tardia evita acoplar o cliente HTTP à construção do controller.
    let session!: SessionController;
    const apiClient = new ApiClient(() => session);
    session = new SessionController(cookieSessionTransport, queryClient, () =>
      setSessionStatus(session.status),
    );
    return { queryClient, apiClient, session };
  }, []);

  useEffect(() => {
    void services.session.bootstrap();
  }, [services]);

  return (
    <QueryClientProvider client={services.queryClient}>
      <AppServicesContext.Provider value={{ ...services, sessionStatus }}>
        {children}
      </AppServicesContext.Provider>
    </QueryClientProvider>
  );
}
