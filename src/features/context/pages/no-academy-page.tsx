export function NoAcademyPage() {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        ◇
      </span>
      <p className="eyebrow">Conta pronta</p>
      <h1>Aguardando vínculo</h1>
      <p>
        Sua conta ainda não está vinculada a uma academia. Peça a um administrador para adicionar
        você.
      </p>
    </div>
  );
}
