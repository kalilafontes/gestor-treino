import { ErrorState, PageLoader } from '@/components/feedback/status';
import { Link } from 'react-router-dom';
import { useTeacherPlans } from '../hooks/use-training';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAppServices } from '@/app/providers/app-context';
import { trainingApi } from '../api/training-api';
import { InlineAlert } from '@/components/feedback/status';

export function TeacherPlansPage() {
  const { apiClient, queryClient } = useAppServices();
  const plans = useTeacherPlans();
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [exerciseCount, setExerciseCount] = useState(6);
  const createPlan = useMutation({
    mutationFn: trainingApi(apiClient).createTeacherPlan,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teacher-plans'] });
      setCreating(false);
      setTitle('');
      setExerciseCount(6);
    },
  });
  if (plans.isLoading) return <PageLoader label="Carregando seus planos" />;
  if (plans.isError) return <ErrorState retry={() => void plans.refetch()} />;
  const visiblePlans = plans.data?.filter((plan) =>
    plan.title.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')),
  );

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Área do professor</p>
          <h1>Planos de treino</h1>
          <p>Organize seus planos e acompanhe as atribuições aos alunos.</p>
        </div>
        <button className="button button-primary" onClick={() => setCreating(true)}>
          Criar novo plano
        </button>
      </div>

      {creating && (
        <section className="action-panel" aria-labelledby="new-plan-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Novo plano</p>
              <h2 id="new-plan-title">Monte a estrutura inicial</h2>
            </div>
            <button className="button button-quiet" onClick={() => setCreating(false)}>
              Cancelar
            </button>
          </div>
          {createPlan.isError && <InlineAlert>Não foi possível criar o plano.</InlineAlert>}
          <form
            className="inline-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (title.trim().length < 2) return;
              createPlan.mutate({ title, exercises: exerciseCount });
            }}
          >
            <label>
              Nome do plano
              <input value={title} onChange={(event) => setTitle(event.target.value)} required />
            </label>
            <label>
              Quantidade de exercícios
              <input
                type="number"
                min="1"
                max="20"
                value={exerciseCount}
                onChange={(event) => setExerciseCount(Number(event.target.value))}
              />
            </label>
            <button className="button button-primary" disabled={createPlan.isPending}>
              {createPlan.isPending ? 'Criando…' : 'Criar plano'}
            </button>
          </form>
        </section>
      )}

      <div className="metric-grid" aria-label="Resumo dos planos">
        <article>
          <span>Planos ativos</span>
          <strong>3</strong>
        </article>
        <article>
          <span>Alunos atendidos</span>
          <strong>16</strong>
        </article>
        <article>
          <span>Atribuições nesta semana</span>
          <strong>7</strong>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Biblioteca</p>
          <h2>Seus planos</h2>
        </div>
        <label className="search-field">
          <span className="sr-only">Buscar plano</span>
          <input
            type="search"
            placeholder="Buscar plano"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      <div className="plan-list">
        {visiblePlans?.map((plan) => (
          <article className="plan-row" key={plan.id}>
            <span className="plan-monogram" aria-hidden="true">
              {plan.title.charAt(0)}
            </span>
            <div className="plan-main">
              <h3>{plan.title}</h3>
              <p>{plan.updatedAt}</p>
            </div>
            <dl>
              <div>
                <dt>Alunos</dt>
                <dd>{plan.students}</dd>
              </div>
              <div>
                <dt>Exercícios</dt>
                <dd>{plan.exercises}</dd>
              </div>
            </dl>
            <Link className="button button-quiet" to={`/app/planos/${plan.id}`}>
              Ver plano
            </Link>
          </article>
        ))}
      </div>
      {visiblePlans?.length === 0 && (
        <p className="empty-result" role="status">
          Nenhum plano encontrado para “{search}”.
        </p>
      )}
    </section>
  );
}
