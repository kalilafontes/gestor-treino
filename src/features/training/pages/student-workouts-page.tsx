import { ErrorState, PageLoader } from '@/components/feedback/status';
import { Link } from 'react-router-dom';
import { useStudentWorkouts } from '../hooks/use-training';

export function StudentWorkoutsPage() {
  const workouts = useStudentWorkouts();
  if (workouts.isLoading) return <PageLoader label="Carregando seus treinos" />;
  if (workouts.isError) return <ErrorState retry={() => void workouts.refetch()} />;

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Seu programa</p>
          <h1>Treinos</h1>
          <p>Planos preparados para você por Paulo Professor.</p>
        </div>
        <div className="week-progress" aria-label="Progresso semanal: 2 de 4 treinos">
          <strong>2 de 4</strong>
          <span>treinos na semana</span>
        </div>
      </div>

      <div className="metric-grid" aria-label="Resumo dos treinos">
        <article>
          <span>Sequência atual</span>
          <strong>4 semanas</strong>
        </article>
        <article>
          <span>Último treino</span>
          <strong>Quinta, 18:30</strong>
        </article>
        <article>
          <span>Tempo treinado</span>
          <strong>1h 42min</strong>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Planos ativos</p>
          <h2>Escolha seu treino de hoje</h2>
        </div>
      </div>

      <div className="workout-grid">
        {workouts.data?.map((workout, index) => (
          <article className="workout-card" key={workout.id}>
            <div className="workout-card-top">
              <span className={index === 0 ? 'status-pill status-highlight' : 'status-pill'}>
                {workout.status}
              </span>
              <span aria-hidden="true">0{index + 1}</span>
            </div>
            <h3>{workout.title}</h3>
            <p>Com {workout.coach}</p>
            <dl>
              <div>
                <dt>Frequência</dt>
                <dd>{workout.frequency}</dd>
              </div>
              <div>
                <dt>Exercícios</dt>
                <dd>{workout.exercises}</dd>
              </div>
              <div>
                <dt>Duração</dt>
                <dd>{workout.duration}</dd>
              </div>
            </dl>
            <Link className="button button-primary" to={`/app/treinos/${workout.id}`}>
              Abrir treino
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
