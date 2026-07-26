import { createContext, useContext } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import type { ApiClient } from '@/services/api/http/api-client';
import type { SessionController, SessionStatus } from '@/features/auth/session/session-controller';

export interface AppServices {
  queryClient: QueryClient;
  apiClient: ApiClient;
  session: SessionController;
  sessionStatus: SessionStatus;
}

export const AppServicesContext = createContext<AppServices | null>(null);

export function useAppServices() {
  const value = useContext(AppServicesContext);
  if (!value) throw new Error('AppServicesProvider ausente');
  return value;
}
