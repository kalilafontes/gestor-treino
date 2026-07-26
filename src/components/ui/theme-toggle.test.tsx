import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  it('alterna e persiste o tema', async () => {
    localStorage.setItem('prisma.theme', 'light');
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Ativar modo escuro' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('prisma.theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Ativar modo claro' })).toBeInTheDocument();
  });
});
