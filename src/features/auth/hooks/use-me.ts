import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth-api';
import { useAppServices } from '@/app/providers/app-context';

export const meQueryKey = ['me'] as const;

export function useMe() {
  const { apiClient, sessionStatus } = useAppServices();
  return useQuery({
    queryKey: meQueryKey,
    queryFn: authApi(apiClient).me,
    enabled: sessionStatus === 'authenticated',
  });
}
