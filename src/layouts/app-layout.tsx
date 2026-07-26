import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppServices } from '@/app/providers/app-context';
import { useMe } from '@/features/auth/hooks/use-me';
import { useActiveContext } from '@/features/context/model/context-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function AppLayout() {
  const { session } = useAppServices();
  const { data: user } = useMe();
  const { activeContext } = useActiveContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await session.logout();
    } catch {
      // A limpeza local é garantida pelo controller.
    }
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <header className="topbar">
        <NavLink to="/" className="brand-mark brand-dark" aria-label="Prisma, início">
          <span aria-hidden="true">P</span>
          Prisma
        </NavLink>
        <nav aria-label="Navegação principal">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/perfil">Perfil</NavLink>
          {activeContext?.kind === 'academy' && (
            <NavLink to="/selecionar-contexto">Contexto</NavLink>
          )}
        </nav>
        <div className="user-actions">
          <span className="user-name">{user?.nome_completo}</span>
          <ThemeToggle compact />
          <button className="button button-quiet" onClick={() => void logout()}>
            Sair
          </button>
        </div>
      </header>
      <main id="main-content" className="app-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
