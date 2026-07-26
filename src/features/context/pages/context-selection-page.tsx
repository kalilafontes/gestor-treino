import { Navigate, useNavigate } from 'react-router-dom';
import { useActiveContext } from '../model/context-provider';
import { contextHome } from '../model/context';

const functionLabels = {
  aluno: 'Aluno',
  professor: 'Professor',
  admin_academia: 'Administração',
} as const;

export function ContextSelectionPage() {
  const { contexts, selectContext } = useActiveContext();
  const navigate = useNavigate();
  if (contexts.length === 1 && contexts[0])
    return <Navigate to={contextHome(contexts[0])} replace />;

  return (
    <main className="context-page">
      <div className="content-narrow">
        <p className="eyebrow">Escolha seu espaço</p>
        <h1>Como você quer entrar?</h1>
        <p className="subtle">
          Você pode trocar de contexto depois. A escolha não altera suas permissões.
        </p>
        <div className="context-grid" role="list" aria-label="Contextos disponíveis">
          {contexts.map((context) => {
            if (context.kind === 'global') return null;
            return (
              <button
                key={`${context.academyId}-${context.function}`}
                className="context-card"
                role="listitem"
                onClick={() => {
                  selectContext(context);
                  navigate(contextHome(context));
                }}
              >
                <span className="context-icon" aria-hidden="true">
                  {context.academyName.charAt(0)}
                </span>
                <span>
                  <strong>{context.academyName}</strong>
                  <small>{functionLabels[context.function]}</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
