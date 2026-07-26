import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ErrorState, PageLoader } from '@/components/feedback/status';
import { useAppServices } from '@/app/providers/app-context';
import { useMe } from '@/features/auth/hooks/use-me';
import { useActiveContext } from '@/features/context/model/context-provider';
import type { AcademyFunction } from '@/services/api/contracts/auth.v1';

export function AnonymousOnly({ children }: PropsWithChildren) {
  const { sessionStatus } = useAppServices();
  if (sessionStatus === 'unknown' || sessionStatus === 'refreshing') {
    return <PageLoader label="Verificando sessão" />;
  }
  if (sessionStatus === 'authenticated') return <Navigate to="/" replace />;
  return children;
}

export function RequireSession({ children }: PropsWithChildren) {
  const { sessionStatus } = useAppServices();
  const location = useLocation();
  if (sessionStatus === 'unknown' || sessionStatus === 'refreshing') {
    return <PageLoader label="Verificando sessão" />;
  }
  if (sessionStatus !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}

export function RequireProfile({ children }: PropsWithChildren) {
  const profile = useMe();
  if (profile.isLoading) return <PageLoader label="Carregando seu espaço" />;
  if (profile.isError) return <ErrorState retry={() => void profile.refetch()} />;
  return children;
}

export function RequireContext({ children }: PropsWithChildren) {
  const { data: user } = useMe();
  const { activeContext, contexts } = useActiveContext();
  if (user?.role_global === 'padrao' && contexts.length === 0) {
    return <Navigate to="/sem-academia" replace />;
  }
  if (!activeContext) return <Navigate to="/selecionar-contexto" replace />;
  return children;
}

export function RequireGlobalRole({ children }: PropsWithChildren) {
  const { data: user } = useMe();
  if (user?.role_global !== 'super_admin') return <Navigate to="/forbidden" replace />;
  return children;
}

export function RequireAcademyFunction({
  functions,
  children,
}: PropsWithChildren<{ functions: AcademyFunction[] }>) {
  const { activeContext } = useActiveContext();
  if (activeContext?.kind !== 'academy' || !functions.includes(activeContext.function)) {
    return <Navigate to="/forbidden" replace />;
  }
  return children;
}
