export function PageLoader({ label = 'Carregando' }: { label?: string }) {
  return (
    <main className="center-page" aria-busy="true">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </main>
  );
}

export function InlineAlert({
  children,
  kind = 'error',
}: {
  children: React.ReactNode;
  kind?: 'error' | 'success';
}) {
  return (
    <div className={`alert alert-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}

export function ErrorState({ retry }: { retry?: () => void }) {
  return (
    <main className="center-page">
      <p className="eyebrow">Algo não saiu como esperado</p>
      <h1>Não foi possível carregar seus dados</h1>
      <p>Verifique sua conexão e tente novamente.</p>
      {retry && (
        <button className="button button-primary" onClick={retry}>
          Tentar novamente
        </button>
      )}
    </main>
  );
}
