import { useTheme } from '@/app/providers/theme-provider';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'light' ? 'escuro' : 'claro';

  return (
    <button
      className={`theme-toggle ${compact ? 'theme-toggle-compact' : ''}`}
      onClick={toggleTheme}
      aria-label={`Ativar modo ${nextTheme}`}
      title={`Ativar modo ${nextTheme}`}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">{theme === 'light' ? '☀' : '☾'}</span>
      </span>
      {!compact && <span>{theme === 'light' ? 'Modo claro' : 'Modo escuro'}</span>}
    </button>
  );
}
