import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAppServices } from '@/app/providers/app-context';
import { FormField } from '@/components/ui/form-field';
import { InlineAlert, PageLoader } from '@/components/feedback/status';
import { useMe, meQueryKey } from '../hooks/use-me';
import { authApi } from '../api/auth-api';
import { profileSchema, type ProfileValues } from '../schemas/auth-schemas';
import { ApiError } from '@/services/api/http/api-error';

export function ProfilePage() {
  const { apiClient, queryClient } = useAppServices();
  const { data: user } = useMe();
  const [success, setSuccess] = useState('');
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema) });
  useEffect(() => reset({ nome_completo: user?.nome_completo ?? '' }), [reset, user]);

  const mutation = useMutation({
    mutationFn: authApi(apiClient).updateProfile,
    onSuccess: async (updated) => {
      queryClient.setQueryData(meQueryKey, updated);
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      setSuccess('Perfil atualizado com sucesso.');
    },
    onError: (error) => {
      if (error instanceof ApiError && error.fieldErrors.nome_completo?.[0]) {
        setError('nome_completo', {
          message: error.fieldErrors.nome_completo[0],
        });
      }
    },
  });

  if (!user) return <PageLoader label="Carregando perfil" />;
  return (
    <div className="content-narrow">
      <p className="eyebrow">Sua conta</p>
      <h1>Perfil</h1>
      <p className="subtle">Mantenha seu nome atualizado para a equipe reconhecer você.</p>
      {success && <InlineAlert kind="success">{success}</InlineAlert>}
      {mutation.isError && !errors.nome_completo && (
        <InlineAlert>Não foi possível salvar. Tente novamente.</InlineAlert>
      )}
      <form
        onSubmit={handleSubmit((values) => {
          setSuccess('');
          mutation.mutate(values);
        })}
        noValidate
      >
        <FormField
          label="Nome completo"
          autoComplete="name"
          error={errors.nome_completo?.message}
          {...register('nome_completo')}
        />
        <FormField id="profile-email" label="Email" value={user.email} disabled readOnly />
        <button className="button button-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  );
}
