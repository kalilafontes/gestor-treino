import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <main className="center-page">
      <p className="eyebrow">Acesso restrito</p>
      <h1>Você não tem permissão para acessar este recurso</h1>
      <p>Sua sessão continua ativa. Volte para uma área disponível no seu contexto.</p>
      <Link className="button button-primary" to="/">
        Voltar ao início
      </Link>
    </main>
  );
}
