import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppServices } from '@/app/providers/app-context';
import { FormField } from '@/components/ui/form-field';
import { InlineAlert } from '@/components/feedback/status';
import { ApiError } from '@/services/api/http/api-error';
import { loginSchema, type LoginValues } from '../schemas/auth-schemas';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function safeReturnPath(value: unknown) {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('://')) return null;
  return value;
}

export function LoginPage() {
  const { session, sessionStatus } = useAppServices();
  const location = useLocation();
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  if (sessionStatus === 'authenticated') return <Navigate to="/" replace />;

  const submit = handleSubmit(async (values) => {
    setGeneralError('');
    try {
      await session.login(values.email, values.senha);
      const intended = safeReturnPath((location.state as { from?: unknown } | null)?.from);
      navigate(intended ?? '/', { replace: true });
    } catch (error) {
      setGeneralError(
        error instanceof ApiError && error.status === 401
          ? 'Email ou senha inválidos.'
          : 'Não foi possível entrar. Verifique sua conexão e tente novamente.',
      );
    }
  });

  return (
    <main className="auth-page">
      <section className="brand-panel" aria-label="Prisma Academia">
        <Link to="/login" className="brand-mark" aria-label="Prisma Academia, início">
          <span aria-hidden="true">P</span>
          Prisma
        </Link>
        <div>
          <p className="eyebrow">Seu treino. Sua gestão.</p>
          <h1>Todo progresso começa com um bom contexto.</h1>
          <p>Uma experiência clara para academias, professores e alunos.</p>
        </div>
      </section>
      <section className="form-panel" aria-labelledby="login-title">
        <div className="auth-theme-control">
          <ThemeToggle />
        </div>
        <div className="form-card">
          <p className="eyebrow">Bem-vindo de volta</p>
          <h2 id="login-title">Entre na sua conta</h2>
          <p className="subtle">Use as credenciais cadastradas na Prisma Academia.</p>
          {generalError && <InlineAlert>{generalError}</InlineAlert>}
          <form onSubmit={submit} noValidate>
            <FormField
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <FormField
              label="Senha"
              type="password"
              autoComplete="current-password"
              error={errors.senha?.message}
              {...register('senha')}
            />
            <button className="button button-primary button-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
          <p className="form-footer">
            Ainda não tem conta? <Link to="/cadastro">Crie sua conta</Link>
          </p>
          {import.meta.env.DEV && (
            <details className="demo-credentials">
              <summary>Contas de demonstração</summary>
              <div className="demo-account">
                <strong>Aluno</strong>
                <code>aluno@prisma.test</code>
              </div>
              <div className="demo-account">
                <strong>Professor</strong>
                <code>professor@prisma.test</code>
              </div>
              <p>
                Senha para ambas: <code>Prisma123</code>
              </p>
            </details>
          )}
        </div>
      </section>
    </main>
  );
}
