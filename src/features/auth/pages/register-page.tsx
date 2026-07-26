import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppServices } from '@/app/providers/app-context';
import { FormField } from '@/components/ui/form-field';
import { InlineAlert } from '@/components/feedback/status';
import { authApi } from '../api/auth-api';
import { registerSchema, type RegisterValues } from '../schemas/auth-schemas';
import { ApiError } from '@/services/api/http/api-error';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function RegisterPage() {
  const { apiClient } = useAppServices();
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const submit = handleSubmit(async (values) => {
    setGeneralError('');
    try {
      await authApi(apiClient).register(values);
      navigate('/login', {
        replace: true,
        state: { notice: 'Conta criada. Agora você já pode entrar.' },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        const emailError = error.fieldErrors.email?.[0];
        if (emailError) {
          setError('email', { message: emailError }, { shouldFocus: true });
          return;
        }
      }
      setGeneralError('Não foi possível criar sua conta. Tente novamente.');
    }
  });

  return (
    <main className="single-form-page">
      <div className="auth-theme-control">
        <ThemeToggle />
      </div>
      <Link to="/login" className="brand-mark brand-dark" aria-label="Prisma Academia">
        <span aria-hidden="true">P</span>
        Prisma
      </Link>
      <section className="form-card" aria-labelledby="register-title">
        <p className="eyebrow">Comece por aqui</p>
        <h1 id="register-title">Crie sua conta</h1>
        <p className="subtle">Seu vínculo com uma academia poderá ser adicionado depois.</p>
        {generalError && <InlineAlert>{generalError}</InlineAlert>}
        <form onSubmit={submit} noValidate>
          <FormField
            label="Nome completo"
            autoComplete="name"
            error={errors.nome_completo?.message}
            {...register('nome_completo')}
          />
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
            autoComplete="new-password"
            hint="Use pelo menos 8 caracteres."
            error={errors.senha?.message}
            {...register('senha')}
          />
          <button className="button button-primary button-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>
        <p className="form-footer">
          Já tem conta? <Link to="/login">Voltar para o login</Link>
        </p>
      </section>
    </main>
  );
}
