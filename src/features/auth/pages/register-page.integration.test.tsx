import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { RegisterPage } from './register-page';
import { renderWithServices } from '@/test/render';

describe('RegisterPage', () => {
  it('mantém valores e associa conflito ao email', async () => {
    const user = userEvent.setup();
    renderWithServices(<RegisterPage />, { route: '/cadastro' });
    await user.type(screen.getByLabelText('Nome completo'), 'Nova Pessoa');
    await user.type(screen.getByLabelText('Email'), 'duplicado@prisma.test');
    await user.type(screen.getByLabelText('Senha'), 'Prisma123');
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));
    expect(await screen.findByText('Este email já está cadastrado.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome completo')).toHaveValue('Nova Pessoa');
  });

  it('não possui violações axe', async () => {
    const { container } = renderWithServices(<RegisterPage />, { route: '/cadastro' });
    expect((await axe(container)).violations).toEqual([]);
  });
});
