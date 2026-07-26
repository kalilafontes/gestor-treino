import { Navigate } from 'react-router-dom';
import { useMe } from '@/features/auth/hooks/use-me';
import { useActiveContext } from '@/features/context/model/context-provider';
import { contextHome } from '@/features/context/model/context';

export function HomeRouter() {
  const { data: user } = useMe();
  const { activeContext, contexts } = useActiveContext();
  if (user?.role_global === 'super_admin') return <Navigate to="/admin/academias" replace />;
  if (contexts.length === 0) return <Navigate to="/sem-academia" replace />;
  if (!activeContext) return <Navigate to="/selecionar-contexto" replace />;
  return <Navigate to={contextHome(activeContext)} replace />;
}

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="module-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="coming-soon">A fundação está pronta para o próximo módulo.</div>
    </section>
  );
}
