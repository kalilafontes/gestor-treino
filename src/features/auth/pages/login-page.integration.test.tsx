import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { LoginPage } from './login-page';
import { renderWithServices } from '@/test/render';
import { ApiError } from '@/services/api/http/api-error';

describe('LoginPage', () => {
  it('associa erros de validação aos campos', async () => {
    const user = userEvent.setup();
    renderWithServices(<LoginPage />);
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Informe um email válido.')).toBeInTheDocument();
    expect(screen.getByText('Informe sua senha.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('envia somente email e senha ao controller', async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithServices(<LoginPage />, { session: { login } });
    await user.type(screen.getByLabelText('Email'), 'aluno@prisma.test');
    await user.type(screen.getByLabelText('Senha'), 'Prisma123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(login).toHaveBeenCalledWith('aluno@prisma.test', 'Prisma123');
  });

  it('mostra mensagem segura para 401', async () => {
    const user = userEvent.setup();
    renderWithServices(<LoginPage />, {
      session: { login: vi.fn().mockRejectedValue(new ApiError(401, 'detalhe técnico')) },
    });
    await user.type(screen.getByLabelText('Email'), 'aluno@prisma.test');
    await user.type(screen.getByLabelText('Senha'), 'errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou senha inválidos');
    expect(screen.queryByText('detalhe técnico')).not.toBeInTheDocument();
  });

  it('não possui violações axe na tela inicial', async () => {
    const { container } = renderWithServices(<LoginPage />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
